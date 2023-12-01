import { useEffect } from '@wordpress/element';

const TerritoryMap = () => {
    useEffect(() => {
        const map = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: false
        });

        // Add additional map setup here (like tile layers, markers, etc.)

        return () => {
            map.remove(); // Cleanup the map on component unmount
        };
    }, []);

    return (
        <div id="territory-map" style={{ height: '600px' }}></div> // Corrected inline style
    );
};

export default TerritoryMap;
