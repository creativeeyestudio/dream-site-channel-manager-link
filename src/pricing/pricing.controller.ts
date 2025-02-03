import { Body, Controller, Post } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('sync')
  async syncPrices(@Body() prices: any) {
    return this.pricingService.syncPrices(prices);
  }
}
