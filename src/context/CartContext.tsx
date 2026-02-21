'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, size: string) => void;
    removeItem: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastKey, setToastKey] = useState(0);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((message: string) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToastKey(k => k + 1);
        setToastMessage(message);
        toastTimer.current = setTimeout(() => setToastMessage(null), 2800);
    }, []);

    const addItem = useCallback((product: Product, size: string) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id && item.size === size
            );
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, size, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((productId: string, size: string) => {
        setItems((prev) =>
            prev.filter(
                (item) => !(item.product.id === productId && item.size === size)
            )
        );
    }, []);

    const updateQuantity = useCallback(
        (productId: string, size: string, quantity: number) => {
            if (quantity <= 0) {
                removeItem(productId, size);
                return;
            }
            setItems((prev) =>
                prev.map((item) =>
                    item.product.id === productId && item.size === size
                        ? { ...item, quantity }
                        : item
                )
            );
        },
        [removeItem]
    );

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isCartOpen,
                setIsCartOpen,
                showToast,
            }}
        >
            {children}
            {toastMessage && (
                <div key={toastKey} className="toast">
                    <span className="toast-icon">✓</span>
                    {toastMessage}
                </div>
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
