"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestCheckout() {
  const router = useRouter();
  const [selectedRooms, setSelectedRooms] = useState({ r101: true, r103: false });

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <div className="topbar">
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1>Guest Check-out</h1>
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search Booking ID / Guest Name" onKeyDown={(e) => e.key === 'Enter' && toast('Searching...')} />
        </div>
      </div>

      <div className="dashboard-container">
        <div className="main-grid" style={{ gridTemplateColumns: '320px 1fr 300px' }}>
          
          {/* Panel 1: Identify Departing Guest */}
          <div className="panel" style={{ height: 'fit-content' }}>
            <div className="panel-header">1. Identify Departing Guest</div>
            <div className="panel-content">
              <div className="grid-2">
                <div>
                  <label className="form-label">Find Guest</label>
                  <select className="form-input">
                    <option>Search Guest</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Identify by Room</label>
                  <input type="number" className="form-input" defaultValue={1} />
                </div>
              </div>
              
              <div className="grid-2" style={{ marginTop: '12px' }}>
                <select className="form-input">
                  <option>Select Guest from List</option>
                </select>
                <button className="btn btn-primary" onClick={() => toast.success('Guest found!')}>Find Room/Guest</button>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label className="form-label">Guest Name</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Mathew Hyden</div>
                  </div>
                  <div>
                    <label className="form-label" style={{ textAlign: 'right' }}>Room No.</label>
                    <div className="badge-room">🛏️ 101</div>
                  </div>
                </div>
              </div>

              <table style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Stay Dates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td style={{ fontSize: '0.8rem' }}>02/04/2026-04/04/2026</td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedRooms.r101} onChange={(e) => setSelectedRooms({...selectedRooms, r101: e.target.checked})} />
                        Select for Check-out
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>103</td>
                    <td style={{ fontSize: '0.8rem' }}>02/04/2026-04/04/2026</td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedRooms.r103} onChange={(e) => setSelectedRooms({...selectedRooms, r103: e.target.checked})} />
                        Select for Check-out
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => toast('Select rooms to add', { icon: '🔍'})}>
                🔍 Add/Change Selected Rooms
              </button>
            </div>
          </div>

          {/* Panel 2: Review & Finalize Bill */}
          <div className="panel" style={{ height: 'fit-content' }}>
            <div className="panel-header">2. Review & Finalize Bill</div>
            <div className="panel-content">
              
              <div style={{ marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ backgroundColor: '#f4f6f8', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Room 101</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                      2 Nights × ₹1200.00
                    </div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    ₹2400.00
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Add Charges</span>
                    <div className="search-bar" style={{ flex: 1, padding: '4px 8px' }}>
                      <Search size={14} color="var(--text-muted)" />
                      <input type="text" placeholder="Search items..." style={{ fontSize: '0.8rem' }} />
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Mini-bar</button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Laundry</button>
                    <button className="btn btn-primary" style={{ padding: '4px 8px' }}><Plus size={14} /></button>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <tr>
                        <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                        <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                        <th style={{ textAlign: 'right', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Mini-bar (Water x2)</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: 'var(--text-muted)' }}>03/04/2026</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: 500 }}>₹100.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Room Service</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: 'var(--text-muted)' }}>03/04/2026</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: 500 }}>₹1200.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>Restaurant Bill</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>03/04/2026</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 500 }}>₹850.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Room 101 Subtotal</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>₹4550.00</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <button className="btn btn-secondary" onClick={() => toast.success('Invoice printed')}>
                      🖨️ Print Invoice
                    </button>
                    <button className="btn btn-primary" onClick={() => toast('Adjusting charges...')}>
                      ⇄ Adjust Charges
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ backgroundColor: '#f4f6f8', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Room 103</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                      2 Nights × ₹1200.00
                    </div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    ₹2400.00
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Add Charges</span>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: 'auto' }}>Mini-bar</button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Laundry</button>
                    <button className="btn btn-primary" style={{ padding: '4px 8px' }}><Plus size={14} /></button>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <tr>
                        <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                        <th style={{ textAlign: 'left', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                        <th style={{ textAlign: 'right', paddingBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Mini-bar (Chips)</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: 'var(--text-muted)' }}>03/04/2026</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: 500 }}>₹50.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>Restaurant Bill</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>03/04/2026</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 500 }}>₹1200.00</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Room 103 Subtotal</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>₹3650.00</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <button className="btn btn-secondary" onClick={() => toast.success('Draft printed')}>
                      🖨️ Print Invoice
                    </button>
                    <button className="btn btn-primary" onClick={() => toast('Adjusting charges...')}>
                      ⇄ Adjust Charges
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#1a3a5c', color: 'white', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Selected Rooms Combined Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹8200.00</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Payment & Check-out */}
          <div className="panel" style={{ height: 'fit-content' }}>
            <div className="panel-header">3. Payment & Check-out</div>
            <div className="panel-content">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>Total Amount Due</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>₹8200.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>(Selected Rooms)</span>
                <span>₹0.00</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <label className="form-label">Payment Method</label>
                <select className="form-input" style={{ backgroundColor: 'white' }}>
                  <option>Credit Card</option>
                  <option>Cash</option>
                  <option>M-Pay</option>
                </select>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label className="form-label">Payment Amount</label>
                <input type="text" className="form-input" defaultValue="₹8200.00" style={{ backgroundColor: 'white' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#1a3a5c', padding: '16px', flexDirection: 'column', height: 'auto', gap: '4px' }}
                  onClick={() => { toast.loading('Processing payment...', { duration: 2000 }); setTimeout(() => toast.success('Payment Successful! Room Checked Out.'), 2000); }}
                >
                  <span style={{ fontSize: '0.95rem' }}>Process Payment & Check-out</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>Proceed with Room 101 Check-out</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>Complete Check-out</span>
                </button>

                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#1a3a5c', padding: '16px', flexDirection: 'column', height: 'auto', gap: '4px' }}
                  onClick={() => toast.success('Selected rooms checked out')}
                >
                  <span style={{ fontSize: '0.95rem' }}>Payment & Check-out</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>Combine and Proceed with</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>Selected Rooms Check-out</span>
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

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
