'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { GlareCard } from '@/components/GlareCard';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addItem, showToast } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    async function fetchProduct() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                const { data: sizesData } = await supabase
                    .from('product_sizes')
                    .select('*')
                    .eq('product_id', data.id);

                const fullProduct = {
                    ...data,
                    sizes: sizesData || [],
                };
                setProduct(fullProduct);
                setActiveImage(data.image_url || '');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = () => {
        if (!product || !selectedSize) return;
        addItem(product, selectedSize);
        showToast(`${product.name} adicionado à sacola!`);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const formatPrice = (price: number) =>
        price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (loading) {
        return (
            <div className="product-page-loading">
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page-error">
                <Header />
                <div className="error-container">
                    <h2>Produto não encontrado</h2>
                </div>
            </div>
        );
    }

    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);

    return (
        <>
            <Header />
            <Cart />
            <WhatsAppButton />

            <main className="product-detail-container">
                <div className="product-detail-grid">
                    <div className="product-gallery">
                        <GlareCard className="main-image-glare">
                            <img src={activeImage} alt={product.name} className="main-image" />
                        </GlareCard>

                        {allImages.length > 1 && (
                            <div className="thumbnail-list">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                                        onClick={() => setActiveImage(img)}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-detail-info">
                        <div className="breadcrumb">
                            <span>Início</span> / <span>{product.category}</span>
                        </div>
                        <h1 className="detail-name">{product.name}</h1>
                        <div className="detail-price">{formatPrice(product.price)}</div>

                        <div className="detail-description">
                            <p>Código: {product.internal_code}</p>
                            <p>Peça exclusive da RevelSeven. Conforto e estilo definem nossa coleção.</p>
                        </div>

                        <div className="detail-sizes">
                            <span className="size-label">Escolha o Tamanho:</span>
                            <div className="size-options">
                                {product.sizes.map((s) => (
                                    <button
                                        key={s.size}
                                        className={`size-option-btn ${selectedSize === s.size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(s.size)}
                                        disabled={s.stock === 0}
                                    >
                                        {s.size}
                                        {s.stock > 0 && s.stock <= 3 && <span className="low-stock-dot" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className={`buy-now-btn ${added ? 'added' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                        >
                            {added ? 'Adicionado à Sacola!' : 'Adicionar à Sacola'}
                        </button>

                        <div className="store-benefits">
                            <div className="benefit">
                                <span className="benefit-icon"></span>
                                <div className="benefit-text">
                                    <strong>Frete Grátis</strong>
                                    <span>Em compras acima de R$ 300</span>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon"></span>
                                <div className="benefit-text">
                                    <strong>Troca Fácil</strong>
                                    <span>Até 7 dias após o recebimento</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .product-detail-container {
                    max-width: 1200px;
                    margin: 100px auto 60px;
                    padding: 0 24px;
                }
                .product-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: start;
                }
                .product-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .main-image {
                    width: 100%;
                    aspect-ratio: 4/5;
                    object-fit: cover;
                }
                .thumbnail-list {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 10px;
                }
                .thumbnail-btn {
                    width: 80px;
                    height: 100px;
                    border: 2px solid var(--border);
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    padding: 0;
                }
                .thumbnail-btn.active {
                    border-color: var(--accent);
                }
                .thumbnail-btn img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .breadcrumb {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 15px;
                }
                .detail-name {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                    color: white;
                }
                .detail-price {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--accent);
                    margin-bottom: 30px;
                }
                .detail-description {
                    color: var(--text-secondary);
                    margin-bottom: 40px;
                    line-height: 1.8;
                }
                .detail-sizes {
                    margin-bottom: 40px;
                }
                .size-label {
                    display: block;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                .size-options {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .size-option-btn {
                    min-width: 50px;
                    height: 50px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                }
                .size-option-btn.selected {
                    background: var(--accent);
                    border-color: var(--accent);
                    color: black;
                    font-weight: bold;
                }
                .size-option-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    text-decoration: line-through;
                }
                .low-stock-dot {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 6px;
                    height: 6px;
                    background: var(--danger);
                    border-radius: 50%;
                }
                .buy-now-btn {
                    width: 100%;
                    padding: 20px;
                    background: var(--accent);
                    border: none;
                    border-radius: 15px;
                    color: black;
                    font-weight: 800;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-bottom: 40px;
                }
                .buy-now-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3);
                }
                .buy-now-btn.added {
                    background: var(--success);
                    color: white;
                }
                .store-benefits {
                    border-top: 1px solid var(--border);
                    padding-top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .benefit {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                .benefit-icon {
                    font-size: 1.5rem;
                }
                .benefit-text strong {
                    display: block;
                    font-size: 0.9rem;
                }
                .benefit-text span {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }
                .loading-container {
                    height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid var(--accent-light);
                    border-top: 3px solid var(--accent);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .product-detail-grid {
                        grid-template-columns: 1fr;
                        gap: 30px;
                    }
                    .detail-name {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </>
    );
}
