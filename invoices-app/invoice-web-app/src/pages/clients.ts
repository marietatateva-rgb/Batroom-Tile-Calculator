import { getGlobalRepo } from '../data/repo'
import { isRecipientCompany } from 'invoice-repo'

export function createClientsPage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-clients'
  
  const repo = getGlobalRepo()
  const clients = repo.getAllRecipients()
  
  const navigateTo = (path: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
  }
  
  // Calculate invoices per client for reference
  const invoicesPerClient: { [key: string]: number } = {}
  repo.getAllInvoices().forEach((invoice) => {
    const clientId = (invoice.recipient as any).id || 'unknown'
    invoicesPerClient[clientId] = (invoicesPerClient[clientId] || 0) + 1
  })
  
  page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h1>Clients</h1>
            <p>Browse and manage all clients (individuals and companies)</p>
          </div>
          <button class="btn btn-primary" data-action="add-client">+ Add Client</button>
        </div>
      </div>
      
      <div class="page-content">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>ID / Tax ID</th>
                <th>Address</th>
                <th>Invoices</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${clients.map((client) => {
                const isCompany = isRecipientCompany(client)
                const clientId = (client as any).id || 'unknown'
                const invoiceCount = invoicesPerClient[clientId] || 0
                return `
                  <tr>
                    <td><strong>${client.name}</strong></td>
                    <td>${isCompany ? 'Company' : 'Individual'}</td>
                    <td>${isCompany ? (client as any).taxId || (client as any).id || '-' : (client as any).nationalIdNumber || '-'}</td>
                    <td>${isCompany ? (client as any).address || '-' : '-'}</td>
                    <td>${invoiceCount}</td>
                    <td>
                      <button class="btn btn-small btn-primary" data-action="view" data-id="${clientId}">View</button>
                      <button class="btn btn-small btn-secondary" data-action="edit" data-id="${clientId}">Edit</button>
                      <button class="btn btn-small btn-danger" data-action="delete" data-id="${clientId}">Delete</button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
        
        ${clients.length === 0 ? '<p style="text-align: center; padding: 2rem;">No clients found. Create one to get started.</p>' : ''}
      </div>
    </div>
  `
  
  // Add event listeners
  page.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const action = (e.target as HTMLElement).getAttribute('data-action')
      const clientId = (e.target as HTMLElement).getAttribute('data-id')
      
      switch (action) {
        case 'view':
          if (clientId) navigateTo(`/clients/${clientId}/view`)
          break
        case 'edit':
          if (clientId) navigateTo(`/clients/${clientId}/edit`)
          break
        case 'delete':
          if (clientId) {
            if (confirm(`Are you sure you want to delete this client?`)) {
              repo.deleteRecipient(clientId)
              window.location.href = '/clients'
            }
          }
          break
        case 'add-client':
          navigateTo('/clients/add')
          break
      }
    })
  })
  
  return page
}

export function createClientViewPage(id: string): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-client-view'
  
  const repo = getGlobalRepo()
  const client = repo.findRecipientById(id)
  const isCompany = client ? isRecipientCompany(client) : false
  
  const navigateTo = (path: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
  }
  
  if (!client) {
    page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/clients">← Back to Clients</button>
          <h1>Client Not Found</h1>
        </div>
        <div class="page-content">
          <p>The requested client could not be found.</p>
        </div>
      </div>
    `
  } else {
    page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/clients">← Back to Clients</button>
          <h1>${client.name}</h1>
          <p>${isCompany ? 'Company' : 'Individual'}</p>
        </div>
        
        <div class="page-content">
          <div class="detail-sections">
            <div class="detail-section">
              <h3>Basic Information</h3>
              <table class="detail-table">
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>${client.name}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>${isCompany ? 'Company' : 'Individual'}</td>
                </tr>
                ${isCompany ? `
                  <tr>
                    <td><strong>Tax ID:</strong></td>
                    <td>${(client as any).taxId || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Company ID:</strong></td>
                    <td>${(client as any).id || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Manager:</strong></td>
                    <td>${(client as any).manager || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Address:</strong></td>
                    <td>${(client as any).address || '-'}</td>
                  </tr>
                ` : `
                  <tr>
                    <td><strong>National ID:</strong></td>
                    <td>${(client as any).nationalIdNumber || '-'}</td>
                  </tr>
                `}
              </table>
            </div>
          </div>
          
          <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary" data-action="edit" data-id="${id}">Edit Client</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}">Delete Client</button>
          </div>
        </div>
      </div>
    `
    
    page.querySelector('[data-navigate]')?.addEventListener('click', () => {
      navigateTo('/clients')
    })
    
    page.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = (e.target as HTMLElement).getAttribute('data-action')
        const clientId = (e.target as HTMLElement).getAttribute('data-id')
        
        if (action === 'edit' && clientId) {
          navigateTo(`/clients/${clientId}/edit`)
        } else if (action === 'delete' && clientId) {
          if (confirm('Are you sure you want to delete this client?')) {
            repo.deleteRecipient(clientId)
            navigateTo('/clients')
          }
        }
      })
    })
  }
  
  return page
}

export function createClientEditPage(id: string): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-client-edit'
  
  const repo = getGlobalRepo()
  const client = repo.findRecipientById(id)
  const isCompany = client ? isRecipientCompany(client) : false
  
  const navigateTo = (path: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
  }
  
  if (!client) {
    page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/clients">← Back to Clients</button>
          <h1>Client Not Found</h1>
        </div>
        <div class="page-content">
          <p>The requested client could not be found.</p>
        </div>
      </div>
    `
  } else {
    page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <button class="btn btn-secondary" data-navigate="/clients/${id}/view">← Back to Client</button>
          <h1>Edit Client - ${client.name}</h1>
        </div>
        
        <div class="page-content">
          <form class="client-form" data-client-id="${id}" data-is-company="${isCompany}">
            <div class="form-group">
              <label for="name">Client Name *</label>
              <input type="text" id="name" name="name" required value="${client.name}">
            </div>
            
            <div class="form-group">
              <label for="type">Type *</label>
              <select id="type" name="type" required>
                <option value="company" ${isCompany ? 'selected' : ''}>Company</option>
                <option value="individual" ${!isCompany ? 'selected' : ''}>Individual</option>
              </select>
            </div>
            
            ${isCompany ? `
              <div class="form-group">
                <label for="taxId">Tax ID</label>
                <input type="text" id="taxId" name="taxId" value="${(client as any).taxId || ''}">
              </div>
              
              <div class="form-group">
                <label for="companyId">Company ID</label>
                <input type="text" id="companyId" name="companyId" value="${(client as any).id || ''}">
              </div>
              
              <div class="form-group">
                <label for="manager">Manager</label>
                <input type="text" id="manager" name="manager" value="${(client as any).manager || ''}">
              </div>
              
              <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address">${(client as any).address || ''}</textarea>
              </div>
            ` : `
              <div class="form-group">
                <label for="nationalId">National ID</label>
                <input type="text" id="nationalId" name="nationalId" value="${(client as any).nationalIdNumber || ''}">
              </div>
            `}
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `
    
    page.querySelector('[data-navigate]')?.addEventListener('click', () => {
      navigateTo(`/clients/${id}/view`)
    })
    
    const form = page.querySelector('.client-form') as HTMLFormElement
    const typeSelect = page.querySelector('#type') as HTMLSelectElement
    
    // Handle type change
    typeSelect?.addEventListener('change', () => {
      navigateTo(`/clients/${id}/edit`)
    })
    
    // Handle form submission
    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(form)
      
      const type = formData.get('type') as string
      const updates: any = {
        name: (formData.get('name') || '') as string,
      }
      
      if (type === 'company') {
        updates.taxId = (formData.get('taxId') || '') as string
        updates.id = (formData.get('companyId') || '') as string
        updates.manager = (formData.get('manager') || '') as string
        updates.address = (formData.get('address') || '') as string
        // Remove individual fields
        if ('nationalIdNumber' in updates) delete updates.nationalIdNumber
      } else {
        updates.nationalIdNumber = (formData.get('nationalId') || '') as string
        // Remove company fields by setting them to undefined
        updates.taxId = undefined
        updates.id = undefined
        updates.manager = undefined
        updates.address = undefined
      }
      
      repo.updateRecipient(id, updates)
      alert('Client updated successfully!')
      navigateTo(`/clients/${id}/view`)
    })
    
    page.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
      navigateTo(`/clients/${id}/view`)
    })
  }
  
  return page
}

export function createAddClientPage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-client-add'
  
  const navigateTo = (path: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
  }
  
  page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <button class="btn btn-secondary" data-navigate="/clients">← Back to Clients</button>
        <h1>Add New Client</h1>
      </div>
      
      <div class="page-content">
        <form class="client-form" data-action="add">
          <div class="form-group">
            <label for="name">Client Name *</label>
            <input type="text" id="name" name="name" required placeholder="Enter client name">
          </div>
          
          <div class="form-group">
            <label for="type">Type *</label>
            <select id="type" name="type" required>
              <option value="company" selected>Company</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          
          <div id="company-fields">
            <div class="form-group">
              <label for="taxId">Tax ID</label>
              <input type="text" id="taxId" name="taxId" placeholder="e.g., BG123456789">
            </div>
            
            <div class="form-group">
              <label for="companyId">Company ID</label>
              <input type="text" id="companyId" name="companyId" placeholder="e.g., 123456">
            </div>
            
            <div class="form-group">
              <label for="manager">Manager</label>
              <input type="text" id="manager" name="manager" placeholder="Manager name">
            </div>
            
            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" name="address" placeholder="Company address"></textarea>
            </div>
          </div>
          
          <div id="individual-fields" style="display: none;">
            <div class="form-group">
              <label for="nationalId">National ID</label>
              <input type="text" id="nationalId" name="nationalId" placeholder="National ID number">
            </div>
          </div>
          
          <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary">Create Client</button>
            <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `
  
  page.querySelector('[data-navigate]')?.addEventListener('click', () => {
    navigateTo('/clients')
  })
  
  const typeSelect = page.querySelector('#type') as HTMLSelectElement
  const companyFields = page.querySelector('#company-fields') as HTMLElement
  const individualFields = page.querySelector('#individual-fields') as HTMLElement
  const form = page.querySelector('.client-form') as HTMLFormElement
  
  typeSelect?.addEventListener('change', () => {
    if (typeSelect.value === 'company') {
      companyFields.style.display = 'block'
      individualFields.style.display = 'none'
    } else {
      companyFields.style.display = 'none'
      individualFields.style.display = 'block'
    }
  })
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const repo = getGlobalRepo()
    const formData = new FormData(form)
    const type = formData.get('type') as string
    
    if (type === 'company') {
      repo.addRecipient({
        name: (formData.get('name') || '') as string,
        taxId: (formData.get('taxId') || '') as string,
        id: (formData.get('companyId') || '') as string,
        manager: (formData.get('manager') || '') as string,
        address: (formData.get('address') || '') as string,
      })
    } else {
      repo.addRecipient({
        name: (formData.get('name') || '') as string,
        nationalIdNumber: (formData.get('nationalId') || '') as string,
      })
    }
    
    alert('Client created successfully!')
    navigateTo('/clients')
  })
  
  page.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
    navigateTo('/clients')
  })
  
  return page
}
