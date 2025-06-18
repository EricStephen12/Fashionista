// Mock Data Service
// This file contains all mock data used in the app during development

// Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  designerId: string;
  inventory: number;
  category?: string;
  sizes?: string[];
  colors?: string[];
}

export interface Designer {
  id: string;
  name: string;
  description: string;
  logo: string;
  email: string;
  products?: Product[];
  availability?: 'available' | 'unavailable';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'customer' | 'designer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

// Mock Data
export const mockDesigners: Designer[] = [
  {
    id: 'd1',
    name: 'Luna Couture',
    description: 'Elegant and modern designs.',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    email: 'luna@couture.com',
    availability: 'available'
  },
  {
    id: 'd2',
    name: 'Urban Edge',
    description: 'Streetwear with a unique twist.',
    logo: 'https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=100&q=80',
    email: 'urban@edge.com',
    availability: 'available'
  },
  {
    id: 'd3',
    name: 'Bella Moda',
    description: 'Sophisticated evening wear.',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=100&q=80',
    email: 'bella@moda.com',
    availability: 'unavailable'
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'Asymmetric Silk Evening Gown',
    description: 'This stunning asymmetric evening gown features luxurious silk fabric with a modern silhouette that flows elegantly with movement. Hand-crafted detailing and impeccable tailoring make this piece truly unique.',
    price: '$349',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    designerId: 'd1',
    inventory: 8,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Burgundy', 'Navy', 'Black'],
  },
  {
    id: 'p2',
    title: 'Modern Tailored Blazer',
    description: 'A contemporary take on the classic blazer with structured shoulders and a fitted silhouette. Perfect for both professional settings and upscale casual events. Features premium sustainable fabric.',
    price: '$195',
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80',
    designerId: 'd2',
    inventory: 15,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Camel', 'Gray'],
  },
  {
    id: 'p3',
    title: 'Flowing Chiffon Maxi Dress',
    description: 'An ethereal maxi dress crafted from lightweight chiffon that moves beautifully with every step. Features a flattering V-neckline and delicate strap details. Perfect for summer events and destination weddings.',
    price: '$275',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    designerId: 'd1',
    inventory: 12,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blush', 'Sage', 'Ivory'],
  },
  {
    id: 'p4',
    title: 'Vintage-Inspired Denim Jacket',
    description: 'A reimagined classic denim jacket with vintage-inspired details and a comfortable, relaxed fit. Ethically sourced cotton with authentic distressing and premium hardware for a piece that will only get better with age.',
    price: '$185',
    image: 'https://images.unsplash.com/photo-1527016021513-b09758b777bd?auto=format&fit=crop&w=800&q=80',
    designerId: 'd2',
    inventory: 20,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Medium Wash', 'Light Wash', 'Dark Indigo'],
  },
  {
    id: 'p5',
    title: 'Hand-Embellished Cocktail Dress',
    description: 'A show-stopping cocktail dress featuring hand-sewn embellishments and a flattering silhouette. The structured bodice and flared skirt create a timeless look perfect for special occasions.',
    price: '$320',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
    designerId: 'd3',
    inventory: 7,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald', 'Ruby', 'Sapphire'],
  },
  {
    id: 'p6',
    title: 'Premium Cashmere Sweater',
    description: 'Luxuriously soft cashmere sweater with a relaxed fit and modern silhouette. Ethically sourced and sustainably produced for exceptional quality that will last for years.',
    price: '$225',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    designerId: 'd1',
    inventory: 15,
    category: 'Knitwear',
    sizes: ['S', 'M', 'L'],
    colors: ['Cream', 'Gray Melange', 'Caramel'],
  }
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    role: 'customer',
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    role: 'designer',
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    role: 'admin',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    items: [
      {
        ...mockProducts[0],
        quantity: 1,
      },
      {
        ...mockProducts[1],
        quantity: 2,
      },
    ],
    total: '$280',
    status: 'delivered',
    date: '2024-03-15',
  },
  {
    id: 'o2',
    userId: 'u1',
    items: [
      {
        ...mockProducts[2],
        quantity: 1,
      },
    ],
    total: '$250',
    status: 'processing',
    date: '2024-03-20',
  },
];

// Mock Service Functions
export const mockService = {
  // Products
  getProducts: () => Promise.resolve(mockProducts),
  getProductById: (id: string) => Promise.resolve(mockProducts.find(p => p.id === id)),
  getProductsByDesigner: (designerId: string) => 
    Promise.resolve(mockProducts.filter(p => p.designerId === designerId)),

  // Designers
  getDesigners: () => Promise.resolve(mockDesigners),
  getDesignerById: (id: string) => Promise.resolve(mockDesigners.find(d => d.id === id)),
  toggleDesignerAvailability: (id: string) => {
    const designer = mockDesigners.find(d => d.id === id);
    if (designer) {
      designer.availability = designer.availability === 'available' ? 'unavailable' : 'available';
      return Promise.resolve(designer);
    }
    return Promise.resolve(null);
  },

  // Users
  getUsers: () => Promise.resolve(mockUsers),
  getUserById: (id: string) => Promise.resolve(mockUsers.find(u => u.id === id)),

  // Orders
  getOrders: () => Promise.resolve(mockOrders),
  getOrdersByUser: (userId: string) => 
    Promise.resolve(mockOrders.filter(o => o.userId === userId)),

  // Cart
  getCart: () => Promise.resolve([] as CartItem[]),
  addToCart: (product: Product, quantity: number) => Promise.resolve(true),
  updateCartItem: (productId: string, quantity: number) => Promise.resolve(true),
  removeFromCart: (productId: string) => Promise.resolve(true),
  clearCart: () => Promise.resolve(true),

  // Auth
  login: (email: string, password: string) => 
    Promise.resolve(mockUsers.find(u => u.email === email)),
  register: (userData: Partial<User>) => Promise.resolve({ ...userData, id: 'new-user-id' } as User),
  logout: () => Promise.resolve(true),
};

export default mockService; 