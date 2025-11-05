import { Inject, LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/common/constants/injection';
import { LoggerStore } from './interfaces/logger_store.interface';
import { WinstonModule } from 'nest-winston';

import * as Winston from 'winston';
export class LoggerServiceBuilder {
  //This will be used for more complex transports like loki
  private job: string;
  constructor(
    @Inject(ASYNC_STORAGE) private readonly als: AsyncLocalStorage<LoggerStore>,
  ) {}
  setJob(job: string) {
    this.job = job;
    return this;
  }
  /**
   * @description Format log info to include requestId from AsyncLocalStorage store if available, for better traceability.(Another context can be added per project needs)
   * @param info Winston log info object
   * @return formatted log info object
   **/
  private formatInfo(info: Winston.Logform.TransformableInfo) {
    const store = this.als.getStore();
    if (store && store.requestId) {
      info.requestId = store.requestId;
    }
    return info;
  }
  build(): LoggerService {
    return WinstonModule.createLogger({
      levels: Winston.config.npm.levels,
      transports: [
        // Add more transports here like loki, file, etc.,
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format((info) => this.formatInfo(info))(),
            Winston.format.timestamp(),
            Winston.format.colorize(),
            Winston.format.json(),
            Winston.format.printf((info) => {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              return `[${info.timestamp}] [${info.level}]${
                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                info.requestId ? ` [requestId: ${info.requestId}]` : ''
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              } : ${info.message}`;
            }),
          ),
        }),
      ],
    });
  }
}
