import { CreatePropertyImageCategory } from '@newmbani/types';

export const DefaultImageCategories: CreatePropertyImageCategory[] = [
  {
    name: 'Outdoor',
    minNumber: 1,
    maxNumber: 5,
    maxFileSize: 2,
  },
  {
    name: 'Living/Lounge/Dining',
    minNumber: 2,
    maxNumber: 6,
    maxFileSize: 2,
  },
  {
    name: 'Kitchen',
    minNumber: 1,
    maxNumber: 4,
    maxFileSize: 2,
  },
  {
    name: 'Bedroom',
    minNumber: 1,
    maxNumber: 4,
    maxFileSize: 2,
  },
];
