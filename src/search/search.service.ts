import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger('SearchService');
  constructor(private readonly elasticSearchService: ElasticsearchService) {}
  onModuleInit() {
    this.elasticSearchService
      .ping()
      .then(() => {
        this.logger.log('Elasticsearch is up and running');
      })
      .catch((e) => {
        this.logger.error('Elasticsearch is down');
        this.logger.error(e);
        // Do not crash the app on startup if ES is down; operations will error lazily
      });
  }
  async onModuleDestroy() {
    try {
      // @nestjs/elasticsearch uses @elastic/elasticsearch under the hood
      // Close transport to free sockets
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyClient = this.elasticSearchService as any;
      if (anyClient?.close) {
        await anyClient.close();
      } else if (anyClient?.transport?.close) {
        await anyClient.transport.close();
      }
    } catch (e) {
      this.logger.error('Error while closing Elasticsearch client', e);
    }
  }
  //TODO:add type to the query
  async search<T>(index: string, query: any) {
    {
      try {
        const res = await this.elasticSearchService.search<T>({
          body: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            query: query,
          },

          index: index,
        });
        return res.hits.hits.map((hit) => hit._source);
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  // TODO Fix issues with request/response types
  async index<T extends { id: number }>(index: string, body: T): Promise<any> {
    return this.elasticSearchService.index<T>({
      index: index,
      body: { ...body, id: undefined }, // Ensure id is not undefined
      id: String(body.id),
    });
  }

  async delete(index: string, query: any) {
    await this.elasticSearchService.deleteByQuery({
      index: index,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: { query },
    });
  }
}
