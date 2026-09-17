"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { PageHeader, Panel, FormField } from './ui';
import { ROOMS, type Room, calculateTotals } from '../utils/bookingLogic';
import toast from 'react-hot-toast';

/* ── Static extra charges per room (simulated) ── */
interface ExtraCharge {
  description: string;
  date: string;
  amount: number;
}

const EXTRA_CHARGES: Record<string, ExtraCharge[]> = {
  '102': [
    { description: 'Mini-bar (Water x2)', date: '03/04/2026', amount: 100 },
    { description: 'Room Service', date: '03/04/2026', amount: 1200 },
    { description: 'Restaurant Bill', date: '03/04/2026', amount: 850 },
  ],
  '103': [
    { description: 'Mini-bar (Chips)', date: '03/04/2026', amount: 50 },
    { description: 'Restaurant Bill', date: '03/04/2026', amount: 1200 },
  ],
  '104': [
    { description: 'Laundry', date: '04/04/2026', amount: 350 },
  ],
  '105': [
    { description: 'Mini-bar (Juice x3)', date: '05/04/2026', amount: 150 },
    { description: 'Spa Service', date: '05/04/2026', amount: 2000 },
  ],
};

const NIGHTS = 2; // Static nights for demo

export default function GuestCheckout() {
  const router = useRouter();

  /* ── State ── */
  const [rooms] = useState<Room[]>(ROOMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Room | null>(null);
  const [selectedRoomNos, setSelectedRoomNos] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedOutRooms, setCheckedOutRooms] = useState<Set<string>>(new Set());

  /* ── Find guest by name or room number ── */
  const handleFindGuest = () => {
    const query = searchQuery.trim().toLowerCase() || roomSearch.trim();
    if (!query) {
      toast.error('Please enter a guest name or room number.');
      return;
    }

    const found = rooms.find(
      r => r.name.toLowerCase().includes(query) || r.roomNo === query
    );

    if (found) {
      setSelectedGuest(found);
      setSelectedRoomNos(new Set([found.roomNo]));
      toast.success(`Guest "${found.name}" found — Room ${found.roomNo}`);
    } else {
      toast.error(`No guest found for "${query}"`);
    }
  };

  /* ── Toggle room selection ── */
  const toggleRoom = (roomNo: string) => {
    setSelectedRoomNos(prev => {
      const next = new Set(prev);
      if (next.has(roomNo)) next.delete(roomNo);
      else next.add(roomNo);
      return next;
    });
  };

  /* ── Calculate bill for a single room ── */
  const getRoomBill = (room: Room) => {
    const base = calculateTotals(room.rent, NIGHTS);
    const extras = EXTRA_CHARGES[room.roomNo] || [];
    const extrasTotal = extras.reduce((sum, c) => sum + c.amount, 0);
    return {
      ...base,
      extras,
      extrasTotal,
      subtotal: base.total + extrasTotal,
    };
  };

  /* ── Grand total for all selected rooms ── */
  const grandTotal = useMemo(() => {
    let total = 0;
    selectedRoomNos.forEach(rn => {
      const room = rooms.find(r => r.roomNo === rn);
      if (room) total += getRoomBill(room).subtotal;
    });
    return total;
  }, [selectedRoomNos, rooms]);

  /* ── Guest's other rooms (simulated: show 1-2 related rooms) ── */
  const guestRooms = useMemo(() => {
    if (!selectedGuest) return [];
    // Show the selected room + the next room in the list (simulated multi-room booking)
    const idx = rooms.findIndex(r => r.roomNo === selectedGuest.roomNo);
    const related = [rooms[idx]];
    if (idx + 1 < rooms.length) related.push(rooms[idx + 1]);
    return related;
  }, [selectedGuest, rooms]);

  /* ── Process payment ── */
  const handlePayment = (mode: 'single' | 'combined') => {
    if (selectedRoomNos.size === 0) {
      toast.error('No rooms selected for checkout.');
      return;
    }
    setIsProcessing(true);
    toast.loading('Processing payment...', { duration: 2000 });
    setTimeout(() => {
      setIsProcessing(false);
      const roomList = Array.from(selectedRoomNos).join(', ');
      setCheckedOutRooms(prev => {
        const next = new Set(prev);
        selectedRoomNos.forEach(r => next.add(r));
        return next;
      });
      toast.success(`Payment successful! Rooms ${roomList} checked out.`);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <PageHeader
        title="Guest Check-out"
        onBack={() => router.push('/')}
        searchPlaceholder="Search Booking ID / Guest Name"
      />

      <div className="dashboard-container">
        <div className="checkout-main-grid">

          {/* ═══ Panel 1: Identify Departing Guest ═══ */}
          <Panel title="1. Identify Departing Guest" style={{ height: 'fit-content' }}>
            <div className="grid-2">
              <FormField label="Find Guest">
                <select
                  className="form-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                >
                  <option value="">Search Guest</option>
                  {rooms.map(r => (
                    <option key={r.roomNo} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Identify by Room">
                <input
                  type="text"
                  className="form-input"
                  value={roomSearch}
                  onChange={e => setRoomSearch(e.target.value)}
                  placeholder="Room No."
                />
              </FormField>
            </div>

            <div className="grid-2" style={{ marginTop: '12px' }}>
              <select className="form-input">
                <option>Select Guest from List</option>
                {rooms.map(r => (
                  <option key={r.roomNo} value={r.name}>{r.name} (Room {r.roomNo})</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleFindGuest}>Find Room/Guest</button>
            </div>

            {/* Guest info card */}
            {selectedGuest && (
              <>
                <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <label className="form-label">Guest Name</label>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedGuest.name}</div>
                    </div>
                    <div>
                      <label className="form-label" style={{ textAlign: 'right' }}>Room No.</label>
                      <div className="badge-room">Room {selectedGuest.roomNo}</div>
                    </div>
                  </div>
                </div>

                {/* Rooms table */}
                <table style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Checkout Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestRooms.map(room => (
                      <tr key={room.roomNo}>
                        <td>{room.roomNo}</td>
                        <td style={{ fontSize: '0.8rem' }}>{room.checkoutDate}</td>
                        <td>
                          {checkedOutRooms.has(room.roomNo) ? (
                            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem' }}>Checked Out</span>
                          ) : (
                            <span style={{ color: 'var(--btn-blue)', fontSize: '0.8rem' }}>Occupied</span>
                          )}
                        </td>
                        <td>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedRoomNos.has(room.roomNo)}
                              disabled={checkedOutRooms.has(room.roomNo)}
                              onChange={() => toggleRoom(room.roomNo)}
                            />
                            Select
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => {
                  const allNos = guestRooms.map(r => r.roomNo).filter(rn => !checkedOutRooms.has(rn));
                  setSelectedRoomNos(new Set(allNos));
                  toast.success('All available rooms selected');
                }}>
                  Select All Rooms
                </button>
              </>
            )}

            {!selectedGuest && (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-muted)', marginTop: '16px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>No guest selected</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Search by name or room number above to begin checkout.</div>
              </div>
            )}
          </Panel>

          {/* ═══ Panel 2: Review & Finalize Bill ═══ */}
          <Panel title="2. Review &amp; Finalize Bill" style={{ height: 'fit-content' }}>
            {selectedRoomNos.size === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>No rooms selected</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Select rooms from the left panel to review their bills.</div>
              </div>
            ) : (
              <>
                {Array.from(selectedRoomNos).map(roomNo => {
                  const room = rooms.find(r => r.roomNo === roomNo);
                  if (!room) return null;
                  const bill = getRoomBill(room);

                  return (
                    <div key={roomNo} style={{ marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      {/* Room header */}
                      <div style={{ backgroundColor: '#f4f6f8', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Room {room.roomNo}</h2>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                            {NIGHTS} Nights x Rs. {room.rent.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                          Rs. {bill.roomCharge.toFixed(2)}
                        </div>
                      </div>

                      <div style={{ padding: '16px' }}>
                        {/* Add charges row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Extra Charges</span>
                          <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: 'auto' }}>Mini-bar</button>
                          <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Laundry</button>
                          <button className="btn btn-primary" style={{ padding: '4px 8px' }}><Plus size={14} /></button>
                        </div>

                        {/* Charges table */}
                        {bill.extras.length > 0 ? (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ borderBottom: '2px solid var(--border-color)' }}>
                              <tr>
                                <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                                <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                                <th style={{ textAlign: 'right', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bill.extras.map((charge, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>{charge.description}</td>
                                  <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: 'var(--text-muted)' }}>{charge.date}</td>
                                  <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: 500 }}>Rs. {charge.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No extra charges</div>
                        )}

                        {/* Tax row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span>GST (12%)</span>
                          <span>Rs. {bill.tax.toFixed(2)}</span>
                        </div>

                        {/* Subtotal */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Room {room.roomNo} Subtotal</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>Rs. {bill.subtotal.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                          <button className="btn btn-secondary" onClick={() => toast.success(`Invoice for Room ${room.roomNo} printed`)}>
                            Print Invoice
                          </button>
                          <button className="btn btn-primary" onClick={() => toast('Adjusting charges...')}>
                            Adjust Charges
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Grand total bar */}
                <div style={{ backgroundColor: '#1a3a5c', color: 'white', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Selected Rooms Combined Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Rs. {grandTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </Panel>

          {/* ═══ Panel 3: Payment & Check-out ═══ */}
          <Panel title="3. Payment &amp; Check-out" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>Total Amount Due</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rs. {grandTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>{selectedRoomNos.size} room(s) selected</span>
              <span>Rs. 0.00 paid</span>
            </div>

            <FormField label="Payment Method" style={{ marginTop: '24px' }}>
              <select className="form-input" style={{ backgroundColor: 'white' }} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option>Credit Card</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>M-Pay</option>
              </select>
            </FormField>

            <FormField label="Payment Amount" style={{ marginTop: '16px' }}>
              <input type="text" className="form-input" value={`Rs. ${grandTotal.toFixed(2)}`} readOnly style={{ backgroundColor: 'white' }} />
            </FormField>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: '#1a3a5c', padding: '16px', flexDirection: 'column', height: 'auto', gap: '4px' }}
                disabled={isProcessing || selectedRoomNos.size === 0}
                onClick={() => handlePayment('single')}
              >
                <span style={{ fontSize: '0.95rem' }}>Process Payment and Check-out</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
                  {selectedRoomNos.size > 0
                    ? `Rooms: ${Array.from(selectedRoomNos).join(', ')}`
                    : 'No rooms selected'}
                </span>
              </button>

              <button
                className="btn btn-primary"
                style={{ backgroundColor: '#1a3a5c', padding: '16px', flexDirection: 'column', height: 'auto', gap: '4px' }}
                disabled={isProcessing || selectedRoomNos.size < 2}
                onClick={() => handlePayment('combined')}
              >
                <span style={{ fontSize: '0.95rem' }}>Combined Payment and Check-out</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
                  Combine all selected rooms
                </span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
              <button className="btn btn-secondary" style={{ backgroundColor: '#f0ebd8' }} onClick={() => toast.success('Final Invoice Printed')}>
                Print Final Invoice
              </button>
              <button className="btn btn-secondary" style={{ backgroundColor: '#f0ebd8' }} onClick={() => toast.success('Invoice emailed to guest')}>
                Email Final Invoice
              </button>
            </div>
          </Panel>

        </div>
      </div>
    </div>
  );
}
