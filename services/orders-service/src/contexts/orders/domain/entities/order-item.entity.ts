export class OrderItem {
  private readonly _id: string;

  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    id?: string,
  ) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    if (unitPrice < 0) throw new Error('Unit price cannot be negative');
    this._id = id ?? crypto.randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
