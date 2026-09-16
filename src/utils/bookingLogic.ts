export interface Room {
  roomNo: string;
  rent: number;
  gst: number;
  name: string;
  noOfAdults: string;
  noOfKids: string;
  seniorCitizen: string;
  checkoutDate: string;
  idProof: string;
}

export const ROOMS: Room[] = [
  { roomNo: '102', rent: 1200.00, gst: 112.00, name: 'Mathew Hyden', noOfAdults: '02', noOfKids: '00', seniorCitizen: '02', checkoutDate: '2026-04-02', idProof: 'Mathewhyden...' },
  { roomNo: '103', rent: 1300.00, gst: 115.00, name: 'Sarah Thompson', noOfAdults: '02', noOfKids: '03', seniorCitizen: '03', checkoutDate: '2026-04-03', idProof: 'sarahthomps...' },
  { roomNo: '104', rent: 1400.00, gst: 110.00, name: 'James Smith', noOfAdults: '02', noOfKids: '04', seniorCitizen: '04', checkoutDate: '2026-04-04', idProof: 'jamessmithid...' },
  { roomNo: '105', rent: 1500.00, gst: 122.00, name: 'Emily Clark', noOfAdults: '02', noOfKids: '05', seniorCitizen: '05', checkoutDate: '2026-04-05', idProof: 'emilyclarkid.p...' },
  { roomNo: '106', rent: 1600.00, gst: 125.00, name: 'Michael Brown', noOfAdults: '02', noOfKids: '06', seniorCitizen: '00', checkoutDate: '2026-04-06', idProof: 'michaelbrown...' },
  { roomNo: '107', rent: 1700.00, gst: 150.00, name: 'Jessica Lee', noOfAdults: '02', noOfKids: '07', seniorCitizen: '07', checkoutDate: '2026-04-07', idProof: 'jessicaleeid.pdf' },
  { roomNo: '108', rent: 1800.00, gst: 132.00, name: 'David Wilson', noOfAdults: '02', noOfKids: '08', seniorCitizen: '00', checkoutDate: '2026-04-08', idProof: 'davidwilsonid...' },
  { roomNo: '109', rent: 1900.00, gst: 135.00, name: 'Sophia Martinez', noOfAdults: '02', noOfKids: '09', seniorCitizen: '00', checkoutDate: '2026-04-09', idProof: 'sophiamartin...' },
  { roomNo: '110', rent: 2000.00, gst: 138.00, name: 'Daniel Garcia', noOfAdults: '02', noOfKids: '10', seniorCitizen: '00', checkoutDate: '2026-04-10', idProof: 'danielgarciaid...' },
  { roomNo: '111', rent: 2100.00, gst: 140.00, name: 'Olivia Rodriguez', noOfAdults: '02', noOfKids: '11', seniorCitizen: '00', checkoutDate: '2026-04-11', idProof: 'oliviarodrigue...' },
];

export function validateDates(checkInStr: string, checkOutStr: string): { valid: boolean; nights: number; error: string | null } {
  if (!checkInStr || !checkOutStr) {
    return { valid: false, nights: 0, error: null }; // Don't error until both are selected
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  
  // Set time to midnight for accurate day calculation
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    return { valid: false, nights: 0, error: 'Check-in date cannot be in the past.' };
  }

  if (checkOut <= checkIn) {
    return { valid: false, nights: 0, error: 'Check-out date must be after Check-in date.' };
  }

  // Calculate nights
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { valid: true, nights: diffDays, error: null };
}

export function calculateTotals(rent: number, nights: number) {
  const roomCharge = rent * nights;
  const tax = roomCharge * 0.12; // 12% GST
  const total = roomCharge + tax;
  
  return { roomCharge, tax, total };
}
