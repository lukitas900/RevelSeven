-- TABELA DE PRODUTOS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  internal_code TEXT NOT NULL,
  image_url TEXT,
  images TEXT[],  -- array de URLs de imagens adicionais
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Se a tabela já existir, rode:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- TABELA DE TAMANHOS E ESTOQUE
CREATE TABLE product_sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, size)
);

-- TABELA DE PEDIDOS
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CONFIGURAÇÃO DE RLS (POLÍTICAS DE SEGURANÇA)

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para 'products'
CREATE POLICY "Leitura pública de produtos" ON products FOR SELECT USING (true);
CREATE POLICY "Admin pode gerenciar produtos" ON products FOR ALL USING (true); -- Em prod, restringir por auth

-- Políticas para 'product_sizes'
CREATE POLICY "Leitura pública de tamanhos" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Admin pode gerenciar tamanhos" ON product_sizes FOR ALL USING (true);

-- Políticas para 'orders'
CREATE POLICY "Inserção pública de pedidos" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode ver pedidos" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin pode atualizar pedidos" ON orders FOR UPDATE USING (true);

-- STORAGE BUCKET
-- Note: Buckets devem ser criados via Painel do Supabase ou API. 
-- Crie um bucket chamado 'product-images' e torne-o Público.

-- TABELA DE CATEGORIAS DINÂMICAS
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir categorias padrão (ignore se já existirem)
INSERT INTO categories (value, label, sort_order) VALUES
  ('camiseta',  'Camisetas',  1),
  ('bermuda',   'Bermudas',   2),
  ('calca',     'Calças',     3),
  ('conjunto',  'Conjuntos',  4),
  ('camisa',    'Camisas',    5),
  ('jaqueta',   'Jaquetas',   6),
  ('acessorio', 'Acessórios', 7)
ON CONFLICT (value) DO NOTHING;

-- Políticas para 'categories'
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin pode gerenciar categorias" ON categories FOR ALL USING (true);
