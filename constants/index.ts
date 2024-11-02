import { SidebarLink } from '@/types';

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/assets/icons/gym.svg',
    route: '/wod',
    label: 'WOD',
  },
  {
    imgURL: '/assets/icons/dumbbell.svg',
    route: '/bootcamp',
    label: 'Bootcamp',
  },
  {
    imgURL: '/assets/icons/gum-equipment.svg',
    route: '/d45',
    label: 'D45',
  },
];
