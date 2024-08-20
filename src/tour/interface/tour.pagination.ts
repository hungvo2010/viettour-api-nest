import type { Prisma } from '@prisma/client';
type TourCursor = Prisma.TourWhereUniqueInput;
export interface TourPagination {
  cursor?: TourCursor;
  take?: number;
  skip?: number;
}
