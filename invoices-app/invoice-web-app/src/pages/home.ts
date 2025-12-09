export function createHomePage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page page-home'
  
  page.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1>Welcome to Invoice Manager</h1>
        <p>Manage your invoices and clients efficiently</p>
      </div>
      
      <div class="home-grid">
        <div class="home-card">
          <div class="home-card-icon">📄</div>
          <h2>View Invoices</h2>
          <p>Browse, search, and manage all your invoices in one place</p>
          <button class="btn btn-primary" data-navigate="/invoices">Go to Invoices</button>
        </div>
        
        <div class="home-card">
          <div class="home-card-icon">👥</div>
          <h2>Manage Clients</h2>
          <p>Keep track of your clients and their information</p>
          <button class="btn btn-primary" data-navigate="/clients">Go to Clients</button>
        </div>
        
        <div class="home-card">
          <div class="home-card-icon">⚙️</div>
          <h2>Configuration</h2>
          <p>Customize your application settings and preferences</p>
          <button class="btn btn-primary" data-navigate="/config">Go to Configuration</button>
        </div>
      </div>
    </div>
  `
  
  // Add click handlers for navigation
  const buttons = page.querySelectorAll('[data-navigate]')
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const href = btn.getAttribute('data-navigate')
      if (href) {
        window.dispatchEvent(
          new CustomEvent('navigate', { detail: { path: href } })
        )
      }
    })
  })
  
  return page
}
