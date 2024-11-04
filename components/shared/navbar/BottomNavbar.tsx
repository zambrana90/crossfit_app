'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BottomNavbar = () => {
  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-primary border-t border-gray-600 px-4 py-2'>
      <ul className='flex justify-around items-center'>
        <li>
          <Link
            href='/wod'
            className='flex flex-col items-center text-gray-600 hover:text-blue-500'
          >
            <Image
              src='/assets/icons/gym.svg'
              width={24}
              height={24}
              alt='Crossfit'
              className='invert-colors'
            />
            <span className='text-xs mt-1 text-white'>WOD</span>
          </Link>
        </li>
        <li>
          <Link
            href='/bootcamp'
            className='flex flex-col items-center text-gray-600 hover:text-blue-500'
          >
            <Image
              src='/assets/icons/dumbbell.svg'
              width={24}
              height={24}
              alt='Crossfit'
              className='invert-colors'
            />
            <span className='text-xs mt-1 text-white'>Bootcamp</span>
          </Link>
        </li>
        <li>
          <Link
            href='/d45'
            className='flex flex-col items-center text-gray-600 hover:text-blue-500'
          >
            <Image
              src='/assets/icons/gum-equipment.svg'
              width={24}
              height={24}
              alt='Crossfit'
              className='invert-colors'
            />
            <span className='text-xs mt-1 text-white'>D45</span>
          </Link>
        </li>
        <li>
          <Link
            href='/partner'
            className='flex flex-col items-center text-gray-600 hover:text-blue-500'
          >
            <Image
              src='/assets/icons/handshake.svg'
              width={24}
              height={24}
              alt='Crossfit'
              className='invert-colors'
            />
            <span className='text-xs mt-1 text-white'>Partner</span>
          </Link>
        </li>
        <li>
          <Link
            href='/random'
            className='flex flex-col items-center text-gray-600 hover:text-blue-500'
          >
            <Image
              src='/assets/icons/question-mark.svg'
              width={24}
              height={24}
              alt='Crossfit'
              className='invert-colors'
            />
            <span className='text-xs mt-1 text-white'>Random</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavbar;
