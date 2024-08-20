export class FilterToursResponse<T> {
  length: number;
  values: T[];
  next: string;

  constructor(length, values, next) {
    this.length = length;
    this.values = values;
    this.next = next;
  }
}
