export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface ProductProps {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private readonly _id: string;
  private readonly props: ProductProps;

  private constructor(props: ProductProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }

  static create(input: {
    name: string;
    description?: string;
    price: number;
    stock: number;
  }): Product {
    if (input.stock < 0) throw new Error('Stock cannot be negative');
    if (input.price <= 0) throw new Error('Price must be greater than zero');
    return new Product({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ProductProps, id: string): Product {
    return new Product(props, id);
  }

  get id(): string { return this._id; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get price(): number { return this.props.price; }
  get stock(): number { return this.props.stock; }
  get status(): ProductStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  hasStock(quantity: number): boolean {
    return this.props.stock >= quantity;
  }
}
