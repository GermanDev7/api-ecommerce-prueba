import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ProductsServiceClient, ProductDetails } from '../../application/ports/products-service.client.js';

@Injectable()
export class HttpProductsApiClient implements ProductsServiceClient {
  private readonly logger = new Logger(HttpProductsApiClient.name);
  private readonly productsServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // We expect the URL to the products service to be provided securely via ENV
    this.productsServiceUrl = this.configService.get<string>('PRODUCTS_SERVICE_URL') || 'http://localhost:3001/api/v1';
  }

  async getProductDetails(productId: string): Promise<ProductDetails | null> {
    try {
      this.logger.debug(`Fetching product details for ${productId}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.productsServiceUrl}/products/${productId}`)
      );
      
      const data = response.data;
      return {
        id: data.id,
        price: data.price,
        stock: data.stock,
        status: data.status,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.logger.warn(`Product ${productId} not found`);
        return null; // Return null predictably so the Use Case can throw InvalidOrderError
      }
      
      this.logger.error(`Failed to fetch product ${productId}: ${error.message}`);
      throw new Error(`Products service is unavailable: ${error.message}`);
    }
  }
}
