import type { StudentRaw } from '@/stores/student'

export const masterlist: readonly StudentRaw[] = [
  {
    firstName: 'Ana',
    middleInitial: 'D.',
    lastName: 'Cruz',
    birthDate: new Date('2003-05-12'),
    address: {
      street: '123 Mabini St.',
      city: 'Quezon City',
      province: 'Metro Manila',
      zipCode: 1100,
    },
    course: 'BSCS',
  },
  {
    firstName: 'Mark',
    lastName: 'Reyes',
    birthDate: new Date('2004-11-03'),
    address: {
      street: '456 Rizal Ave.',
      city: 'Manila',
      province: 'Metro Manila',
      zipCode: 1000,
    },
    course: 'BSIT',
  },
  {
    firstName: 'Liza',
    middleInitial: 'K.',
    lastName: 'Santos',
    birthDate: new Date('2002-02-28'),
    address: {
      street: '789 Bonifacio Blvd.',
      city: 'Pasig',
      province: 'Metro Manila',
      zipCode: 1600,
    },
    course: 'BSN',
  },
  {
    firstName: 'Joshua',
    lastName: 'Tan',
    birthDate: new Date('2005-09-15'),
    address: {
      street: '321 Aguinaldo St.',
      city: 'Cebu City',
      province: 'Cebu',
      zipCode: 6000,
    },
    course: 'BSHRM',
  },
  {
    firstName: 'Samantha',
    middleInitial: 'G.',
    lastName: 'De Leon',
    birthDate: new Date('2003-12-20'),
    address: {
      street: '555 Katipunan Ave.',
      city: 'Quezon City',
      province: 'Metro Manila',
      zipCode: 1108,
    },
    course: 'BST',
  },
]
