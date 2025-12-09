export function createFooter(): HTMLElement {
  const footer = document.createElement('footer')
  footer.className = 'app-footer'
  
  const currentYear = new Date().getFullYear()
  footer.innerHTML = `
    <div class="footer-container">
      <p>&copy; ${currentYear} Invoice Manager. All rights reserved.</p>
    </div>
  `
  
  return footer
}
