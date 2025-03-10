import { createRoot } from '@wordpress/element';
import App from './components/MapProvider';
import { PublicApp } from './components/MapProvider';

const mapContainer = document.getElementById('afc-territory-map');
const publicContainer = document.getElementById('afc-territory-public');

/**
 * renders the admin side map
 * or
 * renders the public side map
 */
if (mapContainer) {

    const mapRoot = createRoot(mapContainer);
    mapRoot.render(<App />);

} else if (publicContainer) {

    const publicRoot = createRoot(publicContainer);
    publicRoot.render(<PublicApp />);

}