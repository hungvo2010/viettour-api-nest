import qs, { ParsedQs } from 'qs';
import { GetTourDto } from '../dto/request/get-tour.dto';
import { ICommonCriteria } from './common.criteria';

export class FilterCriteria implements ICommonCriteria {
  private filters: ParsedQs;
  constructor(private filter: GetTourDto) {
    console.log(this.filter);
    let remainQs = new URLSearchParams(JSON.stringify(this.filter)).toString();
    console.log(remainQs);
    this.filters = qs.parse(remainQs);
  }

  public getFilters() {
    let a: {
      readonly b: number;
      c?: string;
      [key: number]: boolean;
    } = {
      b: 1,
      c: '2',
      0: true,
      1: false,
    };
    let obj: object;
    return this.filters;
  }
}
