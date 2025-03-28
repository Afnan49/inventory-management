export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price?: number;
  priceBeforeDiscount?: number;
  priceAfterDiscount?: number;
  rating: number;
  reviews: number;
  lastUpdated: string;
  description: string;
  thumbnail: string;
  images: string[];
  features: string[];
}
