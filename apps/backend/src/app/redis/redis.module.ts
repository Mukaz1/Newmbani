import { Global, Module } from '@nestjs/common';

// Minimal RedisModule stub. Expand later to provide Redis clients/providers if needed.
@Global()
@Module({
  providers: [],
  exports: [],
})
export class RedisModule {}
