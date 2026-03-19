export interface ProductDetails {
  id: string;
  price: number;
  stock: number;
  status: string;
}

export interface ProductsServiceClient {
  getProductDetails(productId: string): Promise<ProductDetails | null>;
  deductStock(productId: string, quantity: number): Promise<void>;
}

export const PRODUCTS_SERVICE_CLIENT = 'PRODUCTS_SERVICE_CLIENT';
