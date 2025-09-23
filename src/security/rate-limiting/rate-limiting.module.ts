import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (configService: ConfigType<typeof appConfig>) => ({
        throttlers: [
          {
            name: 'global',
            limit: configService.throttler.limit,
            ttl: configService.throttler.ttl,
            blockDuration: configService.throttler.blockDuration,
            ignoreUserAgents: configService.throttler.ignoreUserAgents,
          },
        ],
      }),
    }),
  ],
})
export class RateLimitingModule {}
