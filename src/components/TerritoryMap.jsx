import { 
    useEffect,
    useContext,
    //createRoot
} from '@wordpress/element';

//import MapLegend from './MapLegend';

import { MapContext } from './MapContext';

//import branchesAlt from '../assets/branchesAlt.json';

import allCities from '../assets/citydata.json';

const TerritoryMap = () => {

    const { mapRef } = useContext(MapContext);

    useEffect(() => {

        if (admin.mapData) {

            mapRef.current = JSON.parse(admin.mapData);

        } else {

            mapRef.current = L.map('territory-map', {
                center: [39.8283, -98.5795],
                zoom: 4,
                zoomControl: false,
                maxBounds: [
                    [49.384, -66.885],
                    [24.396, -124.848]
                ],
            });

        }
        
        mapRef.current.on('zoomend', () => {
            const props = {
                center: mapRef.current.getCenter(),
                zoom: mapRef.current.getZoom(),
                bounds: mapRef.current.getBounds(),
                minZoom: mapRef.current.getMinZoom(),
                maxZoom: mapRef.current.getMaxZoom(),
                size: mapRef.current.getSize(),
                pixelBounds: mapRef.current.getPixelBounds(),
                pixelOrigin: mapRef.current.getPixelOrigin(),
                worldBounds: mapRef.current.getPixelWorldBounds(),
                overlayPane: mapRef.current.getPane('overlayPane'),
                mapPane: mapRef.current.getPane('mapPane'),
                renderer: mapRef.current._renderer,
            }
    
            //console.log("props", props);
    
        });

        mapRef.current.on('click', (e) => {
            const props = {
                latlng: e.latlng,
                containerPoint: e.containerPoint,
                layerPoint: e.layerPoint,
                originalEvent: e.originalEvent,
                target: e.target,
            }
    
            console.log("latlng", props.latlng);
    
        });

    }, []);

    return (
        
        <div id="territory-map" style={{ height: '750px' }}></div>
        
    );
};

export default TerritoryMap;
