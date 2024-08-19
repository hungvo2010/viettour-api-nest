interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}
export class SortingCriteria {
  private configs: SortConfig[] = [];
  constructor(sortString: string) {
    const fields: string[] = sortString.split(',');
    fields.forEach((fieldName) => {
      const order = fieldName[0] === '-' ? 'desc' : 'asc';
      const field = fieldName.replace(order, '');
      this.configs.push({ field, order });
    });
  }
}
