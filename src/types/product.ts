export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'X2XL' | 'X3XL';

export interface ProductImage {
  id: number;
  url: string;
  image_order?: number;
}

export interface ProductVariant {
  id: number;
  size: ProductSize;
  quantity: number;
}

export interface ProductColor {
  id: number;
  colorName: string;
  colorCode: string;
  variants: ProductVariant[];
}

export interface ProductReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: number;
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: ProductCategory;
  categoryId?: number;
  productimg: ProductImage[];
  colors?: ProductColor[];
  reviews?: ProductReview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  data: Product[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

