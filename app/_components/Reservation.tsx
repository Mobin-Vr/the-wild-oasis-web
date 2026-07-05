import { Cabin } from '@/types';
import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service';
import DateSelector from './DateSelector';
import ReservationForm from './ReservationForm';

interface ReservationProps {
   cabin: Cabin;
}

export default async function Reservation({ cabin }: ReservationProps) {
   const [settings, bookedDates] = await Promise.all([
      getSettings(),
      getBookedDatesByCabinId(cabin.id),
   ]);

   return (
      <div className='grid grid-cols-2 border border-primary-800 min-h-100'>
         <DateSelector
            cabin={cabin}
            settings={settings}
            bookedDates={bookedDates}
         />
         <ReservationForm cabin={cabin} />
      </div>
   );
}
