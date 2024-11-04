'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
// import GlobalSearch from '../search/GlobalSearch';

const Navbar = () => {
  const pathname = usePathname()?.split('/')[1]?.toUpperCase() || 'WOD';

  return (
    <nav className='bg-primary text-primary-foreground flex justify-between fixed z-50 w-full px-6 py-4 sm:px-12'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/icons/kettlebell.svg'
          width={36}
          height={36}
          alt='Crossfit'
        />
        <p className='h2-bold font-spaceGrotesk'>{pathname} </p>
      </Link>

      {/* <GlobalSearch /> */}
    </nav>
  );
};

export default Navbar;
