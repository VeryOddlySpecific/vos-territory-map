import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"


const MapProcessor = () => {

    // context properties needed
    // map
    // activeRegions
    // selectedSubregion
    const { 
        mapRef, 
        activeRegions, 
        activeSelection, 
        setActiveSelection,
        mapLayers,
        setMapLayers
    } = useContext(MapContext);

    const [ region, setRegion ] = useState(null);
    const [ subregion, setSubregion ] = useState(null);

    const addLayersToMap = (...layers) => {

        layers.forEach(layer => {

            const layerIsInMapLayers = mapLayers.includes(layer.options._afct_id);

            if (!layerIsInMapLayers) {

                mapRef.current.addLayer(layer);
                setMapLayers((prevMapLayers) => [...prevMapLayers, layer.options._afct_id]);

            }

        });

    }

    useEffect(() => {

        //console.log("activeRegions", activeRegions);
        //console.log("activeSelection", activeSelection);
        //console.log("mapLayers", mapLayers);

    }, [activeRegions, activeSelection, mapLayers]);

    useEffect(() => {

        // add region shape to map
        if (activeRegions.length) {

            activeRegions.forEach(region => {

                // get region shape data
                const apiRoute = admin.apiBase + '/state/' + region;

                fetch(apiRoute)
                .then(response => response.json())
                .then(data => {

                    setRegion([data, region]);

                });

            });

        }

        const mapLayersNotActive = [];

        mapLayers.forEach(layer => {

            const fips = layer.split('-')[1];

            const mapLayerIsActive = activeRegions.includes(fips);

            if (!mapLayerIsActive) {

                mapLayersNotActive.push(layer);

                mapRef.current.eachLayer(mapLayer => {

                    if (mapLayer.options._afct_id === layer) {
    
                        mapRef.current.removeLayer(mapLayer);
    
                        setMapLayers(mapLayers.filter(fLayer => fLayer !== layer));
    
                    }
    
                });

            }

        });

        /*
        mapLayersNotActive.forEach(layerNotActive => {

            mapRef.current.eachLayer(mapLayer => {

                if (mapLayer.options._afct_id === layerNotActive) {

                    mapRef.current.removeLayer(mapLayer);

                    setMapLayers(mapLayers.filter(layer => layer !== layerNotActive));

                }

            });

        });
        */



        // check for mapLayers with _afct_id of 'shape-' + region
        // that are not in activeRegions
        // if any are found, remove that layer
        // and layer with _afct_id of 'subregions-' + region (if it exists)

        /*
        mapLayers.forEach(layer => {

            // activeRegions has fips codes as strings
            // mapLayers has layer ids as strings in formats:
            //    'shape-' + fips
            //    'subregions-' + fips

            // therefore, this layer is either:
            //    'shape-' + fips
            //    'subregions-' + fips

            // if fips is not in activeRegions
            // remove this layer from map

        });
        */

        /*
        mapRef.current.eachLayer(layer => {

            // if layer._afct_id is not in mapLayers
            // remove this layer from map

            console.log("layer in mapRef.current", layer);

        })
        */
                

    }, [activeRegions]);

    useEffect(() => {
        
        if (region) {

            const json = region[0];
            const fips = region[1];

            const shape = turf.convex(turf.combine(json), {concavity: 1});
            
            const shapeLayer = L.geoJson(shape, {
                style: {
                    color: '#0a1944',
                    weight: 2,
                    opacity: 1,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                _afct_id: 'shape-' + fips
            });

            const subregionsLayer = L.geoJson(json, {
                onEachFeature: (feature, layer) => {

                    layer.setStyle({
                        color: '#0a1944',
                        weight: 1,
                        opacity: .25,
                        fillColor: '#fff',
                        fillOpacity: 0.25,
                    });

                    layer.on('click', (e) => {

                        setSubregion(e.target);

                    })

                },
                _afct_id: 'subregion-' + fips
            })

            addLayersToMap(shapeLayer, subregionsLayer);

        }
        
    }, [region]);

    useEffect(() => {

        if (subregion) {

            if (!activeSelection.includes(subregion)) {

                subregion.setStyle({
                    opacity: 1,
                    fillOpacity: .5
                })

                setActiveSelection([...activeSelection, subregion]);

            } else {

                subregion.setStyle({
                    opacity: .25,
                    fillOpacity: .25
                })

                setActiveSelection(activeSelection.filter(item => item !== subregion));

            }

        }
        
        
        
    }, [subregion]);

}

export default MapProcessor;