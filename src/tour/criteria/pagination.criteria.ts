import { PaginationDto } from '../dto/request/pagination.dto';

export class PaginationCriteria {
  public limit: number;
  public offset: number;
  public cursor: any;
  constructor(public pagination: PaginationDto) {
    this.limit = pagination.limit;
    this.offset = pagination.offset;
    this.cursor = pagination.cursor;
  }
}
