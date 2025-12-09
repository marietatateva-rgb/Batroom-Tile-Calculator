export function createHeader(): HTMLElement {
  const header = document.createElement('header')
  header.className = 'app-header'
  
  header.innerHTML = `
    <div class="header-container">
      <h1 class="header-logo">Invoice Manager</h1>
      <nav class="header-nav">
        <button class="nav-link" data-navigate="/">Home</button>
        <button class="nav-link" data-navigate="/invoices">Invoices</button>
        <button class="nav-link" data-navigate="/clients">Clients</button>
        <button class="nav-link" data-navigate="/config">Config</button>
      </nav>
    </div>
  `
  
  // Add click handlers for navigation
  const navButtons = header.querySelectorAll('[data-navigate]')
  navButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const href = btn.getAttribute('data-navigate')
      if (href) {
        // Use window.navigationEvent to trigger navigation
        window.dispatchEvent(
          new CustomEvent('navigate', { detail: { path: href } })
        )
      }
    })
  })
  
  return header
}

export function updateActiveNavLink(pathname: string): void {
  const links = document.querySelectorAll('.nav-link')
  links.forEach((link) => {
    const href = link.getAttribute('data-navigate') || ''
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    link.classList.toggle('active', isActive)
  })
}
