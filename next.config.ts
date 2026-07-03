import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   reactCompiler: true,
   cacheComponents: true,

   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'orprktkivnbaadfhevqg.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/cabin-images/**',
         },
      ],
   },
};

export default nextConfig;
