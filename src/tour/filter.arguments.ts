import { ArgumentType } from './argument.type';
import { ICommonCriteria } from './criteria/common.criteria';

export class FilterArguments {
  // filter by enum: ?type=[PRIVATE, PUBLIC]
  // filter by comparator ?like>=100
  // sorting desc, asc: sort=-price,name
  // logical operators: ?a=1&b=2&c=3||a=1&b=2&c=3
  // limit, offset: ?limit=10&offset=20
  // multiple field sortings: ?sort=-price,name
  private filterArguments: Map<ArgumentType, ICommonCriteria> = new Map();

  parseArgType(key: string): ArgumentType {
    switch (key) {
      case 'type':
        return ArgumentType.FILTER;
      default:
        return ArgumentType.FILTER;
    }
  }

  add(type: ArgumentType, criteria: ICommonCriteria) {
    this.filterArguments.set(type, criteria);
  }

  ofType(type: ArgumentType): ICommonCriteria {
    return this.filterArguments.get(type);
  }
}
