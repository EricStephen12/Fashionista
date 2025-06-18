export type ProductApprovalStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type ProductVisibility = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  mainImage: string;
  additionalImages: string[];
  tags: string[];
  designerId: string;
  designerName: string;
  designerBrand: string;
  
  // Admin controlled fields
  approvalStatus: ProductApprovalStatus;
  approvalDate?: Date;
  approvalNotes?: string;
  approvedBy?: string;
  featured?: boolean;
  featuredUntil?: Date;
  visibility: ProductVisibility;
  
  // Product details
  material: string;
  care: string;
  style: string;
  occasion: string;
  designFeatures: string;
  colors: string[];
  
  // Metrics
  views: number;
  likes: number;
  sales: number;
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  priceRange?: { min: number; max: number };
  tags?: string[];
  designerId?: string;
  approvalStatus?: ProductApprovalStatus;
  featured?: boolean;
  visibility?: ProductVisibility;
}

// Helper function to check if a product can be displayed to customers
export function isProductVisibleToCustomers(product: Product): boolean {
  return (
    product.approvalStatus === 'approved' &&
    product.visibility === 'published' &&
    product.stock > 0
  );
}

// Helper function to check if a product is featured
export function isProductFeatured(product: Product): boolean {
  if (!product.featured) return false;
  if (!product.featuredUntil) return true;
  return new Date() < new Date(product.featuredUntil);
}

// Mock function to get products with filters
export function getProducts(filter?: ProductFilter): Product[] {
  // In a real app, this would fetch from an API
  return [];
} 