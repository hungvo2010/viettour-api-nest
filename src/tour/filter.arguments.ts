import { ArgumentType } from './argument.type';

export class FilterArguments {
  // filter by enum: ?type=[PRIVATE, PUBLIC]
  // filter by comparator ?like>=100
  // sorting desc, asc: sort=-price,name
  // logical operators: ?a=1&b=2&c=3||a=1&b=2&c=3
  // limit, offset: ?limit=10&offset=20
  // multiple field sortings: ?sort=-price,name
  private filterType: ArgumentType;
  private key: string;
  private value: string;
  private filterArguments: Map<ArgumentType, string> = new Map();
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
    this.filterType = this.parseFilterType(key);
  }

  parseFilterType(key: string): ArgumentType {
    switch (key) {
      case 'type':
        return ArgumentType.BY_TYPE;
      default:
        return ArgumentType.BY_TYPE;
    }
  }

  ofType(type: ArgumentType): string {
    return this.filterArguments.get(type);
  }
}
