import { createRoot } from 'react-dom';
import TerritoryMap from './components/TerritoryMap-public';

const mapContainer = document.getElementById('territory-map');
const mapRoot = createRoot(mapContainer);
mapRoot.render(<TerritoryMap />);