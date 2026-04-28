import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HarvestService } from './harvest.service';

@Injectable()
export class HarvestSchedulerService {
  private readonly logger = new Logger(HarvestSchedulerService.name);
  private cronExpression: string;

  constructor(
    private harvestService: HarvestService,
    private configService: ConfigService,
  ) {
    // Default to every 5 minutes, but configurable via env
    this.cronExpression = this.configService.get<string>('HARVEST_CRON_EXPRESSION') || '*/5 * * * *';
    this.logger.log(`Harvest scheduler initialized with cron expression: ${this.cronExpression}`);
  }

  @Cron('0 */5 * * * *') // Every 5 minutes - runs at second 0 of every 5th minute
  async handleHarvest() {
    this.logger.log('Scheduled harvest job triggered');

    try {
      // For now, we'll harvest a specific vault. In production, this should iterate through all active vaults
      const vaultAddress = this.configService.get<string>('DEFAULT_VAULT_ADDRESS');

      if (!vaultAddress) {
        this.logger.warn('No DEFAULT_VAULT_ADDRESS configured, skipping harvest');
        return;
      }

      const result = await this.harvestService.performHarvest(vaultAddress);

      if (result.success) {
        this.logger.log(`Scheduled harvest completed successfully. TxHash: ${result.txHash}`);
      } else {
        this.logger.error(`Scheduled harvest failed: ${result.error}`);
      }
    } catch (error) {
      this.logger.error('Scheduled harvest job failed with exception', error);
    }
  }

  // Alternative method for custom cron expression if needed
  @Cron('cronExpression')
  async handleCustomHarvest() {
    // This would use the configurable cron expression
    // For now, using the fixed 5-minute interval above
  }
}