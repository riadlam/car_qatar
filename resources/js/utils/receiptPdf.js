import { jsPDF } from 'jspdf';
import { formatMoney } from '../data/journeys';

const WINE = [91, 5, 32];
const INK = [15, 19, 25];
const MUTED = [110, 110, 118];
const LINE = [232, 230, 225];
const PAGE = [251, 248, 242];

function estimateBreakdown(total) {
    const t = Number(total) || 0;
    const tax = Math.round(t * 0.1525 * 100) / 100;
    const base = Math.round((t - tax) * 100) / 100;
    return { base, tax, total: t };
}

/**
 * Generate an AL MAJD-branded ride receipt PDF for a journey.
 * Returns { blob, url, filename, revoke }.
 */
export function buildReceiptPdf(journey) {
    const j = journey || {};
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    const contentW = pageW - margin * 2;
    let y = 48;

    const { base, tax, total } = estimateBreakdown(j.price);
    const currency = j.currency || 'US$';
    const issued = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Warm page wash
    doc.setFillColor(...PAGE);
    doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), 'F');

    // Wine header bar
    doc.setFillColor(...WINE);
    doc.rect(0, 0, pageW, 92, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AL MAJD', margin, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(240, 197, 210);
    doc.text('Premium chauffeur service', margin, 60);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('RECEIPT', pageW - margin, 42, { align: 'right' });
    doc.setFontSize(9);
    doc.setTextColor(240, 197, 210);
    doc.text(j.booking_number || '—', pageW - margin, 58, { align: 'right' });

    y = 120;

    // Meta row
    doc.setTextColor(...MUTED);
    doc.setFontSize(9);
    doc.text('ISSUED', margin, y);
    doc.text('STATUS', margin + contentW * 0.38, y);
    doc.text('SERVICE', margin + contentW * 0.66, y);

    y += 16;
    doc.setTextColor(...INK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(issued, margin, y);
    doc.text(j.status_label || 'Completed', margin + contentW * 0.38, y);
    doc.text(j.mode_label || 'Transfer', margin + contentW * 0.66, y);

    y += 28;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(1);
    doc.line(margin, y, pageW - margin, y);
    y += 28;

    // Journey section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text('Journey', margin, y);
    y += 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text('DATE & TIME', margin, y);
    y += 14;
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(`${j.date_label || '—'}  ·  ${j.time_label || ''}`, margin, y);
    y += 24;

    // A / B
    doc.setFillColor(...WINE);
    doc.circle(margin + 6, y - 3, 5, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text('PICKUP', margin + 18, y - 6);
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    const pickupLines = doc.splitTextToSize(j.pickup || '—', contentW - 24);
    doc.text(pickupLines, margin + 18, y + 8);
    y += 12 + pickupLines.length * 14;

    doc.setDrawColor(...WINE);
    doc.setLineWidth(1.2);
    doc.line(margin + 6, y - 8, margin + 6, y + 4);
    y += 12;

    doc.setFillColor(...WINE);
    doc.circle(margin + 6, y - 3, 5, 'F');
    doc.setFillColor(251, 248, 242);
    doc.circle(margin + 6, y - 3, 2.2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text('DROP-OFF', margin + 18, y - 6);
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    const dropLines = doc.splitTextToSize(j.dropoff || '—', contentW - 24);
    doc.text(dropLines, margin + 18, y + 8);
    y += 12 + dropLines.length * 14;

    if (j.flight) {
        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(...WINE);
        doc.text(`Flight  ·  ${j.flight}`, margin, y);
        y += 16;
    }

    y += 10;
    doc.setDrawColor(...LINE);
    doc.line(margin, y, pageW - margin, y);
    y += 26;

    // Passenger / vehicle
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text('PASSENGER', margin, y);
    doc.text('VEHICLE', margin + contentW * 0.5, y);
    y += 14;
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.setFont('helvetica', 'bold');
    doc.text(j.passenger_name || '—', margin, y);
    doc.text(j.vehicle || '—', margin + contentW * 0.5, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    if (j.for_guest) doc.text('Booked for a guest', margin, y);
    doc.text(j.vehicle_similar || '', margin + contentW * 0.5, y);

    y += 28;
    doc.setDrawColor(...LINE);
    doc.line(margin, y, pageW - margin, y);
    y += 26;

    // Charges
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text('Charges', margin, y);
    y += 22;

    const row = (label, value, bold = false) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(bold ? 12 : 10);
        doc.setTextColor(...INK);
        doc.text(label, margin, y);
        doc.text(value, pageW - margin, y, { align: 'right' });
        y += bold ? 20 : 18;
    };

    row('Base fare', formatMoney(base, currency));
    row('Taxes & fees', formatMoney(tax, currency));

    y += 4;
    doc.setDrawColor(...LINE);
    doc.line(margin, y, pageW - margin, y);
    y += 20;

    // Total pill
    doc.setFillColor(...WINE);
    doc.roundedRect(margin, y - 6, contentW, 40, 8, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total charged', margin + 16, y + 18);
    doc.setFontSize(16);
    doc.text(formatMoney(total, currency), pageW - margin - 16, y + 18, { align: 'right' });
    y += 56;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text('Payment', margin, y);
    y += 14;
    doc.setTextColor(...INK);
    doc.text(j.payment_label || 'Card on file', margin, y);

    if (j.chauffeur?.name) {
        y += 28;
        doc.setFontSize(10);
        doc.setTextColor(...MUTED);
        doc.text('Chauffeur', margin, y);
        y += 14;
        doc.setTextColor(...INK);
        doc.text(
            `${j.chauffeur.name}  ·  ★ ${j.chauffeur.rating}  ·  ${j.chauffeur.vehicle_plate || ''}`,
            margin,
            y,
        );
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 48;
    doc.setDrawColor(...LINE);
    doc.line(margin, footerY - 16, pageW - margin, footerY - 16);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text('Thank you for riding with AL MAJD.', margin, footerY);
    doc.text('This is a demo receipt for preview purposes.', margin, footerY + 12);
    doc.text(j.booking_number || '', pageW - margin, footerY, { align: 'right' });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const filename = `AL-MAJD-Receipt-${(j.booking_number || 'ride').replace(/\s+/g, '-')}.pdf`;

    return {
        blob,
        url,
        filename,
        revoke: () => URL.revokeObjectURL(url),
    };
}
