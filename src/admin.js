import { createRoot } from 'react-dom';
import TerritoryMap from './components/TerritoryMap';

const mapContainer = document.getElementById('afc-territory-map');
const mapRoot = createRoot(mapContainer);
mapRoot.render(<TerritoryMap />);