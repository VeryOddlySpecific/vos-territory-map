import { createRoot } from '@wordpress/element';
import App from './components_alt/MapProvider';

const mapContainer = document.getElementById('afc-territory-map');
const mapRoot = createRoot(mapContainer);
mapRoot.render(<App />);