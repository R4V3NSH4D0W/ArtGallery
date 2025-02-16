export interface ProductResponse {
  id: number ; 
  productId: string;
  quantity: number;
  product: {
    id: string ; 
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


export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string[];
  images: string[];
  dimensions: {
    length: number;
    width: number;
    breadth: number;
  };
  material: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Profile {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  userAddress: {
    address: string;
    city: string;
    phoneNumber: string;
  } | null; // Allowing userAddress to be null
  orderItems: OrderItems[];
}

export interface OrderItems {
  id: number;
  price: number;
  quantity: number;
  orderId: string;
  productId: string;
  product: {
    name: string;
    images: string[];
  };
}

export interface IOrderWithRelations {
  id: string;
  userId: string;
  userAddressId: string | null;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  userAddress: {
    id: string;
    userId: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  orderItems: Array<{
    id: number;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
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
      createdAt: Date;
      updatedAt: Date;
      status: string;
    };
  }>;
}
