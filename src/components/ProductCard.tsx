'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { GlareCard } from '@/components/GlareCard';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [added, setAdded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
    const isUnavailable = totalStock === 0;
    const isLowStock = totalStock > 0 && totalStock <= 3;

    const getStockForSize = (size: string) => {
        const sizeInfo = product.sizes.find((s) => s.size === size);
        return sizeInfo ? sizeInfo.stock : 0;
    };

    const selectedSizeStock = selectedSize ? getStockForSize(selectedSize) : 0;

    const handleAddToCart = () => {
        if (!selectedSize || selectedSizeStock === 0) return;

        addItem(product, selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const formatPrice = (price: number) =>
        price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const categoryLabels: Record<string, string> = {
        camiseta: 'Camiseta',
        bermuda: 'Bermuda',
        calca: 'Calça',
        conjunto: 'Conjunto',
        camisa: 'Camisa',
        jaqueta: 'Jaqueta',
        acessorio: 'Acessório',
    };

    return (
        <GlareCard className="product-card">
            <Link href={`/produto/${product.id}`} className="product-image-container">
                {product.image_url && !imageError ? (
                    <img
                        className="product-image"
                        src={product.image_url}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="image-placeholder"></div>
                )}

                {isUnavailable && (
                    <span className="product-badge badge-unavailable">Indisponível</span>
                )}
                {isLowStock && !isUnavailable && (
                    <span className="product-badge badge-low-stock">
                        {totalStock} restante{totalStock > 1 ? 's' : ''}
                    </span>
                )}
            </Link>

            <div className="product-info">
                <div className="product-category">
                    {categoryLabels[product.category] || product.category}
                </div>
                <Link href={`/produto/${product.id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                </Link>
                <div className="product-price">{formatPrice(product.price)}</div>

                {!isUnavailable && (
                    <>
                        {selectedSize && selectedSizeStock > 0 && (
                            <div className={`product-stock ${selectedSizeStock <= 3 ? 'low' : ''}`}>
                                {selectedSizeStock} unidade{selectedSizeStock > 1 ? 's' : ''} restante{selectedSizeStock > 1 ? 's' : ''}
                            </div>
                        )}

                        <div className="size-selector">
                            {product.sizes.map((s) => (
                                <button
                                    key={s.size}
                                    className={`size-button ${selectedSize === s.size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(s.size)}
                                    disabled={s.stock === 0}
                                    title={s.stock === 0 ? 'Esgotado' : `${s.stock} em estoque`}
                                >
                                    {s.size}
                                </button>
                            ))}
                        </div>

                        <button
                            className={`add-to-cart-button ${added ? 'added' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!selectedSize || selectedSizeStock === 0}
                        >
                            {added ? 'Adicionado!' : 'Adicionar à Sacola'}
                        </button>
                    </>
                )}

                {isUnavailable && (
                    <button className="add-to-cart-button" disabled>
                        Produto Indisponível
                    </button>
                )}
            </div>
        </GlareCard>
    );
}
