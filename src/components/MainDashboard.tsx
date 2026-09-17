"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck,
  LogOut,
  Calendar,
  Droplets,
  Utensils,
  Settings,
  MessageSquare,
  Key,
  FileText,
  Users,
  BarChart2,
  HelpCircle,
  Search,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const DASHBOARD_TILES = [
  { icon: ClipboardCheck, label: 'Guest Check-in', color: '#2b9348', action: 'checkin' },
  { icon: LogOut, label: 'Guest Check-Out', color: '#d90429', action: 'checkout' },
  { icon: Calendar, label: 'Reservations', color: '#0077b6' },
  { icon: Droplets, label: 'Housekeeping', color: '#00b4d8' },
  { icon: Utensils, label: 'Restaurant', color: '#e07a5f' },
  { icon: MessageSquare, label: 'WhatsApp', color: '#25d366' },
  { icon: Key, label: 'Rooms', color: '#9d4edd' },
  { icon: Users, label: 'Staff', color: '#3f37c9', badge: '2 tasks' },
  { icon: FileText, label: 'Floors', color: '#20c997' },
  { icon: BarChart2, label: 'Reports', color: '#fca311' },
  { icon: Settings, label: 'Settings', color: '#6c757d' },
  { icon: HelpCircle, label: 'New: Group Booking', color: '#457b9d' },
];

const ROOM_STATUS = {
  AVAILABLE: '#a3b18a', // green
  OCCUPIED: '#457b9d', // blue
  DIRTY: '#e63946', // red
  MAINTENANCE: '#fca311', // orange
  BLOCKED: '#6c757d', // gray
};

const generateFloorRooms = (start: number, count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const num = start + i;
    // Mock some random statuses for visual effect matching the image
    let status = ROOM_STATUS.AVAILABLE;
    if (num % 7 === 0) status = ROOM_STATUS.OCCUPIED;
    if (num % 13 === 0) status = ROOM_STATUS.DIRTY;
    if (num % 19 === 0) status = ROOM_STATUS.MAINTENANCE;
    if (num === 110 || num === 210) status = ROOM_STATUS.BLOCKED;

    return { number: num, status };
  });
};

const FLOOR_1 = generateFloorRooms(101, 16);
const FLOOR_1_B = generateFloorRooms(117, 16); // continuing floor 1 lower row
const FLOOR_2 = generateFloorRooms(201, 16);
const FLOOR_2_B = generateFloorRooms(217, 16); // continuing floor 2 lower row

export default function MainDashboard() {
  const router = useRouter();

  return (
    <div className="dashboard-wrapper">
      <div className="topbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>
            Raintech <span style={{ fontSize: '0.7rem', fontWeight: 'normal', opacity: 0.7 }}>HOTEL</span>
          </div>
        </div>

        <div className="search-bar" style={{ width: '360px' }}>
          <Search size={15} color="rgba(255,255,255,0.5)" />
          <input type="text" placeholder="Search guests, rooms, reservations..." onKeyDown={(e) => e.key === 'Enter' && toast('Searching...')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            Thu, Jul 23, 2026
          </div>
          <button className="btn" style={{ borderRadius: '16px', padding: '5px 14px', fontSize: '0.78rem', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>Quick Actions</button>
          <Bell size={18} color="rgba(255,255,255,0.7)" style={{ cursor: 'pointer' }} />
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.4)' }}></div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Main Dashboard</h1>

        {/* Top Grid: Actions & Overview */}
        <div className="dashboard-top-grid">

          {/* Action Tiles */}
          <div className="grid-6">
            {DASHBOARD_TILES.map((tile, idx) => (
              <div
                key={idx}
                className="dashboard-tile"
                onClick={() => {
                  if (tile.action === 'checkin') {
                    router.push('/checkin');
                  } else if (tile.action === 'checkout') {
                    router.push('/checkout');
                  } else {
                    toast(`Opening ${tile.label} module...`);
                  }
                }}
                style={{ cursor: tile.action ? 'pointer' : 'default' }}
              >
                {tile.badge && <span className="tile-badge">{tile.badge}</span>}
                <div className="tile-icon" style={{ color: tile.color, backgroundColor: `${tile.color}15` }}>
                  <tile.icon size={24} />
                </div>
                <div className="tile-label">{tile.label}</div>
              </div>
            ))}
          </div>

          {/* Operational Overview */}
          <div className="panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Operational Overview</h3>
            <div className="grid-2">
              <div className="overview-box">
                <div className="overview-label">Occupancy</div>
                <div className="overview-value">4%</div>
              </div>
              <div className="overview-box">
                <div className="overview-label">Pending Check-ins</div>
                <div className="overview-value">0</div>
              </div>
              <div className="overview-box">
                <div className="overview-label">Pending Departures</div>
                <div className="overview-value">0</div>
              </div>
              <div className="overview-box" style={{ backgroundColor: '#e6f4ea' }}>
                <div className="overview-label">Revenue Today</div>
                <div className="overview-value">Rs. 0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Interactive Floor View */}
        <div className="panel" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Room Status - Interactive Floor View</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>50 rooms across your property</p>

          <div className="floor-view-grid">
            {/* Floors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="floor-label">Floor 1</div>
                <div>
                  <div className="room-grid">
                    {FLOOR_1.map(room => (
                      <div key={room.number} className="room-tile" style={{ backgroundColor: room.status }}>{room.number}</div>
                    ))}
                  </div>
                  <div className="room-grid" style={{ marginTop: '8px' }}>
                    {FLOOR_1_B.map(room => (
                      <div key={room.number} className="room-tile" style={{ backgroundColor: room.status }}>{room.number}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="floor-label">Floor 2</div>
                <div>
                  <div className="room-grid">
                    {FLOOR_2.map(room => (
                      <div key={room.number} className="room-tile" style={{ backgroundColor: room.status }}>{room.number}</div>
                    ))}
                  </div>
                  <div className="room-grid" style={{ marginTop: '8px' }}>
                    {FLOOR_2_B.map(room => (
                      <div key={room.number} className="room-tile" style={{ backgroundColor: room.status }}>{room.number}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Rooms Dial */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="progress-dial">
                <div className="progress-inner">
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>200</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rooms Total</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontWeight: '500' }}>4% Occupied</div>
            </div>
          </div>

          <div className="legend" style={{ marginTop: '20px' }}>
            <div className="legend-item"><span className="legend-dot" style={{ background: ROOM_STATUS.AVAILABLE }}></span> Available</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: ROOM_STATUS.OCCUPIED }}></span> Occupied</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: ROOM_STATUS.DIRTY }}></span> Dirty</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: ROOM_STATUS.MAINTENANCE }}></span> Maintenance</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: ROOM_STATUS.BLOCKED }}></span> Blocked</div>
          </div>
        </div>

        {/* Lower Panels */}
        <div className="grid-2">
          {/* Vacating Rooms */}
          <div className="panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={20} /> Going to Vacate Rooms
            </h3>

            <div className="grid-2">
              <div style={{ display: 'flex', gap: '12px', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ width: '80px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Room 101</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Departing - Guest</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>Check-Out Scheduled</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ width: '80px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Room 102</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Departing - Guest</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>Checkout: 11:00 AM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Status Changer */}
          <div className="panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Room Status Changer & Actions</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Room #</label>
                <select className="form-input" style={{ marginBottom: '12px' }}>
                  <option>Enter number</option>
                  <option>101</option>
                  <option>102</option>
                </select>
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', color: 'var(--error)', backgroundColor: '#fff0f0', border: '1px solid #ffd0d0' }}
                  onClick={() => toast.success('All dirty rooms set to cleaning status!')}
                >
                  Set all Dirty to Cleaning
                </button>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <button
                  className="btn"
                  style={{ backgroundColor: '#a3b18a', color: '#1a3a2a', border: '1px solid #8e9e76', height: '60px', width: '100%' }}
                  onClick={() => toast.success('Room marked as ready to serve!')}
                >
                  Cleaning done, ready<br />to serve
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => toast('Viewing maintenance logs')}>
                  View All Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
