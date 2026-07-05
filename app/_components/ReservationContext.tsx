'use client';

import {
   createContext,
   useContext,
   useState,
   type Dispatch,
   type ReactNode,
   type SetStateAction,
} from 'react';
import type { DateRange } from 'react-day-picker';

interface ReservationContextType {
   range: DateRange | undefined;
   setRange: Dispatch<SetStateAction<DateRange | undefined>>;
   resetRange: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
   undefined,
);

function ReservationProvider({ children }: { children: ReactNode }) {
   const [range, setRange] = useState<DateRange | undefined>(undefined);
   const resetRange = () => setRange(undefined);

   return (
      <ReservationContext.Provider value={{ range, setRange, resetRange }}>
         {children}
      </ReservationContext.Provider>
   );
}

function useReservation() {
   const context = useContext(ReservationContext);

   if (context === undefined) {
      throw new Error(
         'useReservation must be used within a ReservationProvider',
      );
   }

   return context;
}

export { ReservationProvider, useReservation };
