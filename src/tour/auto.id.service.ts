import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IdGeneratorService {
  constructor() {}
  private readonly logger = new Logger(IdGeneratorService.name);
  private generatedIds: Set<string> = new Set();

  generateId(): string {
    let newId: string;

    do {
      newId = Math.floor(1000000 + Math.random() * 9000000).toString();
    } while (this.generatedIds.has(newId));

    this.generatedIds.add(newId);
    return newId;
  }
}
