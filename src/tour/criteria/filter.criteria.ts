import { ICommonCriteria } from './common.criteria';

export class FilterCriteria implements ICommonCriteria {
  constructor(private filter: Object) {}
}
