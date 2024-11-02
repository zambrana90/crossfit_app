'use client';

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className='flex h-full flex-col gap-6 pt-16'>
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.route;

        // TODO

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg bg-primary text-primary-foreground'
                  : ''
              } flex items-center justify-start gap-4 p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? 'invert-colors' : ''}`}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src='/assets/icons/hamburger.svg'
          width={36}
          height={36}
          alt='Menu'
          className='sm:hidden'
        />
      </SheetTrigger>
      <SheetContent side='left' className='border-none'>
        <Link href='/basketball' className='flex items-center gap-1'>
          <Image
            src='/assets/icons/kettlebell-white.svg'
            width={36}
            height={36}
            alt='Crossfit'
          />
          <p className='h2-bold font-spaceGrotesk'>Crossfit App </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
