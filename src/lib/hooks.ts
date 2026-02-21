'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/types';

export interface CategoryItem {
  id?: string;
  value: string;
  label: string;
  sort_order?: number;
}

const FALLBACK = CATEGORIES.filter(c => c.value !== 'todos');

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return;

    supabase
      .from('categories')
      .select('id, value, label, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setCategories(data);
        }
      });
  }, []);

  const categoriesWithAll: CategoryItem[] = [{ value: 'todos', label: 'Todos' }, ...categories];

  return { categories, categoriesWithAll };
}
