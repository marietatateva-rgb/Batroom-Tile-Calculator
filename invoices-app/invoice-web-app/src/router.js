import Navigo from 'navigo';
import { updateActiveNavLink } from './layout/header';
import { createHomePage } from './pages/home';
import { createInvoicesPage, createInvoiceViewPage, createInvoiceEditPage, createInvoicePdfPage, } from './pages/invoices';
import { createClientsPage, createClientViewPage, createClientEditPage, createAddClientPage } from './pages/clients';
import { createConfigPage } from './pages/config';
const router = new Navigo('/', { hash: false });
function getContentContainer() {
    return document.getElementById('page-content');
}
function renderPage(pageElement) {
    const contentContainer = getContentContainer();
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }
    console.log('Rendering page...');
    contentContainer.innerHTML = '';
    contentContainer.appendChild(pageElement);
    console.log('Page rendered');
}
function updateNavigation(pathname) {
    console.log('Updating navigation for:', pathname);
    updateActiveNavLink(pathname);
}
// Home route
router.on('/', () => {
    console.log('Route: /');
    updateNavigation('/');
    renderPage(createHomePage());
});
// Invoices routes
router.on('/invoices', () => {
    console.log('Route: /invoices');
    updateNavigation('/invoices');
    renderPage(createInvoicesPage());
});
router.on('/invoices/:id/view', (match) => {
    const id = match?.data?.id || 'unknown';
    console.log('Route: /invoices/:id/view, id=', id);
    updateNavigation('/invoices');
    renderPage(createInvoiceViewPage(id));
});
router.on('/invoices/:id/edit', (match) => {
    const id = match?.data?.id || 'unknown';
    console.log('Route: /invoices/:id/edit, id=', id);
    updateNavigation('/invoices');
    renderPage(createInvoiceEditPage(id));
});
router.on('/invoices/:id/pdf', (match) => {
    const id = match?.data?.id || 'unknown';
    console.log('Route: /invoices/:id/pdf, id=', id);
    updateNavigation('/invoices');
    renderPage(createInvoicePdfPage(id));
});
// Clients routes
router.on('/clients', () => {
    console.log('Route: /clients');
    updateNavigation('/clients');
    renderPage(createClientsPage());
});
router.on('/clients/:id/view', (match) => {
    const id = match?.data?.id || 'unknown';
    console.log('Route: /clients/:id/view, id=', id);
    updateNavigation('/clients');
    renderPage(createClientViewPage(id));
});
router.on('/clients/:id/edit', (match) => {
    const id = match?.data?.id || 'unknown';
    console.log('Route: /clients/:id/edit, id=', id);
    updateNavigation('/clients');
    renderPage(createClientEditPage(id));
});
router.on('/clients/add', () => {
    console.log('Route: /clients/add');
    updateNavigation('/clients');
    renderPage(createAddClientPage());
});
// Config route
router.on('/config', () => {
    console.log('Route: /config');
    updateNavigation('/config');
    renderPage(createConfigPage());
});
// 404 fallback
router.notFound(() => {
    console.log('Route: not found, redirecting to /');
    updateNavigation('/');
    renderPage(createHomePage());
});
export function initRouter() {
    console.log('Router resolve called');
    try {
        router.resolve();
        console.log('Router resolved successfully');
    }
    catch (error) {
        console.error('Error resolving router:', error);
        // Fallback: render home page immediately
        const homeEl = getContentContainer();
        if (homeEl) {
            renderPage(createHomePage());
        }
    }
    // Listen for custom navigation events from header
    window.addEventListener('navigate', (event) => {
        const customEvent = event;
        const path = customEvent.detail?.path;
        if (path) {
            console.log('Navigation event received:', path);
            router.navigate(path);
        }
    });
}
export function getRouter() {
    return router;
}
//# sourceMappingURL=router.js.map