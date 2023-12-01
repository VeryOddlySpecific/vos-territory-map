import { MapProvider } from './MapContext';
import Layout from './Layout';

function App() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}