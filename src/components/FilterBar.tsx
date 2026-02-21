'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { SIZES } from '@/lib/types';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedSize: string;
    onSizeChange: (size: string) => void;
}

export default function FilterBar({
    searchQuery,
    onSearchChange,
    selectedSize,
    onSizeChange,
}: FilterBarProps) {
    return (
        <section className="filter-section">

            {/* Busca */}
            <div className="search-wrapper">
                <Search className="search-icon" size={15} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar peças..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Tamanhos */}
            <div className="filter-row filter-row-sizes">
                <button
                    className={`filter-chip size-chip ${selectedSize === '' ? 'active' : ''}`}
                    onClick={() => onSizeChange('')}
                >
                    Todos
                </button>
                {SIZES.map((size) => (
                    <button
                        key={size}
                        className={`filter-chip size-chip ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => onSizeChange(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>

        </section>
    );
}
