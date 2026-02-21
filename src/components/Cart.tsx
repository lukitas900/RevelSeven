'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { sendWhatsAppOrder } from '@/lib/whatsapp';

export default function Cart() {
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
    } = useCart();

    const [customerName, setCustomerName] = useState('');
    const [sending, setSending] = useState(false);

    const formatPrice = (price: number) =>
        price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setSending(true);
        try {
            await sendWhatsAppOrder(items, customerName);
            clearCart();
            setIsCartOpen(false);
            setCustomerName('');
        } catch (error) {
            console.error('Error sending order:', error);
        } finally {
            setSending(false);
        }
    };

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
            <aside className="cart-sidebar">
                <div className="cart-header">
                    <h2>Sua Sacola</h2>
                    <button className="cart-close" onClick={() => setIsCartOpen(false)}>
                        ×
                    </button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon"></div>
                            <p>Sua sacola está vazia</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={`${item.product.id}-${item.size}`}
                                className="cart-item"
                            >
                                {item.product.image_url ? (
                                    <img
                                        className="cart-item-image"
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                    />
                                ) : (
                                    <div
                                        className="cart-item-image"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        —
                                    </div>
                                )}

                                <div className="cart-item-info">
                                    <div>
                                        <div className="cart-item-name">{item.product.name}</div>
                                        <div className="cart-item-size">
                                            Tamanho: {item.size}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="cart-item-price">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </div>

                                        <div className="cart-item-actions">
                                            <div className="quantity-control">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product.id,
                                                            item.size,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>
                                                <span className="quantity-value">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product.id,
                                                            item.size,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeItem(item.product.id, item.size)
                                                }
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-row">
                            <span className="cart-total-label">Total estimado</span>
                            <span className="cart-total-value">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        <input
                            type="text"
                            className="cart-name-input"
                            placeholder="Seu nome (opcional)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />

                        <button
                            className="whatsapp-checkout-btn"
                            onClick={handleCheckout}
                            disabled={sending}
                        >
                            {sending ? 'Enviando...' : 'Reservar pelo WhatsApp'}
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
