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

        var legend = L.control({ position: 'topleft' });

        legend.onAdd = function () {

            var div = L.DomUtil.create('div', 'branch-legend');

            return div;

        }

        legend.addTo(mapRef.current);

        const legendContainer = document.querySelector('.branch-legend');
        //const legendRoot = createRoot(legendContainer);

        //legendRoot.render(<MapLegend />);

        

        mapRef.current.on('zoomend', () => {

            //console.log("overlay Pane", mapRef.current.getPane('mapPane'));

        });

    }, []);

    return (
        
        <div id="territory-map" style={{ height: '750px' }}></div>
        
    );
};

export default TerritoryMap;
