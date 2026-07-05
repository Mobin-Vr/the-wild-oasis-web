import { Cabin, CabinFilter } from '@/types';
import { getCabins } from '../_lib/data-service';
import CabinCard from './CabinCard';

interface CabinListProps {
   filter: CabinFilter;
}

export default async function CabinList({ filter }: CabinListProps) {
   const cabins: Cabin[] = await getCabins();

   if (!cabins.length) return null;

   let displayedCabin: Cabin[] = [];

   if (filter === 'all') {
      displayedCabin = cabins;
   }
   if (filter === 'small') {
      displayedCabin = cabins.filter((cabin) => cabin.maxCapacity <= 3);
   }
   if (filter === 'medium') {
      displayedCabin = cabins.filter(
         (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
      );
   }
   if (filter === 'large') {
      displayedCabin = cabins.filter((cabin) => cabin.maxCapacity >= 8);
   }

   return (
      <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
         {displayedCabin.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
         ))}
      </div>
   );
}
