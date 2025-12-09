import './styles/main.css';
import { initApp } from './app';
const appContainer = document.getElementById('app');
if (!appContainer) {
    throw new Error('App container not found');
}
initApp(appContainer);
//# sourceMappingURL=main.js.map