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


export interface IUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentWithUser extends IComment {
  user?: IUser;
  replies: ICommentWithUser[];
}

export interface IReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewWithComments extends IReview {
  user?: IUser;
  comments: ICommentWithUser[];
}

export type IOrder = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user: { 
    name: string;
    email: string;
  };
  orderItems: Array<{
    quantity: number;
    price: number;
    product: {
      name: string;
      price: number;
    };
  }>;
  userAddress?: {
    address: string;
    city: string;
    postalCode: string;
  };
};

export type ProductPerformance = {
  name: string
  sales: number
  price: number
}
// Define types at the top
export type ActionResult<T = unknown> = 
  | { success: true; data?: T }
  | { success: false; error: string };

export interface GalleryArt {
  id: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}