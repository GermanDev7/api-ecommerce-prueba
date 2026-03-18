export interface ProductDetails {
  id: string;
  price: number;
  stock: number;
  status: string;
}

// Puerto de salida (Output Port) para comunicación con el microservicio de Productos.
// Evita acoplar la capa de aplicación con una librería HTTP específica (como Axios).
export interface ProductsServiceClient {
  getProductDetails(productId: string): Promise<ProductDetails | null>;
}

export const PRODUCTS_SERVICE_CLIENT = 'PRODUCTS_SERVICE_CLIENT';
