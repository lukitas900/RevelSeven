'use client';
import React from 'react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCategories } from '@/lib/hooks';

export default function Footer() {
    const { categories } = useCategories();
    return (
        <footer className="footer-root">
            <div className="footer-inner">

                {/* Logo + copyright */}
                <div className="footer-brand">
                    <a href="/" className="footer-logo">
                        <ShoppingBag size={18} color="#a855f7" />
                        <span>REVEL<span style={{ color: '#a855f7' }}>SEVEN</span></span>
                    </a>
                    <p className="footer-copy">
                        &copy; {new Date().getFullYear()} Revel Seven. Todos os direitos reservados.
                    </p>
                </div>

                {/* Colunas */}
                <div className="footer-grid">

                    {/* Coleções */}
                    <div className="footer-col">
                        <span className="footer-heading">Coleções</span>
                        {categories.map(cat => (
                            <a key={cat.value} href={`/categoria/${cat.value}`} className="footer-link">
                                {cat.label}
                            </a>
                        ))}
                    </div>

                    {/* Atendimento */}
                    <div className="footer-col">
                        <span className="footer-heading">Atendimento</span>
                        {[
                            { label: 'WhatsApp', href: 'https://wa.me/5511999999999' },
                            { label: 'Dúvidas Frequentes', href: '#' },
                            { label: 'Trocas e Devoluções', href: '#' },
                            { label: 'Rastrear Pedido', href: '#' },
                        ].map(item => (
                            <a key={item.label} href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="footer-link">
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Informações */}
                    <div className="footer-col">
                        <span className="footer-heading">Informações</span>
                        {[
                            { label: 'Sobre Nós', href: '#' },
                            { label: 'Política de Privacidade', href: '#' },
                            { label: 'Termos de Uso', href: '#' },
                        ].map(item => (
                            <a key={item.label} href={item.href} className="footer-link">
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Redes Sociais */}
                    <div className="footer-col">
                        <span className="footer-heading">Redes Sociais</span>
                        {[
                            { label: 'Instagram', href: 'https://www.instagram.com/revel.seven/', Icon: InstagramIcon },
                            { label: 'Facebook', href: '#', Icon: FacebookIcon },
                            { label: 'YouTube', href: '#', Icon: YoutubeIcon },
                            { label: 'WhatsApp', href: 'https://wa.me/5511999999999', Icon: MessageCircle },
                        ].map(({ label, href, Icon }) => (
                            <a key={label} href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="footer-link">
                                <Icon size={14} />
                                {label}
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
