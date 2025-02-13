export interface ProductResponse {
  id: number; // Cart item id or any identifier for the cart entry
  productId: string; // The actual product id
  quantity: number; // Quantity of this product in the cart
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string[];
    material: string[];
    length: number | null;
    width: number | null;
    breadth: number | null;
    images: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
