import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/557588850574"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Contato via WhatsApp"
            title="Fale conosco pelo WhatsApp"
        >
            <MessageCircle size={24} />
        </a>
    );
}
