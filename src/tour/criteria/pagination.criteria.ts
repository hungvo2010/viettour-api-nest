export class PaginationCriteria {
  constructor(
    public limit: number,
    public offset: number,
    public cursor: any,
  ) {}
}
