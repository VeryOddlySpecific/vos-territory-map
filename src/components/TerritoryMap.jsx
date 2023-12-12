import { 
    useEffect,
    useContext,
    //createRoot
} from '@wordpress/element';

//import MapLegend from './MapLegend';

import { MapContext } from './MapContext';

//import branchesAlt from '../assets/branchesAlt.json';

const TerritoryMap = () => {

    const { mapRef } = useContext(MapContext);

    useEffect(() => {

        mapRef.current = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: false
        });

    }, []);

    return (
        
        <div id="territory-map" style={{ height: '750px' }}></div>
        
    );
};

export default TerritoryMap;
