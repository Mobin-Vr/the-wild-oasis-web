import { eachDayOfInterval } from 'date-fns';
import { supabase } from './supabase';
import {
   Cabin,
   Guest,
   Booking,
   BookingWithCabinPreview,
   Settings,
} from '@/types';
import { cacheLife, cacheTag } from 'next/cache';

/////////////
// GET

export async function getCabin(id: number): Promise<Cabin | null> {
   const { data, error } = await supabase
      .from('cabins')
      .select('*')
      .eq('id', id)
      .single();

   // For testing
   // await new Promise((res) => setTimeout(res, 1000));

   if (error) {
      console.error(error);
   }

   return data;
}

export async function getCabinPrice(
   id: number,
): Promise<Pick<Cabin, 'regularPrice' | 'discount'> | null> {
   const { data, error } = await supabase
      .from('cabins')
      .select('regularPrice, discount')
      .eq('id', id)
      .single();

   if (error) {
      console.error(error);
   }

   return data;
}

export const getCabins = async function (): Promise<Cabin[]> {
   //  'use cache';
   //  cacheLife('hours');
   //  cacheTag('cabins');

   const { data, error } = await supabase
      .from('cabins')
      .select('id, name, maxCapacity, regularPrice, discount, image')
      .order('name');

   if (error) {
      console.error(error);
      throw new Error('Cabins could not be loaded');
   }

   return data as Cabin[];
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
   const { data } = await supabase
      .from('guests')
      .select('*')
      .eq('email', email)
      .single();

   // No error here! We handle the possibility of no guest in the sign in callback
   return data;
}

export async function getBooking(id: number): Promise<Booking> {
   const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

   if (error) {
      console.error(error);
      throw new Error('Booking could not get loaded');
   }

   return data as Booking;
}

export async function getBookings(
   guestId: number,
): Promise<BookingWithCabinPreview[]> {
   const { data, error } = await supabase
      .from('bookings')
      // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
      .select(
         'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)',
      )
      .eq('guestId', guestId)
      .order('startDate');

   if (error) {
      console.error(error);
      throw new Error('Bookings could not get loaded');
   }

   return data as BookingWithCabinPreview[];
}

export async function getBookedDatesByCabinId(
   cabinId: number,
): Promise<Date[]> {
   const todayDate = new Date();
   todayDate.setUTCHours(0, 0, 0, 0);
   const today = todayDate.toISOString();

   // Getting all bookings
   const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabinId', cabinId)
      .or(`startDate.gte.${today},status.eq.checked-in`);

   if (error) {
      console.error(error);
      throw new Error('Bookings could not get loaded');
   }

   // Converting to actual dates to be displayed in the date picker
   const bookedDates = (data as Booking[])
      .map((booking) => {
         return eachDayOfInterval({
            start: new Date(booking.startDate),
            end: new Date(booking.endDate),
         });
      })
      .flat();

   return bookedDates;
}

export async function getSettings(): Promise<Settings> {
   const { data, error } = await supabase.from('settings').select('*').single();

   if (error) {
      console.error(error);
      throw new Error('Settings could not be loaded');
   }

   return data as Settings;
}

// Shape of the data returned by the external countries API.
// Not part of your Supabase schema, so it's defined here instead of types/.
interface Country {
   name: string;
   flag: string;
   // add more fields here as you actually use them
}

export async function getCountries(): Promise<Country[]> {
   try {
      const res = await fetch(
         'https://api.restcountries.com/countries/v5?q=canada',
         {
            headers: {
               Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
            },
         },
      );

      const response = await res.json();

      const countries: Country[] = response?.data?.objects || [];
      console.log(response);

      return countries;
   } catch {
      throw new Error('Could not fetch countries');
   }
}

/////////////
// CREATE

export async function createGuest(newGuest: Omit<Guest, 'id' | 'created_at'>) {
   const { data, error } = await supabase.from('guests').insert([newGuest]);

   if (error) {
      console.error(error);
      throw new Error('Guest could not be created');
   }

   return data;
}

export async function createBooking(
   newBooking: Omit<Booking, 'id' | 'created_at'>,
): Promise<Booking> {
   const { data, error } = await supabase
      .from('bookings')
      .insert([newBooking])
      // So that the newly created object gets returned!
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error('Booking could not be created');
   }

   return data as Booking;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(
   id: number,
   updatedFields: Partial<Guest>,
): Promise<Guest> {
   const { data, error } = await supabase
      .from('guests')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error('Guest could not be updated');
   }
   return data as Guest;
}

export async function updateBooking(
   id: number,
   updatedFields: Partial<Booking>,
): Promise<Booking> {
   const { data, error } = await supabase
      .from('bookings')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error('Booking could not be updated');
   }
   return data as Booking;
}

/////////////
// DELETE

export async function deleteBooking(id: number) {
   const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

   if (error) {
      console.error(error);
      throw new Error('Booking could not be deleted');
   }
   return data;
}
