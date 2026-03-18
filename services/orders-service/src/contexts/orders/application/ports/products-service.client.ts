export interface ProductDetails {
  id: string;
  price: number;
  stock: number;
  status: string;
}

export interface ProductsServiceClient {
  getProductDetails(productId: string): Promise<ProductDetails | null>;
}

export const PRODUCTS_SERVICE_CLIENT = 'PRODUCTS_SERVICE_CLIENT';
