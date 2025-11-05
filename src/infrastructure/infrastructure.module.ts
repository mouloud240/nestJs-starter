import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { DbModule } from './db/db.module';
import { CloudinaryModuleWrapper } from './cloudinary/cloudinary.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from 'nestjs-redis-client';
import redisConfig from 'src/config/redis.config';

@Module({
  imports: [
    SearchModule,
    DbModule,
    CloudinaryModuleWrapper,
    QueueModule,
    RedisModule.registerAsync(redisConfig.asProvider()),
  ],
  exports: [RedisModule, QueueModule, CloudinaryModuleWrapper, DbModule],
})
export class InfrastructureModule {}
