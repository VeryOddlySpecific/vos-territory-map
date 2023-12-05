import {
    useContext,
    useEffect,
    useRef
} from '@wordpress/element';

import { MapContext } from './MapContext';

const MapProcessor = () => {

    const { activeRegions, activeSubregions, activeSelection, setActiveSelection, mapRef } = useContext(MapContext);
    const addedRegions = useRef(new Set());
    const selectedSubregions = useRef(new Set());

    const getRegionData = (data, region) => {

        // data is an object with the following properties:
        //     - fips: string
        //     - name: string
        //     - data: object
    
        // set region boundary shape layer

        const tCombined = turf.combine(data);
        const tConvex = turf.convex(tCombined, {concavity: 1});
        
        const boundary = L.geoJson(tConvex, {
            style: {
                color: "#0a1944",
                weight: 2,
                opacity: 1,
                fillColor: "transparent",
                fillOpacity: 0
            },
            fips: region
        });

        const subregions = L.geoJson(data, {
            onEachFeature: (feature, layer) => {

                layer.setStyle({
                    color: "#0a1944",
                    weight: 1,
                    opacity: .25,
                    fillColor: "transparent",
                    fillOpacity: 0
                });

                // give layer a type that is subregion
                layer.type = 'subregion';

                layer.on('click', (e) => {

                    console.log('layer', layer);

                });

            },
            fips: region
        });

        return {
            boundary: boundary,
            subregions: subregions
        }
    
        // set region subregion shape layers
    }

    const updateActiveSelection = (layerId) => {

        const newSelection = [...activeSelection];
        const selectionIndex = newSelection.findIndex(item => item === layerId);

        if (selectionIndex === -1) {

            newSelection.push(layerId);
            setActiveSelection(newSelection);

        } else {

            newSelection.splice(selectionIndex, 1);
            setActiveSelection(newSelection);

        }

    }
    
    

    useEffect(() => {

        console.log('activeRegions', activeRegions);
        console.log('activeSubregions', activeSubregions);
        console.log('activeSelection', activeSelection);

    }, [activeRegions, activeSubregions, activeSelection]);

    
    useEffect(() => {

        // do nothing if activeRegions is empty
        if (activeRegions.length === 0 && addedRegions.length === 0) return;

        

        const addRegion = (region) => {

            const apiRoute = admin.apiBase + '/state/' + region;
    
            fetch(apiRoute)
            .then(response => response.json())
            .then(data => {
    
                const regionData = getRegionData(data, region);
                const boundary = regionData.boundary;
                const subregions = regionData.subregions;
    
                boundary.addTo(mapRef.current);
                subregions.addTo(mapRef.current);
    
            });
    
        }

        const removeRegion = (region) => {

            // remove map layer where fips === region
            mapRef.current.eachLayer(layer => {
                if (layer.options.fips === region) {
                    mapRef.current.removeLayer(layer);
                }
            });
    
        }

        activeRegions.forEach(region => {

            // if region is not already on the map, add it
            if (!addedRegions.current.has(region)) {

                addRegion(region);
                addedRegions.current.add(region);

            }

        });

        // remove any regions that are no longer active
        addedRegions.current.forEach(region => {

            if (!activeRegions.includes(region)) {

                removeRegion(region);
                addedRegions.current.delete(region);

            }

        });

    }, [activeRegions]);

    useEffect(() => {
        
        console.log('activeSelection useEffect', activeSelection)
        
    }, [activeSelection]);

    return null;

}

export default MapProcessor;