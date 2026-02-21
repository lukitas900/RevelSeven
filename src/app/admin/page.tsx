'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Order, CATEGORIES, SIZES } from '@/lib/types';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories'>('products');

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formCategory, setFormCategory] = useState('camiseta');
    const [formPrice, setFormPrice] = useState('');
    const [formCode, setFormCode] = useState('');
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState('');
    const [formExtraImageFiles, setFormExtraImageFiles] = useState<(File | null)[]>([null, null, null, null]);
    const [formExtraPreviews, setFormExtraPreviews] = useState<string[]>(['', '', '', '']);
    const [formSizes, setFormSizes] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);

    // Categories state
    const [customCategories, setCustomCategories] = useState<{ id: string; value: string; label: string; sort_order: number }[]>([]);
    const [newCatLabel, setNewCatLabel] = useState('');
    const [catSaving, setCatSaving] = useState(false);
    const [catLoading, setCatLoading] = useState(false);
    const [catError, setCatError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Senha incorreta');
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (!supabaseUrl) {
                setProducts([]);
                setLoading(false);
                return;
            }

            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;

            if (productsData) {
                const productsWithSizes: Product[] = await Promise.all(
                    productsData.map(async (product) => {
                        const { data: sizesData } = await supabase
                            .from('product_sizes')
                            .select('*')
                            .eq('product_id', product.id);

                        return {
                            ...product,
                            sizes: sizesData || [],
                        };
                    })
                );

                setProducts(productsWithSizes);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setCatLoading(true);
        setCatError('');
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (!supabaseUrl) {
                setCustomCategories(CATEGORIES.filter(c => c.value !== 'todos').map((c, i) => ({ id: c.value, value: c.value, label: c.label, sort_order: i })));
                return;
            }
            const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
            if (error) throw error;
            setCustomCategories(data || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            console.error('fetchCategories error:', msg);
            setCatError(`Erro ao carregar categorias: ${msg}`);
        } finally {
            setCatLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (!supabaseUrl) {
                setOrders([]);
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchOrders();
            fetchCategories();
        }
    }, [isAuthenticated, fetchProducts, fetchOrders, fetchCategories]);

    const openNewProduct = () => {
        setEditingProduct(null);
        setFormName('');
        setFormCategory(customCategories[0]?.value || 'camiseta');
        setFormPrice('');
        setFormCode('');
        setFormImageFile(null);
        setFormImagePreview('');
        setFormExtraImageFiles([null, null, null, null]);
        setFormExtraPreviews(['', '', '', '']);
        setFormSizes({});
        setShowModal(true);
    };

    const openEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormName(product.name);
        setFormCategory(product.category);
        setFormPrice(product.price.toString());
        setFormCode(product.internal_code);
        setFormImagePreview(product.image_url || '');
        setFormImageFile(null);
        const existingExtras = product.images || [];
        setFormExtraPreviews([
            existingExtras[0] || '',
            existingExtras[1] || '',
            existingExtras[2] || '',
            existingExtras[3] || '',
        ]);
        setFormExtraImageFiles([null, null, null, null]);

        const sizes: Record<string, number> = {};
        product.sizes.forEach((s) => {
            sizes[s.size] = s.stock;
        });
        setFormSizes(sizes);
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFiles = [...formExtraImageFiles];
            newFiles[index] = file;
            setFormExtraImageFiles(newFiles);
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...formExtraPreviews];
                newPreviews[index] = reader.result as string;
                setFormExtraPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeExtraImage = (index: number) => {
        const newFiles = [...formExtraImageFiles];
        newFiles[index] = null;
        setFormExtraImageFiles(newFiles);
        const newPreviews = [...formExtraPreviews];
        newPreviews[index] = '';
        setFormExtraPreviews(newPreviews);
    };

    const handleSizeStockChange = (size: string, value: string) => {
        const stock = parseInt(value) || 0;
        setFormSizes((prev) => ({
            ...prev,
            [size]: stock,
        }));
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (!supabaseUrl) {
                alert('Configure o Supabase para gerenciar produtos.');
                setSaving(false);
                return;
            }

            let imageUrl = editingProduct?.image_url || '';

            // Upload image if new
            if (formImageFile) {
                const fileExt = formImageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, formImageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                imageUrl = urlData.publicUrl;
            }

            // Upload extra images
            const extraUrls: string[] = [];
            for (let i = 0; i < 4; i++) {
                const file = formExtraImageFiles[i];
                if (file) {
                    const ext = file.name.split('.').pop();
                    const fname = `${Date.now()}_extra${i}.${ext}`;
                    const { error: upErr } = await supabase.storage
                        .from('product-images')
                        .upload(fname, file);
                    if (!upErr) {
                        const { data: urlD } = supabase.storage
                            .from('product-images')
                            .getPublicUrl(fname);
                        extraUrls.push(urlD.publicUrl);
                    } else {
                        extraUrls.push(formExtraPreviews[i] || '');
                    }
                } else {
                    // Keep existing URL if not replaced
                    extraUrls.push(formExtraPreviews[i] || '');
                }
            }
            const imagesArray = extraUrls.filter(Boolean);

            const productData = {
                name: formName,
                category: formCategory,
                price: parseFloat(formPrice),
                internal_code: formCode,
                image_url: imageUrl,
                images: imagesArray.length > 0 ? imagesArray : null,
            };

            let productId = editingProduct?.id;

            if (editingProduct) {
                // Update
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (updateError) throw updateError;
            } else {
                // Create
                const { data: newProduct, error: createError } = await supabase
                    .from('products')
                    .insert(productData)
                    .select()
                    .single();

                if (createError) throw createError;
                productId = newProduct.id;
            }

            // Update sizes
            if (productId) {
                // Delete existing sizes
                await supabase
                    .from('product_sizes')
                    .delete()
                    .eq('product_id', productId);

                // Insert new sizes
                const sizesData = Object.entries(formSizes)
                    .filter(([, stock]) => stock >= 0)
                    .map(([size, stock]) => ({
                        product_id: productId,
                        size,
                        stock,
                    }));

                if (sizesData.length > 0) {
                    const { error: sizesError } = await supabase
                        .from('product_sizes')
                        .insert(sizesData);

                    if (sizesError) throw sizesError;
                }
            }

            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            alert('Erro ao salvar produto. Verifique os dados.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await supabase.from('product_sizes').delete().eq('product_id', productId);
            await supabase.from('products').delete().eq('id', productId);
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const handleUpdateOrderStatus = async (
        orderId: string,
        status: string
    ) => {
        try {
            // When confirming, decrement stock for each item
            if (status === 'confirmado') {
                const order = orders.find(o => o.id === orderId);
                if (order && Array.isArray(order.items)) {
                    for (const item of order.items) {
                        const { data: sizeRow } = await supabase
                            .from('product_sizes')
                            .select('stock')
                            .eq('product_id', item.product_id)
                            .eq('size', item.size)
                            .single();
                        if (sizeRow) {
                            const newStock = Math.max(0, sizeRow.stock - item.quantity);
                            await supabase
                                .from('product_sizes')
                                .update({ stock: newStock })
                                .eq('product_id', item.product_id)
                                .eq('size', item.size);
                        }
                    }
                }
            }

            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId);

            if (error) throw error;
            fetchOrders();
            if (status === 'confirmado') fetchProducts(); // refresh stock display
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatLabel.trim()) return;
        setCatSaving(true);
        setCatError('');
        const value = newCatLabel.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (!supabaseUrl) { alert('Configure o Supabase.'); return; }
            const { error } = await supabase.from('categories').insert({
                value,
                label: newCatLabel.trim(),
                sort_order: customCategories.length + 1,
            });
            if (error) throw error;
            setNewCatLabel('');
            fetchCategories();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            console.error('handleAddCategory error:', msg);
            setCatError(`Erro ao criar categoria: ${msg}`);
        } finally {
            setCatSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string, label: string) => {
        if (!confirm(`Excluir categoria "${label}"?`)) return;
        setCatError('');
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchCategories();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            console.error('handleDeleteCategory error:', msg);
            setCatError(`Erro ao excluir categoria: ${msg}`);
        }
    };

    const formatPrice = (price: number) =>
        price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <h2>Painel Admin</h2>
                <p>Digite a senha para acessar</p>
                {error && <div className="admin-error">{error}</div>}
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        className="admin-input"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="admin-btn">
                        Entrar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <h1>Painel Admin</h1>
                <div className="admin-actions">
                    <Link href="/" className="btn-secondary">
                        ← Voltar ao Site
                    </Link>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsAuthenticated(false)}
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Produtos
                </button>
                <button
                    className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Pedidos
                </button>
                <button
                    className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categorias
                </button>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <button className="btn-primary" onClick={openNewProduct}>
                            ＋ Novo Produto
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"></div>
                            <h3>Nenhum produto cadastrado</h3>
                            <p>
                                {process.env.NEXT_PUBLIC_SUPABASE_URL
                                    ? 'Clique em "Novo Produto" para começar.'
                                    : 'Configure o Supabase para gerenciar produtos.'}
                            </p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nome</th>
                                    <th>Categoria</th>
                                    <th>Preço</th>
                                    <th>Código</th>
                                    <th>Estoque</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const totalStock = product.sizes.reduce(
                                        (sum, s) => sum + s.stock,
                                        0
                                    );
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                {product.image_url ? (
                                                    <img
                                                        className="admin-table-image"
                                                        src={product.image_url}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div
                                                        className="admin-table-image"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: 'var(--bg-tertiary)',
                                                            fontSize: '1.2rem',
                                                        }}
                                                    >
                                                        —
                                                    </div>
                                                )}
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{formatPrice(product.price)}</td>
                                            <td>
                                                <code style={{ color: 'var(--text-muted)' }}>
                                                    {product.internal_code}
                                                </code>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        color:
                                                            totalStock === 0
                                                                ? 'var(--danger)'
                                                                : totalStock <= 3
                                                                    ? 'var(--accent)'
                                                                    : 'var(--success)',
                                                    }}
                                                >
                                                    {totalStock} un.
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        className="btn-secondary"
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => openEditProduct(product)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <>
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"></div>
                            <h3>Nenhum pedido registrado</h3>
                            <p>Os pedidos aparecerão aqui quando forem reservados.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <span className="order-code">{order.order_code}</span>
                                        {order.customer_name && (
                                            <span style={{ color: 'var(--text-secondary)', marginLeft: '12px' }}>
                                                {order.customer_name}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`order-status ${order.status}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items-list">
                                    {Array.isArray(order.items) &&
                                        order.items.map((item, i) => (
                                            <div key={i}>
                                                • {item.product_name} — Tam: {item.size} — Qtd:{' '}
                                                {item.quantity} — {formatPrice(item.unit_price)}
                                            </div>
                                        ))}
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                    }}
                                >
                                    <div>
                                        <span className="order-total">
                                            {formatPrice(order.total)}
                                        </span>
                                        <span className="order-date" style={{ marginLeft: '12px' }}>
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>

                                    <div className="order-actions">
                                        {order.status === 'pendente' && (
                                            <>
                                                <button
                                                    className="btn-success"
                                                    onClick={() =>
                                                        handleUpdateOrderStatus(order.id, 'confirmado')
                                                    }
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() =>
                                                        handleUpdateOrderStatus(order.id, 'cancelado')
                                                    }
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'confirmado' && (
                                            <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>
                                                Pedido confirmado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div>
                    {catError && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#f87171', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                            {catError}
                        </div>
                    )}

                    <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                            <label>Nova Categoria</label>
                            <input
                                type="text"
                                value={newCatLabel}
                                onChange={(e) => setNewCatLabel(e.target.value)}
                                placeholder="Ex: Moletons"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={catSaving}>
                            {catSaving ? 'Salvando...' : '+ Adicionar'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={fetchCategories} disabled={catLoading}>
                            {catLoading ? 'Carregando...' : 'Atualizar'}
                        </button>
                    </form>

                    {catLoading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Carregando categorias...</p>
                    ) : customCategories.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>Nenhuma categoria encontrada. Verifique as políticas RLS no Supabase.</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Slug (URL)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customCategories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>{cat.label}</td>
                                        <td><code style={{ color: 'var(--text-muted)' }}>/categoria/{cat.value}</code></td>
                                        <td>
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleDeleteCategory(cat.id, cat.label)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Product Form Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>
                            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                        </h2>

                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>Nome do Produto</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Ex: Camiseta Essencial Preta"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Categoria</label>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value)}
                                    >
                                        {(customCategories.length > 0
                                            ? customCategories
                                            : CATEGORIES.filter(c => c.value !== 'todos')
                                        ).map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formPrice}
                                        onChange={(e) => setFormPrice(e.target.value)}
                                        placeholder="89.90"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Código Interno</label>
                                <input
                                    type="text"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    placeholder="Ex: CAM-001"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Imagem Principal</label>
                                <div className="image-upload">
                                    {formImagePreview ? (
                                        <img
                                            className="image-upload-preview"
                                            src={formImagePreview}
                                            alt="Preview"
                                        />
                                    ) : (
                                        <div className="image-upload-text">
                                            Clique para selecionar
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Imagens Adicionais (até 4)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {[0, 1, 2, 3].map((i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <div className="image-upload" style={{ minHeight: '80px' }}>
                                                {formExtraPreviews[i] ? (
                                                    <img
                                                        className="image-upload-preview"
                                                        src={formExtraPreviews[i]}
                                                        alt={`Extra ${i + 1}`}
                                                        style={{ height: '80px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="image-upload-text" style={{ fontSize: '0.7rem', padding: '8px' }}>
                                                        + Foto {i + 1}
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleExtraImageChange(i, e)}
                                                />
                                            </div>
                                            {formExtraPreviews[i] && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraImage(i)}
                                                    style={{
                                                        position: 'absolute', top: '4px', right: '4px',
                                                        background: 'rgba(0,0,0,0.7)', color: '#fff',
                                                        border: 'none', borderRadius: '50%',
                                                        width: '20px', height: '20px',
                                                        cursor: 'pointer', fontSize: '10px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Estoque por Tamanho</label>
                                <div className="size-stock-grid">
                                    {SIZES.map((size) => (
                                        <div key={size} className="size-stock-item">
                                            <label>{size}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formSizes[size] || 0}
                                                onChange={(e) =>
                                                    handleSizeStockChange(size, e.target.value)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
