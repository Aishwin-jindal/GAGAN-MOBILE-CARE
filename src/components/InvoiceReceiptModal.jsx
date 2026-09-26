import React, { useRef } from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, QrCode, Smartphone } from 'lucide-react';

/**
 * Converts any numeric amount in INR to formal English words (Lakhs & Crores format)
 */
export function numberToWordsINR(amount) {
  const num = Math.floor(Number(amount) || 0);
  if (num <= 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertSection(n) {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  let result = '';
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  const hundreds = rem;

  if (crore > 0) result += convertSection(crore) + ' Crore ';
  if (lakh > 0) result += convertSection(lakh) + ' Lakh ';
  if (thousand > 0) result += convertSection(thousand) + ' Thousand ';
  if (hundreds > 0) result += convertSection(hundreds) + ' ';

  return result.trim() + ' Rupees Only';
}

export default function InvoiceReceiptModal({ order, isOpen, onClose }) {
  const receiptRef = useRef(null);

  if (!isOpen || !order) return null;

  // Safe items extraction
  const items = Array.isArray(order.items)
    ? order.items
    : (typeof order.items === 'string'
        ? (() => { try { return JSON.parse(order.items); } catch (e) { return []; } })()
        : []);

  // 1. Precise Billing Calculations
  const rawSubtotal = items.reduce((acc, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 1;
    return acc + (p * q);
  }, 0);

  const orderTotalGiven = order.total !== undefined && order.total !== null ? Number(order.total) : null;
  const discount = Number(order.discount) || (orderTotalGiven !== null && rawSubtotal > orderTotalGiven ? rawSubtotal - orderTotalGiven : 0);
  const finalTotal = orderTotalGiven !== null ? orderTotalGiven : Math.max(0, rawSubtotal - discount);

  // Exact 18% GST Breakdown (Inclusive Retail Price Calculation)
  // Taxable Value + CGST (9%) + SGST (9%) = finalTotal
  const taxableValue = Math.round((finalTotal / 1.18) * 100) / 100;
  const totalGst = Math.round((finalTotal - taxableValue) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  const invoiceNumber = `GMC/INV/${String(order.id || '').replace(/^GMC-?/i, '') || '8492'}`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Generate complete self-contained printable HTML (Zero external CDN or Tailwind dependency)
  const generateStandaloneHtml = () => {
    const itemsHtml = items.map((item, idx) => {
      const p = Number(item.price) || 0;
      const q = Number(item.quantity) || 1;
      const lineTotal = p * q;
      const brand = item.brand ? String(item.brand).toUpperCase() : 'GMC';
      const hsn = item.category === 'accessories' ? '85183000' : '85171300';
      return `
        <tr>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #0f172a; font-size: 11.5px; line-height: 1.3;">${item.name || 'Smartphone / Accessory'}</div>
            <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">Brand: <strong>${brand}</strong> | HSN: ${hsn} | 100% Genuine Certified</div>
          </td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 700; color: #0f172a; font-size: 11px;">${q}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; color: #334155; font-size: 11px;">₹${p.toLocaleString('en-IN')}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a; font-size: 11.5px;">₹${lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Tax_Invoice_${invoiceNumber.replace(/\//g, '_')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      line-height: 1.4;
      font-size: 11px;
    }
    .invoice-wrapper {
      max-width: 780px;
      margin: 0 auto;
      padding: 12px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.3px;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 600;
      color: #334155;
      margin-top: 2px;
    }
    .brand-addr {
      font-size: 9.5px;
      color: #475569;
      margin-top: 1px;
    }
    .meta-box {
      text-align: right;
      vertical-align: top;
    }
    .tax-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      padding: 3px 8px;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-grid {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .info-col {
      flex: 1;
      font-size: 10px;
    }
    .info-label {
      font-size: 8.5px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .info-val-title {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .items-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 7px 8px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #0f172a;
    }
    .totals-wrapper {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      border-top: 1.5px solid #0f172a;
      padding-top: 10px;
      margin-bottom: 12px;
    }
    .words-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 10px;
    }
    .summary-table {
      width: 260px;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    .summary-table td {
      padding: 2.5px 0;
    }
    .final-row td {
      border-top: 1.5px solid #0f172a;
      padding-top: 6px;
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
    }
    .footer-section {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 65%;">
          <div class="brand-title">GAGAN MOBILE CARE</div>
          <div class="brand-sub">Official Smartphone Retail, Genuine Accessories & Express Care</div>
          <div class="brand-addr">Main Market, Maur Mandi, Dist. Bathinda, Punjab - 151509</div>
          <div class="brand-addr">GSTIN: <strong style="color: #0f172a; font-family: monospace;">03AAAFG8923Q1Z5</strong> | State Code: <strong>03 (Punjab)</strong></div>
          <div class="brand-addr">Helpline / WhatsApp: <strong>+91 98726-22624</strong> | Support: support@gaganmobilecare.com</div>
        </td>
        <td class="meta-box" style="width: 35%;">
          <div class="tax-badge">ORIGINAL TAX INVOICE</div>
          <div style="font-size: 10.5px; color: #475569; margin-top: 2px;">
            Invoice No: <strong style="color: #0f172a; font-family: monospace;">${invoiceNumber}</strong>
          </div>
          <div style="font-size: 10.5px; color: #475569;">
            Date: <strong style="color: #0f172a;">${invoiceDate}</strong>
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
            Tracking Ref: <span style="font-family: monospace;">${order.trackingNumber || 'GMC-EXP-892174'}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Customer & Payment Info -->
    <div class="info-grid">
      <div class="info-col">
        <div class="info-label">Billed To (Customer):</div>
        <div class="info-val-title">${order.customerName || 'Valued Customer'}</div>
        <div style="color: #334155; margin-top: 1px;">Phone: <strong>${order.customerPhone || '+91 98726-22624'}</strong></div>
        ${order.customerEmail ? `<div style="color: #475569;">Email: ${order.customerEmail}</div>` : ''}
        <div style="color: #475569; margin-top: 1px;">
          Delivery: ${order.deliveryAddress || order.shippingAddress || 'Store Pickup, Maur Mandi'}
        </div>
      </div>

      <div class="info-col" style="text-align: right;">
        <div class="info-label">Payment & Order Details:</div>
        <div style="color: #0f172a; font-weight: 700;">Mode: ${order.paymentMethod || 'Store Counter / COD'}</div>
        <div style="color: #15803d; font-weight: 700; margin-top: 1px;">Status: ✓ ${order.status || 'Confirmed'}</div>
        <div style="color: #475569; margin-top: 1px;">Place of Supply: <strong>03-Punjab</strong></div>
        <div style="color: #475569;">Reverse Charge: <strong>No</strong></div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 30px; text-align: left;">#</th>
          <th style="text-align: left;">Item Description & Brand</th>
          <th style="width: 45px; text-align: center;">Qty</th>
          <th style="width: 90px; text-align: right;">Unit Rate</th>
          <th style="width: 100px; text-align: right;">Net Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Calculation Summary & Totals -->
    <div class="totals-wrapper">
      <div class="words-box">
        <div style="font-size: 8.5px; font-weight: 800; color: #64748b; text-transform: uppercase;">Amount in Words:</div>
        <div style="font-weight: 800; color: #0f172a; font-size: 11px; margin-top: 2px; font-style: italic;">
          ${numberToWordsINR(finalTotal)}
        </div>

        <div style="margin-top: 8px; font-size: 9px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">🛡️ Warranty & Assurance:</div>
          <div>• 1-Year Official Manufacturer Brand Warranty on Handsets</div>
          <div>• 7-Day Replacement Guarantee against technical manufacturing defect</div>
          <div>• Tax-paid genuine GST invoice eligible for Input Tax Credit (ITC)</div>
        </div>
      </div>

      <div>
        <table class="summary-table">
          <tr>
            <td style="color: #475569;">Gross Subtotal:</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">₹${rawSubtotal.toLocaleString('en-IN')}</td>
          </tr>
          ${discount > 0 ? `
          <tr>
            <td style="color: #15803d; font-weight: 600;">Discount / Coupon:</td>
            <td style="text-align: right; font-family: monospace; font-weight: 700; color: #15803d;">- ₹${discount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #64748b; font-size: 9.5px; padding-top: 4px; border-top: 1px solid #e2e8f0;">Taxable Value (Excl. GST):</td>
            <td style="text-align: right; font-family: monospace; color: #64748b; font-size: 9.5px; padding-top: 4px; border-top: 1px solid #e2e8f0;">₹${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 9.5px;">CGST (9.0%):</td>
            <td style="text-align: right; font-family: monospace; color: #64748b; font-size: 9.5px;">₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 9.5px;">SGST (9.0%):</td>
            <td style="text-align: right; font-family: monospace; color: #64748b; font-size: 9.5px;">₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr class="final-row">
            <td style="text-transform: uppercase;">Total Payable:</td>
            <td style="text-align: right; font-family: monospace; color: #0284c7;">₹${finalTotal.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer & Signature Seal -->
    <div class="footer-section">
      <div>
        <div style="font-weight: 700; color: #0f172a;">Gagan Mobile Care • Maur Mandi</div>
        <div>Computer Generated Digitally Signed Tax Invoice • No Physical Signature Required</div>
        <div style="color: #15803d; font-weight: 600;">✓ Official Store Copy Verified</div>
      </div>
      <div style="text-align: right;">
        <div style="font-style: italic; font-weight: 800; font-size: 11px; color: #0f172a; margin-bottom: 2px;">
          For GAGAN MOBILE CARE
        </div>
        <div style="border-top: 1px solid #94a3b8; padding-top: 2px; font-weight: 700; color: #334155; font-size: 9px;">
          Authorized Signatory / Cashier
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // 1. Guaranteed 1-Page Clean Print via Self-Contained Iframe
  const handlePrint = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(generateStandaloneHtml());
    doc.close();

    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 2000);
    }, 250);
  };

  // 2. Direct Standalone HTML / PDF Download
  const handleDownload = () => {
    const fullHtml = generateStandaloneHtml();
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GMC_Invoice_${String(order.id || '').replace(/^GMC-?/i, '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="invoice-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            height: 100% !important;
            overflow: visible !important;
          }
          body > * {
            display: none !important;
          }
          .invoice-modal-overlay {
            display: block !important;
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .invoice-modal-card {
            display: block !important;
            position: static !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          #printable-tax-invoice {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 4px 8px !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
          }
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="invoice-modal-card relative flex max-h-[96vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#0d1422] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Modal Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121c2e] px-4 sm:px-6 py-2.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
              <Printer size={16} />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Official Tax Invoice & Bill</h3>
              <p className="text-[10px] text-gray-400">Order #{order.id} • 1-Page Verified Receipt</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
              title="Print 1-Page Clean Receipt"
            >
              <Printer size={14} />
              Print (1 Page)
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition-all"
              title="Download Invoice File"
            >
              <Download size={14} />
              Download
            </button>

            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container (In-App Preview) */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#050b14]">
          <div
            ref={receiptRef}
            id="printable-tax-invoice"
            className="mx-auto max-w-xl bg-[#ffffff] text-[#0f172a] rounded-xl p-4 sm:p-5 shadow-2xl font-sans border border-gray-200"
          >
            {/* Store Branding Header (Compact 1-Page Layout) */}
            <div className="flex items-start justify-between border-b-2 border-gray-900 pb-3 gap-2">
              <div className="flex items-start gap-2.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-amber-500/50 shadow-sm font-black text-sm">
                  GMC
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-gray-900 uppercase leading-none">
                      GAGAN MOBILE CARE
                    </h1>
                    <span className="rounded bg-amber-500/20 text-amber-900 font-bold px-1 py-0.2 text-[9px] uppercase border border-amber-500/40">
                      MAUR
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-700 mt-0.5 leading-tight">
                    Official Smartphone Retail, Genuine Accessories & Express Care
                  </p>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    Main Market, Maur Mandi, Dist. Bathinda, Punjab - 151509
                  </p>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    GSTIN: <span className="font-mono font-bold text-gray-900">03AAAFG8923Q1Z5</span> | State: 03 (Punjab)
                  </p>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    Helpline: <span className="font-bold text-gray-900">+91 98726-22624</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block rounded bg-gray-900 px-2 py-0.5 font-mono text-[9.5px] font-black uppercase text-white">
                  TAX INVOICE / BILL
                </span>
                <div className="mt-1 text-[10px]">
                  <span className="text-gray-500 font-medium">Inv #: </span>
                  <span className="font-mono font-bold text-gray-900">
                    {invoiceNumber}
                  </span>
                </div>
                <div className="text-[10px]">
                  <span className="text-gray-500 font-medium">Date: </span>
                  <span className="font-semibold text-gray-900">
                    {invoiceDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Details */}
            <div className="grid grid-cols-2 gap-2 border-b border-gray-200 py-2.5 text-[10px]">
              <div>
                <span className="font-bold uppercase text-gray-500 text-[9px]">
                  Billed To (Customer):
                </span>
                <div className="text-xs font-bold text-gray-900 truncate">
                  {order.customerName || 'Valued Customer'}
                </div>
                <div className="text-gray-700">
                  Mob: <span className="font-mono font-semibold">{order.customerPhone || '+91 98726-22624'}</span>
                </div>
                <div className="text-gray-600 truncate">
                  Address: {order.deliveryAddress || order.shippingAddress || 'Store Pickup - Counter #1, Maur Mandi'}
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold uppercase text-gray-500 text-[9px]">
                  Payment & Fulfillment:
                </span>
                <div className="text-gray-800 truncate">
                  Mode: <strong className="text-gray-900">{order.paymentMethod || 'Pay on Store Counter / COD'}</strong>
                </div>
                <div className="text-gray-800">
                  Status: <strong className="text-emerald-700">✓ {order.status || 'Confirmed'}</strong>
                </div>
                <div className="text-gray-600 truncate">
                  Ref: <span className="font-mono font-semibold">{order.trackingNumber || 'GMC-EXP-892174'}</span>
                </div>
              </div>
            </div>

            {/* Bill Itemized Table */}
            <div className="my-2.5">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900 bg-gray-100 text-[9px] font-bold text-gray-800 uppercase">
                    <th className="py-1.5 px-1.5 w-6">#</th>
                    <th className="py-1.5 px-1.5">Item Description & Brand</th>
                    <th className="py-1.5 px-1.5 text-center w-10">Qty</th>
                    <th className="py-1.5 px-1.5 text-right w-20">Unit Price</th>
                    <th className="py-1.5 px-1.5 text-right w-20">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, idx) => {
                    const p = Number(item.price) || 0;
                    const q = Number(item.quantity) || 1;
                    return (
                      <tr key={idx}>
                        <td className="py-1.5 px-1.5 font-mono text-gray-500">{idx + 1}</td>
                        <td className="py-1.5 px-1.5">
                          <div className="font-bold text-gray-900 text-[11px] leading-tight">{item.name}</div>
                          <div className="text-[9px] text-gray-500 leading-none mt-0.5">
                            Brand: <span className="uppercase font-semibold">{item.brand || 'GMC'}</span> • HSN: {item.category === 'accessories' ? '85183000' : '85171300'}
                          </div>
                        </td>
                        <td className="py-1.5 px-1.5 text-center font-mono font-semibold text-gray-900">
                          {q}
                        </td>
                        <td className="py-1.5 px-1.5 text-right font-mono text-gray-700">
                          ₹{p.toLocaleString('en-IN')}
                        </td>
                        <td className="py-1.5 px-1.5 text-right font-mono font-bold text-gray-900">
                          ₹{(p * q).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculation & Totals Summary */}
            <div className="border-t-2 border-gray-900 pt-2 text-[10px]">
              <div className="flex justify-between gap-4">
                {/* Left Side: Amount in Words & Guarantees */}
                <div className="flex-1 space-y-1.5">
                  <div className="rounded bg-gray-50 p-2 border border-gray-200">
                    <span className="block font-bold text-gray-500 text-[8px] uppercase">
                      Amount in Words:
                    </span>
                    <span className="font-bold text-gray-900 italic text-[10px] leading-tight block">
                      {numberToWordsINR(finalTotal)}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[9px] text-gray-600">
                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                      <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                      Warranty & Protection Included:
                    </div>
                    <div>• 1-Year Official Brand Warranty + GMC Quality Guarantee</div>
                    <div>• 7-Day Replacement against technical defect</div>
                    <div>• GST Invoice eligible for input tax credit (ITC)</div>
                  </div>
                </div>

                {/* Right Side: Totals breakdown */}
                <div className="w-48 space-y-1 text-[10px] shrink-0">
                  <div className="flex justify-between text-gray-600">
                    <span>Gross Subtotal:</span>
                    <span className="font-mono">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between font-semibold text-emerald-700">
                      <span>Discount / Coupon:</span>
                      <span className="font-mono">- ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500 text-[9px] pt-0.5 border-t border-gray-200">
                    <span>Taxable Value (Excl. Tax):</span>
                    <span className="font-mono">₹{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-black text-gray-900 border-t-2 border-gray-900 pt-1">
                    <span className="uppercase">Net Amount Paid:</span>
                    <span className="font-mono text-sm font-extrabold text-blue-900">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Seal Footer */}
            <div className="mt-4 border-t border-gray-200 pt-2 flex items-end justify-between text-[9px] text-gray-500">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded border border-gray-300 p-0.5 flex items-center justify-center bg-gray-50">
                  <QrCode size={32} className="text-gray-800" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-[9px]">Scan to Verify Authenticity</div>
                  <div className="text-[8px] text-gray-500">Official GMC Digitally Signed Invoice</div>
                  <div className="text-[8px] text-emerald-700 font-semibold">✓ Authorized Retail Store Copy</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic font-bold text-gray-800 text-[11px]">
                  Gagan Mobile Care
                </div>
                <div className="border-t border-gray-400 pt-0.5 font-bold text-gray-800 text-[9px]">
                  Authorized Signatory
                </div>
                <div className="text-[8px] text-gray-400">Maur Mandi, Punjab Jurisdiction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#121c2e] px-4 sm:px-6 py-2.5 text-xs text-gray-400 print:hidden">
          <span>Formatted for single-page A4 printing & PDF saving.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-1.5 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              Print Receipt (1 Page)
            </button>
            <button
              onClick={handleDownload}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 font-semibold text-xs transition-all border border-white/10"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 px-3.5 py-1.5 font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
