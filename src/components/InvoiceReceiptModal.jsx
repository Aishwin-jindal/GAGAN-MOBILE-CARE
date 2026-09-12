import React, { useRef } from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

// Helper function to convert Indian number to words
function numberToWordsINR(amount) {
  const num = Math.floor(amount);
  if (num === 0) return 'Zero Rupees';

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

  const rawSubtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = order.discount || 0;
  const finalTotal = order.total ?? Math.max(0, rawSubtotal - discount);

  // Approximate 18% GST calculation
  const taxableValue = Math.round(finalTotal / 1.18);
  const totalGst = finalTotal - taxableValue;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  // 1. Guaranteed Clean 1-Page Print via Isolated Iframe
  const handlePrint = () => {
    const invoiceEl = document.getElementById('printable-tax-invoice');
    if (!invoiceEl) {
      window.print();
      return;
    }

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
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GMC_Invoice_${order.id}</title>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff !important;
            color: #111827 !important;
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 12px;
            page-break-inside: avoid;
            page-break-after: avoid;
            page-break-before: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${invoiceEl.innerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1500);
    }, 400);
  };

  // 2. Direct HTML / PDF Download
  const handleDownload = () => {
    const invoiceEl = document.getElementById('printable-tax-invoice');
    if (!invoiceEl) return;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GMC_Invoice_${order.id}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4 portrait; margin: 8mm 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 20px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="invoice-card">
    ${invoiceEl.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GMC_Invoice_${order.id}.html`;
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

        {/* Printable Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#050b14]">
          <div
            ref={receiptRef}
            id="printable-tax-invoice"
            className="mx-auto max-w-xl bg-[#ffffff] text-[#111827] rounded-xl p-4 sm:p-5 shadow-2xl font-sans border border-gray-200"
          >
            {/* Store Branding Header (Compact 1-Page Layout) */}
            <div className="flex items-start justify-between border-b-2 border-gray-900 pb-3 gap-2">
              <div className="flex items-start gap-2.5">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-amber-500 shadow-sm">
                  <img
                    src="/gmc_logo.jpg"
                    alt="GMC Logo"
                    className="h-full w-full object-cover"
                  />
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
                    Official Smartphone Retail, Accessories & Repairs
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
                <span className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-gray-800 border border-gray-300">
                  TAX INVOICE / BILL
                </span>
                <div className="mt-1 text-[10px]">
                  <span className="text-gray-500 font-medium">Inv #: </span>
                  <span className="font-mono font-bold text-gray-900">
                    GMC/INV/{order.id.replace('GMC-', '')}
                  </span>
                </div>
                <div className="text-[10px]">
                  <span className="text-gray-500 font-medium">Date: </span>
                  <span className="font-semibold text-gray-900">
                    {order.date || 'Today'}
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
                  Mob: <span className="font-mono font-semibold">{order.customerPhone || '+91 98765 43210'}</span>
                </div>
                <div className="text-gray-600 truncate">
                  Address: {order.deliveryAddress || order.shippingAddress || 'Store Pickup - Counter #1'}
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold uppercase text-gray-500 text-[9px]">
                  Payment & Fulfillment:
                </span>
                <div className="text-gray-800 truncate">
                  Mode: <strong className="text-gray-900">{order.paymentMethod || 'Pay on Delivery'}</strong>
                </div>
                <div className="text-gray-800">
                  Status: <strong className="text-emerald-700">✓ {order.status || 'Confirmed'}</strong>
                </div>
                <div className="text-gray-600 truncate">
                  Ref: <span className="font-mono font-semibold">{order.trackingNumber || 'GMC-EXP-293926'}</span>
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
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 px-1.5 font-mono text-gray-500">{idx + 1}</td>
                      <td className="py-1.5 px-1.5">
                        <div className="font-bold text-gray-900 text-[11px] leading-tight">{item.name}</div>
                        <div className="text-[9px] text-gray-500 leading-none mt-0.5">
                          Brand: <span className="uppercase font-semibold">{item.brand || 'GMC'}</span> • HSN: 85171300
                        </div>
                      </td>
                      <td className="py-1.5 px-1.5 text-center font-mono font-semibold text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="py-1.5 px-1.5 text-right font-mono text-gray-700">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-1.5 px-1.5 text-right font-mono font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
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
                    <div>• 1 Year Brand Warranty + 1 Year GMC Damage Care</div>
                    <div>• 7-Day Replacement guarantee against factory defect</div>
                    <div>• GST Invoice eligible for corporate input tax credit</div>
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
                    <span className="font-mono">₹{taxableValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
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
                <div className="text-[8px] text-gray-400">Subject to Delhi Jurisdiction</div>
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
