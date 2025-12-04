export type ProductCategory = 'men' | 'women';
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

export interface Product {
  id: number;
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: ProductCategory;
  productimg: ProductImage[];
  colors?: ProductColor[];
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

