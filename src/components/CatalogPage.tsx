'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { Product, Category, CATEGORIES } from '@/lib/types';
import { useCategories } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Camiseta Essencial Preta', category: 'camiseta', price: 89.90,
    internal_code: 'CAM-001', image_url: '', created_at: new Date().toISOString(),
    sizes: [
      { id: '1a', product_id: '1', size: 'P', stock: 5 },
      { id: '1b', product_id: '1', size: 'M', stock: 8 },
      { id: '1c', product_id: '1', size: 'G', stock: 3 },
    ],
  },
  {
    id: '2', name: 'Bermuda Cargo Premium', category: 'bermuda', price: 139.90,
    internal_code: 'BER-001', image_url: '', created_at: new Date().toISOString(),
    sizes: [
      { id: '2b', product_id: '2', size: 'M', stock: 4 },
      { id: '2c', product_id: '2', size: 'G', stock: 6 },
    ],
  },
  {
    id: '3', name: 'Calça Jogger Street', category: 'calca', price: 179.90,
    internal_code: 'CAL-001', image_url: '', created_at: new Date().toISOString(),
    sizes: [
      { id: '3b', product_id: '3', size: 'M', stock: 5 },
      { id: '3c', product_id: '3', size: 'G', stock: 7 },
    ],
  },
];

interface CatalogPageProps {
  fixedCategory?: Category;
}

export default function CatalogPage({ fixedCategory }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const { categories: dynCategories } = useCategories();
  const allCats = useMemo(
    () => dynCategories.length > 0 ? dynCategories : CATEGORIES.filter(c => c.value !== 'todos'),
    [dynCategories]
  );
  const categoryLabel = allCats.find(c => c.value === fixedCategory)?.label || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        setProducts(DEMO_PRODUCTS);
        setLoading(false);
        return;
      }

      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (productsData) {
        const withSizes = await Promise.all(
          productsData.map(async (product) => {
            const { data: sizesData } = await supabase
              .from('product_sizes')
              .select('*')
              .eq('product_id', product.id);
            return { ...product, sizes: sizesData || [] };
          })
        );
        setProducts(withSizes);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      if (fixedCategory && product.category !== fixedCategory) return false;

      if (selectedSize) {
        const hasSize = product.sizes.some(s => s.size === selectedSize && s.stock > 0);
        if (!hasSize) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedSize, fixedCategory]);

  const isShowingAll = !fixedCategory;

  const groupedProducts = useMemo(() => {
    if (!isShowingAll) return null;
    const groups: { category: string; label: string; items: Product[] }[] = [];
    for (const cat of allCats) {
      const items = filteredProducts.filter(p => p.category === cat.value);
      if (items.length > 0) {
        groups.push({ category: cat.value, label: cat.label, items });
      }
    }
    return groups;
  }, [filteredProducts, isShowingAll, allCats]);

  return (
    <>
      <Header />
      <Cart />
      <WhatsAppButton />

      <main>
        <section className="hero">
          <h1>
            {fixedCategory ? (
              <>REVEL<span className="logo-accent">SEVEN</span></>
            ) : (
              <>REVEL<span className="logo-accent">SEVEN</span></>
            )}
          </h1>
          {fixedCategory ? (
            <p>{categoryLabel}</p>
          ) : (
            <p>Estilo &amp; Elegância Masculina</p>
          )}
        </section>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="loading-card">
                <div className="loading-image" />
                <div className="loading-info">
                  <div className="loading-line short" />
                  <div className="loading-line medium" />
                  <div className="loading-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente alterar os filtros ou a busca.</p>
          </div>
        ) : isShowingAll && groupedProducts ? (
          <div className="catalog-grouped">
            {groupedProducts.map((group, gi) => (
              <section key={group.category} className="catalog-group">
                <h2 className="catalog-group-title">{group.label}</h2>
                <div className="product-grid">
                  {group.items.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${(gi * 10 + index) * 0.1}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
