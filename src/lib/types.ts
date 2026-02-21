export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  internal_code: string;
  image_url: string;
  images?: string[];
  created_at: string;
  sizes: ProductSize[];
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  order_code: string;
  items: OrderItem[];
  total: number;
  customer_name: string | null;
  status: 'pendente' | 'confirmado' | 'cancelado';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

export type Category = string;

export const CATEGORIES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'camiseta', label: 'Camisetas' },
  { value: 'bermuda', label: 'Bermudas' },
  { value: 'calca', label: 'Calças' },
  { value: 'conjunto', label: 'Conjuntos' },
  { value: 'camisa', label: 'Camisas' },
  { value: 'jaqueta', label: 'Jaquetas' },
  { value: 'acessorio', label: 'Acessórios' },
];

export const DEFAULT_CATEGORIES = CATEGORIES.filter(c => c.value !== 'todos');

export const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
