import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/common/constants/injection';

@Module({
  providers: [
    {
      provide: ASYNC_STORAGE,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [ASYNC_STORAGE],
})
export class AlsModule {}
