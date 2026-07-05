'use client';

import { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Cabin, Settings } from '@/types';

interface DateSelectorProps {
   cabin: Pick<Cabin, 'regularPrice' | 'discount'>;
   settings: Settings;
   // Dates already booked for this cabin.
   bookedDates?: Date[];
}

function DateSelector({
   cabin,
   bookedDates = [],
   settings,
}: DateSelectorProps) {
   const [range, setRange] = useState<DateRange | undefined>(undefined);

   const { regularPrice, discount } = cabin;
   const { minBookingLength, maxBookingLength } = settings;

   const numNights =
      range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

   const cabinPrice = numNights * (regularPrice - discount);

   function resetRange() {
      setRange(undefined);
   }

   return (
      <div className='flex flex-col justify-between'>
         <DayPicker
            className='pt-12 place-self-center'
            classNames={{
               months: 'flex flex-col sm:flex-row',
            }}
            mode='range'
            min={minBookingLength}
            max={maxBookingLength}
            startMonth={new Date()}
            endMonth={
               new Date(new Date().getFullYear() + 5, new Date().getMonth())
            }
            captionLayout='dropdown'
            navLayout='around'
            numberOfMonths={2}
            disabled={[{ before: new Date() }, ...bookedDates]}
            excludeDisabled
            selected={range}
            onSelect={setRange}
         />

         <div className='flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-18'>
            <div className='flex items-baseline gap-6'>
               <p className='flex gap-2 items-baseline'>
                  {discount > 0 ? (
                     <>
                        <span className='text-2xl'>
                           ${regularPrice - discount}
                        </span>
                        <span className='line-through font-semibold text-primary-700'>
                           ${regularPrice}
                        </span>
                     </>
                  ) : (
                     <span className='text-2xl'>${regularPrice}</span>
                  )}
                  <span>/night</span>
               </p>
               {numNights > 0 ? (
                  <>
                     <p className='bg-accent-600 px-3 py-2 text-2xl'>
                        <span>&times;</span> <span>{numNights}</span>
                     </p>
                     <p>
                        <span className='text-lg font-bold uppercase'>
                           Total
                        </span>{' '}
                        <span className='text-2xl font-semibold'>
                           ${cabinPrice}
                        </span>
                     </p>
                  </>
               ) : null}
            </div>

            {range?.from || range?.to ? (
               <button
                  className='border border-primary-800 py-2 px-4 text-sm font-semibold'
                  onClick={resetRange}
               >
                  Clear
               </button>
            ) : null}
         </div>
      </div>
   );
}

export default DateSelector;
