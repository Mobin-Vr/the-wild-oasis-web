export interface Cabin {
   id: number;
   created_at: string; // ISO timestamp string
   name: string;
   maxCapacity: number;
   regularPrice: number;
   discount: number;
   description: string;
   image: string;
}

export type CabinFilter = 'small' | 'medium' | 'large' | 'all';
