import { getGlobalRepo } from '../data/repo';
import { formatCurrency, formatDateShort, formatDate } from '../utils/format';
function navigateTo(path) {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
}
export function createInvoicesPage() {
    const page = document.createElement('div');
    page.className = 'page page-invoices';
    const repo = getGlobalRepo();
    // Get all invoices from the repo
    const invoices = repo.getAllInvoices?.() || [];
    let tableHtml = '';
    if (invoices.length === 0) {
        tableHtml = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem;">
          No invoices found
        </td>
      </tr>
    `;
    }
    else {
        tableHtml = invoices
            .map((inv) => `
      <tr>
        <td>${inv.id}</td>
        <td>${formatDateShort(inv.date)}</td>
        <td>${inv.recipient?.name || 'Unknown'}</td>
        <td>${formatCurrency(inv.totalAmount)}</td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-primary" data-action="view" data-id="${inv.id}">View</button>
          <button class="btn btn-sm btn-success" data-action="edit" data-id="${inv.id}">Edit</button>
          <button class="btn btn-sm btn-danger" data-action="delete" data-id="${inv.id}">Delete</button>
        </td>
      </tr>
    `)
            .join('');
    }
    page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1>Invoices</h1>
        <p>Browse and manage all invoices</p>
      </div>
      
      <div class="page-content">
        <table class="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Recipient</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
    // Add action button handlers
    const actionButtons = page.querySelectorAll('[data-action]');
    actionButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;
            const action = target.getAttribute('data-action');
            const invoiceId = target.getAttribute('data-id');
            if (invoiceId) {
                switch (action) {
                    case 'view':
                        navigateTo(`/invoices/${invoiceId}/view`);
                        break;
                    case 'edit':
                        navigateTo(`/invoices/${invoiceId}/edit`);
                        break;
                    case 'delete':
                        if (confirm(`Delete invoice ${invoiceId}?`)) {
                            repo.deleteInvoice(invoiceId);
                            alert(`Invoice ${invoiceId} deleted successfully!`);
                            navigateTo('/invoices');
                        }
                        break;
                }
            }
        });
    });
    return page;
}
export function createInvoiceViewPage(id) {
    const page = document.createElement('div');
    page.className = 'page page-invoice-view';
    const repo = getGlobalRepo();
    const invoice = repo.findInvoiceById?.(id);
    if (!invoice) {
        page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/invoices">← Back to Invoices</button>
          <h1>Invoice Not Found</h1>
        </div>
        <div class="page-content">
          <p>Invoice #${id} could not be found.</p>
        </div>
      </div>
    `;
        page.querySelector('[data-navigate]')?.addEventListener('click', () => {
            navigateTo('/invoices');
        });
        return page;
    }
    const recipient = invoice.recipient;
    const settings = repo.getSettings?.();
    // Use the invoice's own totals
    const subtotal = invoice.subtotalAmount || 0;
    const vat = invoice.vatAmount || 0;
    const total = invoice.totalAmount || 0;
    const itemsHtml = invoice.items
        ?.map((item) => `
      <tr>
        <td>${item.product}</td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">${item.unit}</td>
        <td class="text-right">${formatCurrency(item.price)}</td>
        <td class="text-right">${item.vatRate || 0}%</td>
        <td class="text-right">${formatCurrency(item.valueWithoutVat)}</td>
      </tr>
    `)
        .join('') || '';
    page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <button class="btn btn-secondary" data-navigate="/invoices">← Back to Invoices</button>
        <h1>Invoice #${id}</h1>
      </div>
      
      <div class="invoice-view-content">
        <div class="invoice-section">
          <h2 class="section-title">TO</h2>
          <div class="invoice-details">
            ${recipient ? `
              <p><span class="label">Company Name:</span> <span class="value">${recipient.name}</span></p>
              ${recipient.id ? `<p><span class="label">Company ID:</span> <span class="value">${recipient.id}</span></p>` : ''}
              ${recipient.taxId ? `<p><span class="label">Tax ID:</span> <span class="value">${recipient.taxId}</span></p>` : ''}
              ${recipient.address ? `<p><span class="label">Address:</span> <span class="value">${recipient.address}</span></p>` : ''}
              ${recipient.manager ? `<p><span class="label">Manager:</span> <span class="value">${recipient.manager}</span></p>` : ''}
            ` : '<p>Recipient information not available</p>'}
          </div>
        </div>
        
        <div class="invoice-section">
          <div class="invoice-meta">
            <div class="meta-item">
              <span class="label">Invoice Date:</span>
              <span class="value">${formatDate(invoice.date)}</span>
            </div>
            <div class="meta-item">
              <span class="label">Invoice ID:</span>
              <span class="value">${invoice.id}</span>
            </div>
          </div>
        </div>
        
        <div class="invoice-section">
          <h2 class="section-title">ITEMS</h2>
          <table class="invoice-items-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>QUANTITY</th>
                <th>UNIT</th>
                <th>UNIT PRICE</th>
                <th>VAT RATE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
        
        <div class="invoice-section">
          <div class="invoice-totals">
            <div class="total-row">
              <span class="label">Subtotal:</span>
              <span class="value">${formatCurrency(subtotal)}</span>
            </div>
            <div class="total-row">
              <span class="label">VAT (${settings?.defaultVatRate || 20}%):</span>
              <span class="value">${formatCurrency(vat)}</span>
            </div>
            <div class="total-row total-amount">
              <span class="label">Total:</span>
              <span class="value">${formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    page.querySelector('[data-navigate]')?.addEventListener('click', () => {
        navigateTo('/invoices');
    });
    return page;
}
export function createInvoiceEditPage(id) {
    const page = document.createElement('div');
    page.className = 'page page-invoice-edit';
    const repo = getGlobalRepo();
    const invoice = repo.findInvoiceById?.(id);
    if (!invoice) {
        page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/invoices">← Back to Invoices</button>
          <h1>Invoice Not Found</h1>
        </div>
        <div class="page-content">
          <p>The requested invoice could not be found.</p>
        </div>
      </div>
    `;
        page.querySelector('[data-navigate]')?.addEventListener('click', () => {
            navigateTo('/invoices');
        });
        return page;
    }
    const itemsHtml = invoice.items
        ?.map((item, index) => `
      <div class="invoice-item-row" data-index="${index}">
        <div class="form-group">
          <label for="product-${index}">Product/Service</label>
          <input type="text" id="product-${index}" name="product-${index}" value="${item.product}" required>
        </div>
        <div class="form-group">
          <label for="quantity-${index}">Quantity</label>
          <input type="number" id="quantity-${index}" name="quantity-${index}" value="${item.quantity}" min="1" required>
        </div>
        <div class="form-group">
          <label for="unit-${index}">Unit</label>
          <select id="unit-${index}" name="unit-${index}">
            <option value="pcs" ${item.unit === 'pcs' ? 'selected' : ''}>pcs</option>
            <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
            <option value="liters" ${item.unit === 'liters' ? 'selected' : ''}>liters</option>
            <option value="meters" ${item.unit === 'meters' ? 'selected' : ''}>meters</option>
          </select>
        </div>
        <div class="form-group">
          <label for="price-${index}">Unit Price</label>
          <input type="number" id="price-${index}" name="price-${index}" value="${item.price}" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="vatRate-${index}">VAT Rate (%)</label>
          <input type="number" id="vatRate-${index}" name="vatRate-${index}" value="${item.vatRate}" min="0" max="100" step="0.01" required>
        </div>
      </div>
    `)
        .join('') || '';
    page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <button class="btn btn-secondary" data-navigate="/invoices/${id}/view">← Back to Invoice</button>
        <h1>Edit Invoice #${id}</h1>
      </div>
      
      <div class="page-content">
        <form class="invoice-edit-form" data-invoice-id="${id}">
          <div class="form-section">
            <h3>Invoice Items</h3>
            <div id="items-container">
              ${itemsHtml}
            </div>
          </div>
          
          <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
          </div>
        </form>
        
        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
          <h3 style="color: #ef4444; margin-bottom: 1rem;">Danger Zone</h3>
          <button class="btn btn-danger" data-action="delete-invoice" data-id="${id}">Delete Invoice</button>
        </div>
      </div>
    </div>
  `;
    page.querySelector('[data-navigate]')?.addEventListener('click', () => {
        navigateTo(`/invoices/${id}/view`);
    });
    const form = page.querySelector('.invoice-edit-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Full invoice editing functionality will be implemented in a future version. For now, you can view and delete invoices.');
        navigateTo(`/invoices/${id}/view`);
    });
    page.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        navigateTo(`/invoices/${id}/view`);
    });
    page.querySelector('[data-action="delete-invoice"]')?.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete invoice ${id}? This action cannot be undone.`)) {
            repo.deleteInvoice(id);
            alert('Invoice deleted successfully!');
            navigateTo('/invoices');
        }
    });
    return page;
}
export function createInvoicePdfPage(id) {
    const page = document.createElement('div');
    page.className = 'page page-invoice-pdf';
    const repo = getGlobalRepo();
    const invoice = repo.findInvoiceById?.(id);
    if (!invoice) {
        page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/invoices">← Back to Invoices</button>
          <h1>Invoice Not Found</h1>
        </div>
        <div class="page-content">
          <p>The requested invoice could not be found.</p>
        </div>
      </div>
    `;
        page.querySelector('[data-navigate]')?.addEventListener('click', () => {
            navigateTo('/invoices');
        });
        return page;
    }
    const issuer = invoice.issuer;
    const recipient = invoice.recipient;
    const subtotal = invoice.subtotalAmount || 0;
    const vat = invoice.vatAmount || 0;
    const total = invoice.totalAmount || 0;
    const itemsHtml = invoice.items
        ?.map((item) => `
      <tr>
        <td>${item.product}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: center;">${item.unit}</td>
        <td style="text-align: right;">${formatCurrency(item.price)}</td>
        <td style="text-align: right;">${item.vatRate}%</td>
        <td style="text-align: right;">${formatCurrency(item.valueWithoutVat)}</td>
      </tr>
    `)
        .join('') || '';
    const pdfContent = `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; background: white;">
      <div style="margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">INVOICE</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Invoice #${invoice.id}</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px; color: #1f2937;">${issuer.name}</h2>
            <p style="color: #6b7280; margin: 5px 0; font-size: 12px;">Company ID: ${issuer.id}</p>
            <p style="color: #6b7280; margin: 5px 0; font-size: 12px;">Tax ID: ${issuer.taxId}</p>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <div>
          <h3 style="color: #2563eb; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0;">From (Issuer)</h3>
          <p style="margin: 5px 0; font-weight: bold; color: #1f2937;">${issuer.name}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">ID: ${issuer.id}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Tax ID: ${issuer.taxId}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Manager: ${issuer.manager}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">${issuer.address}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">IBAN: ${issuer.iban}</p>
        </div>
        
        <div>
          <h3 style="color: #2563eb; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0;">Bill To (Recipient)</h3>
          <p style="margin: 5px 0; font-weight: bold; color: #1f2937;">${recipient.name}</p>
          ${recipient.id ? `<p style="margin: 5px 0; color: #6b7280; font-size: 12px;">ID: ${recipient.id}</p>` : ''}
          ${recipient.taxId ? `<p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Tax ID: ${recipient.taxId}</p>` : ''}
          ${recipient.manager ? `<p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Manager: ${recipient.manager}</p>` : ''}
          ${recipient.address ? `<p style="margin: 5px 0; color: #6b7280; font-size: 12px;">${recipient.address}</p>` : ''}
          ${recipient.nationalIdNumber ? `<p style="margin: 5px 0; color: #6b7280; font-size: 12px;">National ID: ${recipient.nationalIdNumber}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 12px;"><strong style="color: #1f2937;">Invoice Date:</strong> ${formatDate(invoice.date)}</p>
        </div>
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 12px;"><strong style="color: #1f2937;">Invoice ID:</strong> ${invoice.id}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;">
        <thead>
          <tr style="background-color: #2563eb; color: white;">
            <th style="padding: 12px; text-align: left; border: none;">Product/Service</th>
            <th style="padding: 12px; text-align: center; border: none;">Qty</th>
            <th style="padding: 12px; text-align: center; border: none;">Unit</th>
            <th style="padding: 12px; text-align: right; border: none;">Unit Price</th>
            <th style="padding: 12px; text-align: right; border: none;">VAT %</th>
            <th style="padding: 12px; text-align: right; border: none;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 12px;">
            <span style="color: #6b7280;">Subtotal:</span>
            <span style="color: #1f2937; font-weight: 500;">${formatCurrency(subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 12px;">
            <span style="color: #6b7280;">VAT:</span>
            <span style="color: #1f2937; font-weight: 500;">${formatCurrency(vat)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 0; background-color: #2563eb; color: white; padding: 12px; border-radius: 4px;">
            <span style="font-weight: bold;">TOTAL:</span>
            <span style="font-weight: bold; font-size: 14px;">${formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; font-size: 10px; color: #6b7280;">
        <p style="margin: 5px 0;">Generated by Invoice Manager | ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `;
    page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <button class="btn btn-secondary" data-navigate="/invoices">← Back to Invoices</button>
        <h1>Invoice PDF - ${invoice.id}</h1>
      </div>
      
      <div class="page-content" style="padding: 0; background: transparent; border: none; min-height: auto;">
        <div style="margin-bottom: 20px;">
          <button id="download-pdf-btn" class="btn btn-primary">⬇ Download PDF</button>
        </div>
        <div id="pdf-container" style="background: white; border: 1px solid #e5e7eb; border-radius: 4px; overflow: auto; max-height: 800px;">
          ${pdfContent}
        </div>
      </div>
    </div>
  `;
    page.querySelector('[data-navigate]')?.addEventListener('click', () => {
        navigateTo('/invoices');
    });
    // Download PDF functionality
    const downloadBtn = page.querySelector('#download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const element = page.querySelector('#pdf-container');
            if (element) {
                // Dynamic import of html2pdf
                import('html2pdf.js').then((html2pdf) => {
                    const opt = {
                        margin: 10,
                        filename: `${invoice.id}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
                    };
                    html2pdf.default().set(opt).from(element).save();
                }).catch((err) => {
                    alert('Error generating PDF. Please try again.');
                    console.error(err);
                });
            }
        });
    }
    return page;
}
//# sourceMappingURL=invoices.js.map