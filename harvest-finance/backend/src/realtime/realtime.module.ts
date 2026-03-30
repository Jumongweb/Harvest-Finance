import { Module } from '@nestjs/common';
import { VaultGateway } from './vault.gateway';

@Module({
  providers: [VaultGateway],
  exports: [VaultGateway],
})
export class RealtimeModule {}
