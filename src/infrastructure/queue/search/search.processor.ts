import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { SearchService } from 'src/search/search.service';
import { SearchJobDataDto } from './dtos/SearchJobData.dto';
import { Job } from 'bullmq';
import { SEARACH_JOB_NAME } from 'src/common/constants/jobs';

@Processor(QUEUE_NAME.SEARCH)
export class SearchProcessor extends WorkerHost {
  logger = new Logger(SearchProcessor.name);
  constructor(private readonly searchService: SearchService) {
    super();
  }
  process(job: Job<SearchJobDataDto>): Promise<any> {
    this.logger.log('Processing job: ' + job.name);
    switch (job.name) {
      case SEARACH_JOB_NAME.SEARCH_INDEX:
        this.logger.log('Indexing data');
        return this.searchService.index(job.data.index, job.data.body);
      case SEARACH_JOB_NAME.SEARCH_DELETE:
        this.logger.log('Deleting indexed Data');
        return this.searchService.delete(job.data.index, job.data.body);
      default:
        return Promise.resolve();
    }
  }
}
