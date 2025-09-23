import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { SearchService } from './search.service';
import elasticSearchConfig from 'src/config/elastic-search.config';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync(elasticSearchConfig.asProvider()),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
