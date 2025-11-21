export type ProductCategory = 'men' | 'women';

export interface ProductImage {
  id: number;
  url: string;
  image_order?: number;
}

export interface Product {
  id: number;
  productTitle: string;
  productPrice: number;
  productDiscription: string;
  productRating: number;
  category: ProductCategory;
  productimg: ProductImage[];
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

