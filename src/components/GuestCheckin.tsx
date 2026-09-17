"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, MoreVertical, Plus, Edit, Trash2, RefreshCw, Printer } from 'lucide-react';
import { ROOMS, type Room, validateDates, calculateTotals } from '../utils/bookingLogic';
import { PageHeader, Panel, FormField } from './ui';
import toast from 'react-hot-toast';

const INITIAL_GUEST = {
  roomNo: '', rent: 1000, gst: 100, name: '', noOfAdults: '02', noOfKids: '00', seniorCitizen: '00', checkinDate: '', checkoutDate: '', idProof: ''
};

export default function GuestCheckin() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddingInline, setIsAddingInline] = useState(false);
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [nights, setNights] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [newGuest, setNewGuest] = useState({ ...INITIAL_GUEST });

  const todayStr = new Date().toISOString().split('T')[0];

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
    if (newGuest.checkinDate && newGuest.checkoutDate && newGuest.checkoutDate <= newGuest.checkinDate) {
      toast.error('Check-out date must be after Check-in date!');
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
    setNewGuest({ ...INITIAL_GUEST });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <PageHeader
        title="Guest Check-in"
        onBack={() => router.push('/')}
        searchPlaceholder="Search Booking ID / Guest Name"
      />

      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Top Row: Select Guest + Review Details */}
        <div className="checkin-top-row">
          
          {/* Panel 1: Select Booking & Guest */}
          <Panel title="1. Select Booking &amp; Guest" style={{ height: 'fit-content' }}>
            <div className="search-bar search-bar-light" style={{ width: '100%', marginBottom: '16px' }}>
              <input type="text" placeholder="Search Booking ID / Guest Name" style={{ marginLeft: 0 }} />
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

              {/* Add Guest Modal Popup */}
              {isAddingInline && (
                <>
                  <div className="modal-overlay" onClick={() => setIsAddingInline(false)} />
                  <div className="modal-popup">
                    <div className="modal-header">
                      <h3>New Guest Details</h3>
                      <button className="modal-close" onClick={() => setIsAddingInline(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="grid-2" style={{ gap: '8px', marginBottom: '8px' }}>
                        <FormField label="Guest Name" required>
                          <input type="text" className="form-input" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} placeholder="Guest Name" />
                        </FormField>
                        <FormField label="Room Number" required>
                          <input type="text" className="form-input" value={newGuest.roomNo} onChange={e => setNewGuest({...newGuest, roomNo: e.target.value})} placeholder="Room No." />
                        </FormField>
                      </div>

                      <div className="grid-2" style={{ gap: '8px', marginBottom: '8px' }}>
                        <FormField label="Rent">
                          <input type="number" className="form-input" value={newGuest.rent} onChange={e => setNewGuest({...newGuest, rent: Number(e.target.value)})} />
                        </FormField>
                        <FormField label="GST (%)">
                          <input type="number" className="form-input" value={newGuest.gst} onChange={e => setNewGuest({...newGuest, gst: Number(e.target.value)})} />
                        </FormField>
                      </div>

                      <div className="grid-3" style={{ gap: '8px', marginBottom: '8px' }}>
                        <FormField label="No. of Adults">
                          <input type="text" className="form-input" value={newGuest.noOfAdults} onChange={e => setNewGuest({...newGuest, noOfAdults: e.target.value})} />
                        </FormField>
                        <FormField label="No. of Kids">
                          <input type="text" className="form-input" value={newGuest.noOfKids} onChange={e => setNewGuest({...newGuest, noOfKids: e.target.value})} />
                        </FormField>
                        <FormField label="Senior Citizen">
                          <input type="text" className="form-input" value={newGuest.seniorCitizen} onChange={e => setNewGuest({...newGuest, seniorCitizen: e.target.value})} />
                        </FormField>
                      </div>

                      <FormField label="ID Proof" style={{ marginBottom: '8px' }}>
                        <input type="text" className="form-input" value={newGuest.idProof} onChange={e => setNewGuest({...newGuest, idProof: e.target.value})} placeholder="Passport / Aadhaar / DL" />
                      </FormField>

                      <div className="grid-2" style={{ gap: '8px', marginBottom: '8px' }}>
                        <FormField
                          label="Check-in Date"
                          required
                          error={newGuest.checkinDate && new Date(newGuest.checkinDate) < new Date(new Date().toDateString()) ? 'Check-in date cannot be in the past.' : null}
                        >
                          <input type="date" className="form-input" value={newGuest.checkinDate} min={todayStr} onChange={e => setNewGuest({...newGuest, checkinDate: e.target.value, checkoutDate: ''})} />
                        </FormField>
                        <FormField
                          label="Check-out Date"
                          hint={!newGuest.checkinDate ? 'Select check-in date first' : null}
                          error={newGuest.checkoutDate && newGuest.checkinDate && newGuest.checkoutDate <= newGuest.checkinDate ? 'Check-out must be after check-in.' : null}
                        >
                          <input type="date" className="form-input" value={newGuest.checkoutDate} min={newGuest.checkinDate || todayStr} disabled={!newGuest.checkinDate} onChange={e => setNewGuest({...newGuest, checkoutDate: e.target.value})} style={!newGuest.checkinDate ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
                        </FormField>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setIsAddingInline(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleAddGuest}>Save Guest</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isAddingInline && (
              <div className="grid-2" style={{ marginTop: '16px' }}>
                <FormField label="Check-in Date" error={dateError}>
                  <input type="date" className="form-input" value={checkInDate} min={todayStr} onChange={(e) => handleDateChange('in', e.target.value)} />
                </FormField>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Booking Time</div>
                  <div style={{ color: 'var(--text-muted)', padding: '8px 0' }}>07:00 PM</div>
                </div>
              </div>
            )}
          </Panel>

          {/* Panel 2: Review & Update Details */}
          <Panel title="2. Review &amp; Update Details" style={{ height: 'fit-content' }}>
            {!selectedRoom ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>No guest selected</div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add a new guest or select one from the table below to review details.</div>
              </div>
            ) : (
              <>
                <div className="grid-4" style={{ marginBottom: '16px' }}>
                  <FormField label="Room No.">
                    <div className="badge-room">Room {selectedRoom.roomNo}</div>
                  </FormField>
                  <FormField label="Rent">
                    <input type="text" className="form-input" value={isEditing ? String(selectedRoom.rent ?? '') : selectedRoom.rent.toFixed(2)} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, rent: parseFloat(e.target.value) || 0})} />
                  </FormField>
                  <div>
                    <label className="form-label">GST</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="text" className="form-input" value={isEditing ? String(selectedRoom.gst ?? '') : selectedRoom.gst.toFixed(2)} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, gst: parseFloat(e.target.value) || 0})} />
                      <span>%</span>
                    </div>
                  </div>
                  <FormField label="Tenant Name">
                    <input type="text" className="form-input" />
                  </FormField>
                </div>

                <div className="grid-4">
                  <FormField label="No. of Adults">
                    <input type="text" className="form-input" value={selectedRoom.noOfAdults} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, noOfAdults: e.target.value})} />
                  </FormField>
                  <FormField label="No. of Kids">
                    <input type="text" className="form-input" value={selectedRoom.noOfKids} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, noOfKids: e.target.value})} />
                  </FormField>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label">Additional Charges</label>
                      <div style={{ fontSize: '0.85rem', width: '60%' }}>
                        <div className="summary-row"><span>Room Charge</span> <span>2 beds</span></div>
                        <div className="summary-row"><span>Extra Charges</span> <span>Rs. 200</span></div>
                        <div className="summary-row"><span>Tax</span> <span>Rs. 2500.00</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-3" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <div>
                    <FormField
                      label="Checkout Date"
                      hint={!checkInDate ? 'Select check-in date first' : null}
                    >
                      <input type="date" className="form-input" value={checkOutDate} min={checkInDate || todayStr} disabled={!checkInDate} onChange={(e) => handleDateChange('out', e.target.value)} style={!checkInDate ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
                    </FormField>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}><Upload size={14}/> Upload</button>
                  </div>
                  
                  <div>
                    <FormField label="Update ID Proof">
                      <input type="text" className="form-input" value={selectedRoom.idProof} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, idProof: e.target.value})} />
                    </FormField>
                    <FormField label="Guest Count" style={{ marginTop: '8px' }}>
                      <select className="form-input">
                        <option>02</option>
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Update No. of Adults/Kids">
                      <input type="text" className="form-input" defaultValue="Mathew Hade" readOnly={!isEditing} />
                    </FormField>
                    <FormField label="Update Guest Name" style={{ marginTop: '8px' }}>
                      <input type="text" className="form-input" value={selectedRoom.name} readOnly={!isEditing} onChange={(e) => setSelectedRoom({...selectedRoom, name: e.target.value})} />
                    </FormField>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn btn-secondary" onClick={() => { if (selectedRoom) { setRooms(rooms.filter(r => r.roomNo !== selectedRoom.roomNo)); setSelectedRoom(null); } }}><Trash2 size={14} color="var(--error)"/> Delete</button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(!isEditing)} style={isEditing ? { backgroundColor: '#e8f4fd', borderColor: '#0077b6' } : {}}><Edit size={14}/> {isEditing ? 'Cancel' : 'Edit'}</button>
                  <button className="btn btn-secondary" onClick={() => { setIsEditing(false); toast.success('Details updated'); }}><RefreshCw size={14}/> Update</button>
                  <button className="btn btn-primary" onClick={() => toast.success('Guest details confirmed!')}>Confirm Guest Details</button>
                </div>
              </>
            )}
          </Panel>
        </div>

        {/* Bottom Row: Table + Payment */}
        <div className="checkin-bottom-row">
          
          <div className="panel" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Room No.</th>
                  <th>Rent</th>
                  <th>GST</th>
                  <th>Name</th>
                  <th>Adults</th>
                  <th>Kids</th>
                  <th>Senior</th>
                  <th>Checkout</th>
                  <th>ID Proof</th>
                  <th>Action</th>
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
                    <td>Rs. {room.rent.toFixed(2)}</td>
                    <td>Rs. {room.gst.toFixed(2)}</td>
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

          {/* Panel 3: Finalize Check-in */}
          <Panel title="3. Finalize Check-in &amp; Payment" style={{ height: 'fit-content' }}>
            <div className="summary-row">
              <span>Room Charge ({nights || 1} nights)</span>
              <span>Rs. {totals.roomCharge.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Extra Charges</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST)</span>
              <span>Rs. {totals.tax.toFixed(2)}</span>
            </div>

            <div className="total-row" style={{ marginTop: '24px' }}>
              <span>Total Amount:</span>
              <span>Rs. {totals.total.toFixed(2)}</span>
            </div>
            
            <div className="total-row" style={{ borderTop: 'none', paddingTop: '0' }}>
              <span>Total Paid:</span>
              <span>Rs. {totals.total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', margin: '16px 0', padding: '12px' }} onClick={() => toast.success(`Check-in Complete for Room ${selectedRoom?.roomNo}!`, { duration: 4000 })}>
              Complete Check-in
            </button>

            <div className="grid-3" style={{ marginBottom: '12px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }}>Get Data</button>
              <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }}>M-Pay</button>
              <button className="btn btn-secondary" style={{ padding: '8px 4px', fontSize: '0.8rem' }} onClick={() => { toast.loading('Generating PDF...', { duration: 1500 }); setTimeout(() => toast.success('Printed successfully!'), 1500); }}><Printer size={12}/> Print</button>
            </div>

            <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '12px' }} onClick={() => { toast.loading('Generating Registration Card...', { duration: 1500 }); setTimeout(() => toast.success('Registration Card Printed!'), 1500); }}>
              Print Registration Card
            </button>

            <div className="grid-2">
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => toast.success('Folio downloaded as PDF')}>Download Folio</button>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => toast.success(`Check-in Complete for Room ${selectedRoom?.roomNo}!`, { duration: 4000 })}>Complete Check-in</button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
