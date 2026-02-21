'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/lib/hooks';

export default function Header() {
    const { totalItems, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const { categoriesWithAll } = useCategories();

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    REVEL<span className="logo-accent">SEVEN</span>
                </Link>

                <nav className="header-nav">
                    {categoriesWithAll.map((cat) => {
                        const href = cat.value === 'todos' ? '/' : `/categoria/${cat.value}`;
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={cat.value}
                                href={href}
                                className={`header-nav-link ${isActive ? 'active' : ''}`}
                            >
                                {cat.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="header-actions">
                    <button
                        className="cart-button"
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Abrir sacola"
                    >
                         Sacola
                        {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

