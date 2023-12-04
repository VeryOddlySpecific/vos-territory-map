import { 
    useEffect,
    useContext
} from '@wordpress/element';

import { MapContext } from './MapContext';

const TerritoryMap = () => {

    const { mapRef } = useContext(MapContext);

    useEffect(() => {

        mapRef.current = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: false
        });



        // Add additional map setup here (like tile layers, markers, etc.)

        
    }, []);

    return (
        <div id="territory-map" style={{ height: '600px' }}></div> // Corrected inline style
    );
};

export default TerritoryMap;
