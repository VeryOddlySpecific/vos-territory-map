import { MapProvider } from './MapContext';
import Layout from './Layout';
import { PublicLayout } from './Layout';

function App() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function PublicApp() {
  return (
    <MapProvider>
      <PublicLayout />
    </MapProvider>
  );
}

export default App;

export { PublicApp };