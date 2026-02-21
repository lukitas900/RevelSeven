'use client';
import React from 'react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, MessageCircle, ShoppingBag } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-[#050505] border-t border-white/[0.06] pt-14 pb-10">
            <div className="container mx-auto px-8 max-w-6xl">

                {/* Top: Logo + Copyright */}
                <div className="mb-12">
                    <a href="/" className="text-xl font-black tracking-tighter text-white flex items-center gap-2 mb-3">
                        <ShoppingBag className="size-5 text-purple-500" />
                        REVEL<span className="text-purple-500">SEVEN</span>
                    </a>
                    <p className="text-white/30 text-sm">
                        © {new Date().getFullYear()} Revel Seven. Todos os direitos reservados.
                    </p>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

                    {/* Coleções */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5">Coleções</h4>
                        <ul className="space-y-3">
                            {['Camisetas', 'Bermudas', 'Calças', 'Conjuntos', 'Jaquetas'].map((item) => (
                                <li key={item}>
                                    <a href="#products" className="text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Atendimento */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5">Atendimento</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'WhatsApp', href: 'https://wa.me/5511999999999' },
                                { label: 'Dúvidas Frequentes', href: '#' },
                                { label: 'Trocas e Devoluções', href: '#' },
                                { label: 'Rastrear Pedido', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        target={item.href.startsWith('http') ? '_blank' : undefined}
                                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informações */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5">Informações</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Sobre Nós', href: '#' },
                                { label: 'Política de Privacidade', href: '#' },
                                { label: 'Termos de Uso', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Redes Sociais */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5">Redes Sociais</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Instagram', href: 'https://www.instagram.com/revel.seven/', icon: InstagramIcon },
                                { label: 'Facebook', href: '#', icon: FacebookIcon },
                                { label: 'YouTube', href: '#', icon: YoutubeIcon },
                                { label: 'WhatsApp', href: 'https://wa.me/5511999999999', icon: MessageCircle },
                            ].map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        target={href.startsWith('http') ? '_blank' : undefined}
                                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-white/40 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <Icon className="size-4" />
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
}
