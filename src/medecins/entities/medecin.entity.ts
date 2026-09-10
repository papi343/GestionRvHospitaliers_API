import { Doctor } from '@prisma/client';

export class MedecinEntity implements Doctor {
  id: number;
  userId: number;
  nom: string;
  licence: string;
  createdAt: Date;
  updatedAt: Date;
}
