export interface ProductResponse {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    category: string[];
    images: string[];
    createdAt: string;
    status: string;
    dimensions: {
      length: number;
      width: number;
      breadth: number;
    };
    material: string[];
  }