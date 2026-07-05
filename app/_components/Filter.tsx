'use client';

import { CabinFilter } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const pathname = usePathname();

   const activeFilter = searchParams.get('capacity') ?? 'all';

   function handleFilter(filter: CabinFilter) {
      const params = new URLSearchParams(searchParams);
      params.set('capacity', filter);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
   }

   return (
      <div className='border border-primary-800 flex'>
         <FilterButton
            label='All cabins'
            value='all'
            active={activeFilter === 'all'}
            onClick={handleFilter}
         />

         <FilterButton
            label='1-3 guests'
            value='small'
            active={activeFilter === 'small'}
            onClick={handleFilter}
         />

         <FilterButton
            label='4-7 guests'
            value='medium'
            active={activeFilter === 'medium'}
            onClick={handleFilter}
         />

         <FilterButton
            label='8-12 guests'
            value='large'
            active={activeFilter === 'large'}
            onClick={handleFilter}
         />
      </div>
   );
}

export default Filter;

type Props = {
   label: string;
   value: CabinFilter;
   active: boolean;
   onClick: (value: CabinFilter) => void;
};

function FilterButton({ label, value, active, onClick }: Props) {
   return (
      <button
         onClick={() => onClick(value)}
         className={`px-5 py-2 hover:bg-primary-700 transition ${
            active ? 'bg-primary-700 text-primary-50' : ''
         }`}
      >
         {label}
      </button>
   );
}
