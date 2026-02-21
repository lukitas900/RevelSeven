'use client';
import React from 'react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCategories } from '@/lib/hooks';

const colStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};

const headingStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '4px',
    letterSpacing: '0.02em',
};

const linkStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.38)',
    fontSize: '13px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.2s',
};

export default function Footer() {
    const { categories } = useCategories();
    return (
        <footer style={{
            width: '100%',
            background: '#050505',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '56px',
            paddingBottom: '48px',
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '0 32px',
            }}>

                {/* Logo + copyright */}
                <div style={{ marginBottom: '48px' }}>
                    <a href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        marginBottom: '10px',
                    }}>
                        <ShoppingBag size={18} color="#a855f7" />
                        <span style={{ color: '#fff', fontSize: '17px', fontWeight: 900, letterSpacing: '-0.04em' }}>
                            REVEL<span style={{ color: '#a855f7' }}>SEVEN</span>
                        </span>
                    </a>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', margin: 0 }}>
                        © {new Date().getFullYear()} Revel Seven. Todos os direitos reservados.
                    </p>
                </div>

                {/* 4 colunas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '40px',
                }}>

                    {/* Coleções */}
                    <div style={colStyle}>
                        <span style={headingStyle}>Coleções</span>
                        {categories.map(cat => ({ label: cat.label, href: `/categoria/${cat.value}` })).map(item => (
                            <a key={item.label} href={item.href} style={linkStyle}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Atendimento */}
                    <div style={colStyle}>
                        <span style={headingStyle}>Atendimento</span>
                        {[
                            { label: 'WhatsApp', href: 'https://wa.me/5511999999999' },
                            { label: 'Dúvidas Frequentes', href: '#' },
                            { label: 'Trocas e Devoluções', href: '#' },
                            { label: 'Rastrear Pedido', href: '#' },
                        ].map(item => (
                            <a key={item.label} href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                style={linkStyle}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Informações */}
                    <div style={colStyle}>
                        <span style={headingStyle}>Informações</span>
                        {[
                            { label: 'Sobre Nós', href: '#' },
                            { label: 'Política de Privacidade', href: '#' },
                            { label: 'Termos de Uso', href: '#' },
                        ].map(item => (
                            <a key={item.label} href={item.href} style={linkStyle}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Redes Sociais */}
                    <div style={colStyle}>
                        <span style={headingStyle}>Redes Sociais</span>
                        {[
                            { label: 'Instagram', href: 'https://www.instagram.com/revel.seven/', Icon: InstagramIcon },
                            { label: 'Facebook', href: '#', Icon: FacebookIcon },
                            { label: 'YouTube', href: '#', Icon: YoutubeIcon },
                            { label: 'WhatsApp', href: 'https://wa.me/5511999999999', Icon: MessageCircle },
                        ].map(({ label, href, Icon }) => (
                            <a key={label} href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                style={linkStyle}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
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
