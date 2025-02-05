import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PricingService {
  private strapiUrl: string | undefined;
  private strapiToken: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.strapiUrl = this.configService.get<string>('STRAPI_API');
    this.strapiToken = this.configService.get<string>('STRAPI_TOKEN');
    if (!this.strapiUrl) {
      throw new Error('La variable STRAPI_API est manquante dans .env');
    }
  }

  async getApiUrlFromStrapi(): Promise<string> {
    try {
      if (this.strapiUrl && this.strapiToken) {
        const response = await firstValueFrom(
          this.httpService.get(`${this.strapiUrl}/channel-manager-url`, {
            headers: { Authorization: `Bearer ${this.strapiToken}` },
          }),
        );

        return response.data.apiUrl as string;
      }

      return 'Datas not found';
    } catch (error) {
      throw new Error(
        `Impossible de récupérer l'URL depuis Strapi: ${error.message}`,
      );
    }
  }

  async syncPrices(prices: unknown) {
    const apiUrl = await this.getApiUrlFromStrapi();
    if (!apiUrl) throw new Error('Aucune URL API trouvée.');

    const response = await firstValueFrom(
      this.httpService.post(apiUrl, prices, {
        headers: { Authorization: `Bearer ${this.strapiToken}` }, // Adapter l’auth si besoin
      }),
    );

    return response.data as unknown;
  }
}
