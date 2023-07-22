import { Injectable, Logger } from '@nestjs/common';
import { PrivacyStatus } from '@prisma/client';
import { MongoClient } from 'mongodb';

@Injectable()
export class NativeMongoService {
  private readonly logger = new Logger(NativeMongoService.name);
  private tourCollection = null;

  private async initTourCollection() {
    const client = new MongoClient(process.env.DATABASE_URL);
    try {
      await client.connect();
      const db = client.db('viettour');
      this.tourCollection = db.collection('Tour');
    } catch (e) {
      this.logger.error(e);
      this.tourCollection = null;
    }
  }

  public async performFullTextSearch(query: string) {
    this.logger.log('performFullTextSearch: ' + query);
    this.logger.log(this.tourCollection);
    if (!this.tourCollection) {
      await this.initTourCollection();
    }
    if (this.tourCollection) {
      this.logger.log('here');
      const tours = await this.tourCollection
        .aggregate([
          {
            $search: {
              index: 'full-text-search',
              text: {
                query: `{name: "${query}"}`,
                path: {
                  wildcard: '*',
                },
              },
            },
          },
        ])
        .toArray();
      return this.filterPublicTours(tours);
    }
    return [];
  }

  private filterPublicTours(tours: any[]) {
    return tours.filter((tour) => tour.privacyStatus === PrivacyStatus.PUBLIC);
  }
}
