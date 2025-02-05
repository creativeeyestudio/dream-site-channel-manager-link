/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createCache } from 'cache-manager';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Cache
  // ----------------------------------
  cache = createCache({
    stores: [
      new Keyv({
        store: new CacheableMemory({
          ttl: 3600,
        }),
      }),
    ],
  });
}
