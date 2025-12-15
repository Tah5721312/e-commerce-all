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

export interface ProductSize {
  id: number;
  name: string;
  displayName: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  image_order?: number;
}

export interface ProductVariant {
  id: number;
  size: ProductSize;
  sizeId?: number;
  quantity: number;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
}

export interface ProductColor {
  id: number;
  colorName: string;
  colorCode: string;
  quantity?: number; // For products without sizes
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
  companyId?: number | null;
  company?: Company | null;
  quantity?: number; // For products without colors or sizes
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
