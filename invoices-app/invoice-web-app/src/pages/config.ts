import { getGlobalRepo } from '../data/repo'

export function createConfigPage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-config'
  
  const repo = getGlobalRepo()
  const settings = repo.getSettings()
  const issuer = settings.invoiceIssuer
  
  const renderView = () => {
    page.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <h1>Configuration</h1>
          <p>Manage app settings and issuer company data</p>
        </div>
        
        <div class="page-content">
          <div class="detail-sections">
            <div class="detail-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Issuer Company</h3>
                <button class="btn btn-primary" data-action="edit-issuer">Edit</button>
              </div>
              <table class="detail-table">
                <tr>
                  <td><strong>Company Name:</strong></td>
                  <td>${issuer.name}</td>
                </tr>
                <tr>
                  <td><strong>Company ID:</strong></td>
                  <td>${issuer.id}</td>
                </tr>
                <tr>
                  <td><strong>Tax ID:</strong></td>
                  <td>${issuer.taxId}</td>
                </tr>
                <tr>
                  <td><strong>Manager:</strong></td>
                  <td>${issuer.manager}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>${issuer.address}</td>
                </tr>
                <tr>
                  <td><strong>IBAN:</strong></td>
                  <td>${issuer.iban}</td>
                </tr>
              </table>
            </div>
            
            <div class="detail-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Default Settings</h3>
                <button class="btn btn-primary" data-action="edit-settings">Edit</button>
              </div>
              <table class="detail-table">
                <tr>
                  <td><strong>Default VAT Rate:</strong></td>
                  <td>${settings.defaultVatRate}%</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    `
    
    page.querySelector('[data-action="edit-issuer"]')?.addEventListener('click', () => {
      renderEdit('issuer')
    })
    
    page.querySelector('[data-action="edit-settings"]')?.addEventListener('click', () => {
      renderEdit('settings')
    })
  }
  
  const renderEdit = (section: 'issuer' | 'settings') => {
    if (section === 'issuer') {
      page.innerHTML = `
        <div class="page-container">
          <div class="page-header">
            <h1>Edit Issuer Company</h1>
          </div>
          
          <div class="page-content">
            <form class="config-form" data-section="issuer">
              <div class="form-group">
                <label for="name">Company Name *</label>
                <input type="text" id="name" name="name" required value="${issuer.name}">
              </div>
              
              <div class="form-group">
                <label for="id">Company ID *</label>
                <input type="text" id="id" name="id" required value="${issuer.id}">
              </div>
              
              <div class="form-group">
                <label for="taxId">Tax ID *</label>
                <input type="text" id="taxId" name="taxId" required value="${issuer.taxId}">
              </div>
              
              <div class="form-group">
                <label for="manager">Manager *</label>
                <input type="text" id="manager" name="manager" required value="${issuer.manager}">
              </div>
              
              <div class="form-group">
                <label for="address">Address *</label>
                <textarea id="address" name="address" required>${issuer.address}</textarea>
              </div>
              
              <div class="form-group">
                <label for="iban">IBAN *</label>
                <input type="text" id="iban" name="iban" required value="${issuer.iban}">
              </div>
              
              <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `
      
      const form = page.querySelector('.config-form') as HTMLFormElement
      
      form?.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        
        const newIssuer = {
          name: (formData.get('name') || '') as string,
          id: (formData.get('id') || '') as string,
          taxId: (formData.get('taxId') || '') as string,
          manager: (formData.get('manager') || '') as string,
          address: (formData.get('address') || '') as string,
          iban: (formData.get('iban') || '') as string,
        }
        
        repo.updateSettings({ invoiceIssuer: newIssuer })
        alert('Issuer company information updated!')
        renderView()
      })
      
      page.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        renderView()
      })
    } else {
      page.innerHTML = `
        <div class="page-container">
          <div class="page-header">
            <h1>Edit Default Settings</h1>
          </div>
          
          <div class="page-content">
            <form class="config-form" data-section="settings">
              <div class="form-group">
                <label for="vatRate">Default VAT Rate (%) *</label>
                <input type="number" id="vatRate" name="vatRate" required step="0.01" min="0" max="100" value="${settings.defaultVatRate}">
              </div>
              
              <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `
      
      const form = page.querySelector('.config-form') as HTMLFormElement
      
      form?.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        
        repo.updateSettings({
          defaultVatRate: parseFloat((formData.get('vatRate') || '0') as string),
        })
        alert('Settings updated!')
        renderView()
      })
      
      page.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        renderView()
      })
    }
  }
  
  renderView()
  return page
}
