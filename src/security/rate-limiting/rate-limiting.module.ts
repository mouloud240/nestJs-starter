import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'global',
            limit: configService.get<number>('app.throttler.limit')!,
            ttl: configService.get<number>('app.throttler.ttl')!,
            blockDuration: configService.get<number>(
              'app.throttler.blockDuration',
            ),
            ignoreUserAgents: configService.get<RegExp[]>( // Ignore requests from curl user agent
              'app.throttler.ignoreUserAgents',
            ),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class RateLimitingModule {}
