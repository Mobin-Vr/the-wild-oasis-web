import { Cabin } from './cabin.types';
import { Guest } from './guest.types';

// Union type for the status column
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
   id: number;
   created_at: string;
   startDate: string; // timestamp without time zone
   endDate: string;
   numNights: number;
   numGuests: number;
   cabinPrice: number;
   extrasPrice: number;
   totalPrice: number;
   status: BookingStatus;
   hasBreakfast: boolean;
   isPaid: boolean;
   observations: string;
   cabinId: number; // FK -> cabins.id
   guestId: number; // FK -> guests.id
}

// Full relations, e.g. when you .select('*, cabins(*), guests(*)')
export interface BookingWithRelations extends Booking {
   cabins: Cabin;
   guests: Guest;
}

// Matches the partial join used in getBookings() in your queries file:
// .select('id, created_at, startDate, endDate, numNights, numGuests,
//   totalPrice, guestId, cabinId, cabins(name, image)')
export interface BookingWithCabinPreview extends Pick<
   Booking,
   | 'id'
   | 'created_at'
   | 'startDate'
   | 'endDate'
   | 'numNights'
   | 'numGuests'
   | 'totalPrice'
   | 'cabinId'
   | 'guestId'
> {
   cabins: Pick<Cabin, 'name' | 'image'>[];
}
