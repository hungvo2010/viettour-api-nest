export class FilterToursResponse<T> {
  total: number;
  length: number;
  values: T[];
  next: string;
}
