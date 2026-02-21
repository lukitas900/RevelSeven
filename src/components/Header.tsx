'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/lib/hooks';

export default function Header() {
    const { totalItems, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const { categoriesWithAll } = useCategories();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <Link href="/" className="logo" onClick={closeMenu}>
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
                            onClick={() => { setIsCartOpen(true); closeMenu(); }}
                            aria-label="Abrir sacola"
                        >
                             Sacola
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems}</span>
                            )}
                        </button>
                        <button
                            className="hamburger-btn"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                        >
                            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
                            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
                            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <>
                    <div className="mobile-nav-overlay" onClick={closeMenu} />
                    <nav className="mobile-nav">
                        {categoriesWithAll.map((cat) => {
                            const href = cat.value === 'todos' ? '/' : `/categoria/${cat.value}`;
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={cat.value}
                                    href={href}
                                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    {cat.label}
                                </Link>
                            );
                        })}
                    </nav>
                </>
            )}
        </>
    );
}

