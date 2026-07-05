import CabinInfo from '@/app/_components/CabinInfo';
import Reservation from '@/app/_components/Reservation';
import Spinner from '@/app/_components/Spinner';
import { getCabin, getCabins } from '@/app/_lib/data-service';
import { Cabin } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
   params: Promise<{ cabinId: string }>;
}

export async function generateMetadata({
   params,
}: PageProps): Promise<Metadata> {
   const { cabinId } = await params;
   const cabin: Cabin | null = await getCabin(+cabinId);

   // No cabin found for this id — fall back to a generic title instead of crashing
   if (!cabin) return { title: 'Cabin not found' };

   const { name } = cabin;

   return { title: `Cabin ${name}` };
}

// This function gets called at build time on server
export async function generateStaticParams() {
   const cabins: Cabin[] = await getCabins();

   return cabins.map((cabin) => ({
      cabinId: String(cabin.id),
   }));
}

export default async function Page({ params }: PageProps) {
   const { cabinId } = await params;

   const cabin: Cabin | null = await getCabin(+cabinId);

   // If no cabin was found for this id, show the 404 page
   if (!cabin) notFound();

   return (
      <div className='max-w-6xl mx-auto mt-8'>
         <CabinInfo cabin={cabin} />
         <div>
            <h2 className='text-5xl font-semibold text-center mb-10 text-accent-400'>
               Reserve {cabin.name} today. Pay on arrival.
            </h2>

            <Suspense fallback={<Spinner />}>
               <Reservation cabin={cabin} />
            </Suspense>
         </div>
      </div>
   );
}
