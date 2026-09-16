"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload, FileText, MoreVertical, Plus, Edit, Trash2, RefreshCw, Printer, ArrowLeft } from 'lucide-react';
import { ROOMS, type Room, validateDates, calculateTotals } from '../utils/bookingLogic';
import toast from 'react-hot-toast';

export default function GuestCheckin() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0]);
  const [isAddingInline, setIsAddingInline] = useState(false);
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [nights, setNights] = useState(0);

  const [newGuest, setNewGuest] = useState({
    roomNo: '', rent: 1000, gst: 100, name: '', noOfAdults: '02', noOfKids: '00', seniorCitizen: '00', checkoutDate: '', idProof: ''
  });

  const handleDateChange = (type: 'in' | 'out', val: string) => {
    let newIn = checkInDate;
    let newOut = checkOutDate;
    if (type === 'in') newIn = val;
    else newOut = val;
    
    setCheckInDate(newIn);
    setCheckOutDate(newOut);

    const result = validateDates(newIn, newOut);
    if (!result.valid && result.error) {
      setDateError(result.error);
      toast.error(result.error);
      setNights(0);
    } else {
      setDateError(null);
      setNights(result.nights);
    }
  };

  const totals = selectedRoom ? calculateTotals(selectedRoom.rent, nights || 1) : { roomCharge: 0, tax: 0, total: 0 };

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.roomNo) {
      toast.error('Name and Room Number are required!');
      return;
    }
    const newRoom: Room = {
      ...newGuest,
      rent: Number(newGuest.rent),
      gst: Number(newGuest.gst)
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom);
    setIsAddingInline(false);
    toast.success(`${newGuest.name} added successfully!`);
    
    // Reset form
    setNewGuest({
      roomNo: '', rent: 1000, gst: 100, name: '', noOfAdults: '02', noOfKids: '00', seniorCitizen: '00', checkoutDate: '', idProof: ''
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <div className="topbar">
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1>Guest Check-in</h1>
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search Booking ID / Guest Name" onKeyDown={(e) => e.key === 'Enter' && toast('Searching...')} />
        </div>
      </div>

      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '16px' }}>
          
          <div className="panel" style={{ height: 'fit-content' }}>
            <div className="panel-header">1. Select Booking & Guest</div>
            <div className="panel-content">
              <div className="search-bar" style={{ width: '100%', marginBottom: '16px' }}>
                <Search size={16} color="var(--text-muted)" />
                <input type="text" placeholder="Search Booking ID / Guest Name" />
              </div>

              <div className="form-group">
                <label className="form-label">Select Customer</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select className="form-input" defaultValue="">
                    <option value="" disabled>Name/Phone number</option>
                    <option value="mathew">Mathew Hyden</option>
                  </select>
                  <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => setIsAddingInline(!isAddingInline)}>
                    <Plus size={16}/> {isAddingInline ? 'Cancel' : 'Add Guest'}
                  </button>
                </div>

                {isAddingInline && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>New Guest Details</h3>
                    <input type="text" className="form-input" style={{ marginBottom: '8px' }} value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} placeholder="Guest Name" />
                    <input type="text" className="form-input" style={{ marginBottom: '8px' }} value={newGuest.roomNo} onChange={e => setNewGuest({...newGuest, roomNo: e.target.value})} placeholder="Room Number" />
                    <input type="date" className="form-input" style={{ marginBottom: '8px' }} value={newGuest.checkoutDate} onChange={e => setNewGuest({...newGuest, checkoutDate: e.target.value})} />
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleAddGuest}>Save Guest</button>
                  </div>
                )}
              </div>

              {!isAddingInline && (
                <div className="grid-2" style={{ marginTop: '16px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Check-in Date</div>
                    <input type="date" className="form-input" value={checkInDate} onChange={(e) => handleDateChange('in', e.target.value)} />
                    {dateError && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px' }}>{dateError}</div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Booking Time</div>
                    <div style={{ color: 'var(--text-muted)', padding: '8px 0' }}>07:00 PM 🕒</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="panel" style={{ height: 'fit-content' }}>
              <div className="panel-header">2. Review & Update Details</div>
              <div className="panel-content">
                <div className="grid-4" style={{ marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Room No.</label>
                    <div className="badge-room">🛏️ {selectedRoom?.roomNo || '---'}</div>
                  </div>
                  <div>
                    <label className="form-label">Rent</label>
                    <input type="text" className="form-input" value={selectedRoom?.rent.toFixed(2) || ''} readOnly />
                  </div>
                  <div>
                    <label className="form-label">GST</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="text" className="form-input" value={selectedRoom?.gst.toFixed(2) || ''} readOnly />
                      <span>%</span>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Tendand Name</label>
                    <input type="text" className="form-input" />
                  </div>
                </div>

                <div className="grid-4">
                  <div>
                    <label className="form-label">No-of Adults</label>
                    <input type="text" className="form-input" value={selectedRoom?.noOfAdults || ''} readOnly />
                  </div>
                  <div>
                    <label className="form-label">No-of Kids</label>
                    <input type="text" className="form-input" value={selectedRoom?.noOfKids || ''} readOnly />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label">Additional Charges</label>
                      <div style={{ fontSize: '0.85rem', width: '60%' }}>
                        <div className="summary-row"><span>Room Charge</span> <span>2 beds</span></div>
                        <div className="summary-row"><span>Extra Charges</span> <span>₹200</span></div>
                        <div className="summary-row"><span>Tax</span> <span>₹2500.00</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-3" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Checkout Date</label>
                    <div style={{ position: 'relative' }}>
                      <input type="date" className="form-input" value={checkOutDate} onChange={(e) => handleDateChange('out', e.target.value)} />
                    </div>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }} onClick={() => toast('Select a file to upload', { icon: '📂' })}><Upload size={14}/> Upload</button>
                  </div>
                  
                  <div>
                    <label className="form-label">Update ID Proof</label>
                    <input type="text" className="form-input" value={selectedRoom?.idProof || ''} readOnly />
                    
                    <label className="form-label" style={{ marginTop: '8px' }}>Guest Count</label>
                    <select className="form-input">
                      <option>02</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Update No. of Adults/Kids</label>
                    <input type="text" className="form-input" value="Mathew Hade" readOnly />

                    <label className="form-label" style={{ marginTop: '8px' }}>Update Guest Name</label>
                    <input type="text" className="form-input" value={selectedRoom?.name || ''} readOnly />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button className="btn btn-secondary" onClick={() => toast.error('Guest details deleted')}><Trash2 size={14} color="var(--error)"/> Delete</button>
                  <button className="btn btn-secondary" onClick={() => toast('Edit mode enabled', { icon: '✏️' })}><Edit size={14}/> Edit</button>
                  <button className="btn btn-secondary" onClick={() => toast.success('Details updated')}><RefreshCw size={14}/> Update</button>
                  <button className="btn btn-primary" onClick={() => toast.success('Guest details confirmed!')}>Confirm Guest Details</button>
                </div>
              </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
          
          <div className="panel" style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ROOM NO.</th>
                    <th>RENT (₹)</th>
                    <th>GST</th>
                    <th>NAME</th>
                    <th>NO:OF ADULTS</th>
                    <th>NO:OF KIDS</th>
                    <th>SENIOR CITIZEN</th>
                    <th>CHECKOUT DATE</th>
                    <th>ID PROOF</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr 
                      key={room.roomNo} 
                      onClick={() => setSelectedRoom(room)}
                      style={{ cursor: 'pointer', backgroundColor: selectedRoom?.roomNo === room.roomNo ? '#f0f4f8' : '' }}
                    >
                      <td>{room.roomNo}</td>
                      <td>₹{room.rent.toFixed(2)}</td>
                      <td>₹{room.gst.toFixed(2)}</td>
                      <td>{room.name}</td>
                      <td>{room.noOfAdults}</td>
                      <td>{room.noOfKids}</td>
                      <td>{room.seniorCitizen}</td>
                      <td>{room.checkoutDate}</td>
                      <td>{room.idProof}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <FileText size={16} className="action-icon" />
                          <MoreVertical size={16} className="action-icon" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>

          <div className="panel" style={{ height: 'fit-content' }}>
            <div className="panel-header">3. Finalize Check-in & Payment</div>
            <div className="panel-content">
              
              <div className="summary-row">
                <span>Room Charge ({nights || 1} nights)</span>
                <span>₹{totals.roomCharge.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Extra Charges</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>

              <div className="total-row" style={{ marginTop: '24px' }}>
                <span>Total Amount:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
              
              <div className="total-row" style={{ borderTop: 'none', paddingTop: '0' }}>
                <span>Total Paid:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', margin: '16px 0', padding: '12px' }} onClick={() => toast.success(`Check-in Complete for Room ${selectedRoom?.roomNo}!`, { duration: 4000 })}>
                Complete Check-in
              </button>

              <div className="grid-3" style={{ marginBottom: '12px' }}>
                <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }} onClick={() => toast('Fetching latest data...')}>Get Data</button>
                <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }} onClick={() => toast('Initiating Mobile Payment...', { icon: '📱' })}>✎ M-Pay</button>
                <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }} onClick={() => { toast.loading('Generating PDF...', { duration: 1500 }); setTimeout(() => toast.success('Printed successfully!'), 1500); }}><Printer size={12}/> Print</button>
              </div>

              <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '12px' }} onClick={() => { toast.loading('Generating Registration Card...', { duration: 1500 }); setTimeout(() => toast.success('Registration Card Printed!'), 1500); }}>
                Print Registration Card
              </button>

              <div className="grid-2">
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => toast.success('Folio downloaded as PDF')}>Download Folio</button>
                <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => toast.success(`Check-in Complete for Room ${selectedRoom?.roomNo}!`, { duration: 4000 })}>Complete Check-in</button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

