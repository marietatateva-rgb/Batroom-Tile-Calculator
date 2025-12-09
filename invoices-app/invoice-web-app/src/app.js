import { createHeader } from './layout/header';
import { createFooter } from './layout/footer';
import { initRouter } from './router';
import { initializeGlobalRepo } from './data/repo';
export function initApp(container) {
    try {
        // Initialize global data repo with sample data
        console.log('Initializing global repo...');
        initializeGlobalRepo();
        console.log('Global repo initialized');
        // Create app structure
        container.innerHTML = '';
        // Add header
        console.log('Creating header...');
        const header = createHeader();
        container.appendChild(header);
        console.log('Header added');
        // Add main content area
        console.log('Creating main content area...');
        const main = document.createElement('main');
        main.className = 'app-main';
        main.id = 'page-content';
        container.appendChild(main);
        console.log('Main content area added');
        // Add footer
        console.log('Creating footer...');
        const footer = createFooter();
        container.appendChild(footer);
        console.log('Footer added');
        // Initialize router
        console.log('Initializing router...');
        initRouter();
        console.log('Router initialized');
        console.log('App initialization complete!');
    }
    catch (error) {
        console.error('Error during app initialization:', error);
    }
}
//# sourceMappingURL=app.js.map