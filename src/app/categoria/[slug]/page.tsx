'use client';

import { useParams } from 'next/navigation';
import CatalogPage from '@/components/CatalogPage';
export default function CategoryPage() {
    const { slug } = useParams();
    const slugStr = Array.isArray(slug) ? slug[0] : (slug ?? '');

    if (!slugStr || slugStr === 'todos') {
        return <CatalogPage />;
    }

    return <CatalogPage fixedCategory={slugStr} />;
}
