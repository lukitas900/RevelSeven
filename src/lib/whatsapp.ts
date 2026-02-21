import { CartItem } from './types';
import { supabase } from './supabase';

const WHATSAPP_NUMBER = '557588850574';

function generateOrderCode(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `PED-${num}`;
}

function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export async function sendWhatsAppOrder(
    items: CartItem[],
    customerName: string
): Promise<string> {
    const orderCode = generateOrderCode();

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.product.price,
        image_url: item.product.image_url,
    }));

    // Save order to Supabase
    try {
        await supabase.from('orders').insert({
            order_code: orderCode,
            items: orderItems,
            total,
            customer_name: customerName || null,
            status: 'pendente',
        });
    } catch (error) {
        console.error('Error saving order:', error);
    }

    // Build WhatsApp message
    let message = `Olá! Tenho interesse nos seguintes produtos:\n\n`;

    items.forEach((item) => {
        message += `- ${item.product.name} - Tam. ${item.size} - ${item.quantity} un\n`;
    });

    if (customerName) {
        message += `\nNome: ${customerName}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    return orderCode;
}
