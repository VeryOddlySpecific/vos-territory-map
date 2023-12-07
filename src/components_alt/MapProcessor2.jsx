import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"

import branchesAlt from "../assets/branchesAlt.json";

const MapProcessor = () => {

    const savedSubregions = JSON.parse(admin.subregions);

    // context properties needed
    // map
    // activeRegions
    // selectedSubregion
    const { 
        mapRef, 
        activeRegions, 
        setActiveRegions,
        activeSubregions,
        setActiveSubregions,
        activeSelection, 
        setActiveSelection,
        mapLayers,
        setMapLayers,
        legendKeyClicked,
        setLegendKeyClicked,
    } = useContext(MapContext);

    const [ region, setRegion ] = useState(null);
    const [ subregion, setSubregion ] = useState(null);
    const [ isClicked, setIsClicked ] = useState(false);

    const [ init, setInit ] = useState(true);

    

    const addLayersToMap = (...layers) => {

        layers.forEach(layer => {

            const layerIsInMapLayers = mapLayers.includes(layer.options._afct_id);

            if (!layerIsInMapLayers) {

                mapRef.current.addLayer(layer);
                setMapLayers((prevMapLayers) => [...prevMapLayers, layer.options._afct_id]);

            }

        });

    }

    // to add saved regions and subregions to map, ensuring their styles if needed
    useEffect(() => {

        console.log("saved regions", activeRegions)
        console.log("saved subregions", savedSubregions)

        if (activeRegions.length) {

            activeRegions.forEach(region => {
        
                const apiRoute = admin.apiBase + '/state/' + region;
    
                fetch(apiRoute)
                .then(response => response.json())
                .then(data => {
    
                    setRegion([data, region]);
    
                });
                
            });

        }

        setInit(false);
        
    }, []);

    

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

            /********* */

            const subregionsLayer = L.geoJson(json, {
                onEachFeature: (feature, layer) => {

                    const geoid = feature.properties.GEOID;

                    const featureIsActive = savedSubregions.some(subregion => Number(subregion.geoid) === Number(geoid));
                    

                    if (featureIsActive) {

                        const activeSubregionBranch = savedSubregions.find(subregion => Number(subregion.geoid) === Number(geoid))?.branch;

                        const branchStyle = branchesAlt[activeSubregionBranch].style;

                        layer.setStyle(branchStyle);

                        layer.branch = activeSubregionBranch;

                        setActiveSubregions((prevActiveSubregions) => [...prevActiveSubregions, layer]);
                        
                    } else {

                        layer.setStyle({
                            color: '#0a1944',
                            weight: 1,
                            opacity: .25,
                            fillColor: '#fff',
                            fillOpacity: 0.25,
                        });

                    }

                    const layerCenter = turf.centerOfMass(feature);
                    const centroidCoords = layerCenter.geometry.coordinates;

                    var hoverTooltip = L.tooltip(centroidCoords, {
                        content: feature.properties.Name + ' County',
                        permanent: false,
                        opacity: 1,
                        //className: 'tooltip-max-' + absWidth + '-' + absHeight,
                        backgroundColor: 'transparent',
                        direction: 'center',
                    })

                    layer.bindTooltip(hoverTooltip);

                    mapRef.current.on('zoom', () => {

                        const zoom = mapRef.current.getZoom();

                        const layerBounds = layer.getBounds();

                        const pxWidthOfLayer = mapRef.current.latLngToLayerPoint(layerBounds.getNorthEast()).x - mapRef.current.latLngToLayerPoint(layerBounds.getSouthWest()).x;
                        const pxHeightOfLayer = mapRef.current.latLngToLayerPoint(layerBounds.getNorthEast()).y - mapRef.current.latLngToLayerPoint(layerBounds.getSouthWest()).y;
                    
                        const absWidth = Math.abs(pxWidthOfLayer);
                        const absHeight = Math.abs(pxHeightOfLayer);

                        var permTooltip = L.tooltip(centroidCoords, {
                            content: feature.properties.Name + ' County',
                            permanent: true,
                            opacity: 1,
                            className: 'tooltip-max-' + absWidth + '-' + absHeight,
                            backgroundColor: 'transparent',
                            direction: 'center',
                        })

                        var hoverTooltip = L.tooltip(centroidCoords, {
                            content: feature.properties.Name + ' County',
                            permanent: false,
                            opacity: 1,
                            className: 'tooltip-max-' + absWidth + '-' + absHeight,
                            backgroundColor: 'transparent',
                            direction: 'center',
                        })

                        if (zoom > 6) {

                            layer.unbindTooltip();
                            layer.bindTooltip(permTooltip);

                        } else {
                                
                            layer.unbindTooltip();
                            layer.bindTooltip(hoverTooltip);

                        }

                    });

                    layer.on('click', (e) => {

                        setSubregion(e.target);
                        setIsClicked(true);

                    })

                },
                _afct_id: 'subregion-' + fips
            })

            

            addLayersToMap(shapeLayer, subregionsLayer);

        }
        
    }, [region]);

    useEffect(() => {

        if (subregion && isClicked) {

            if (!activeSelection.includes(subregion)) {

                subregion.setStyle({
                    opacity: 1,
                    fillOpacity: 1,
                })

                setActiveSelection([...activeSelection, subregion]);

            } else {

                subregion.setStyle({
                    opacity: .25,
                    fillOpacity: .25
                })

                setActiveSelection(activeSelection.filter(item => item !== subregion));

            }

            setIsClicked(false);

        }
        
        
        
    }, [subregion, isClicked]);

    useEffect(() => {

        console.log("activeSubregions", activeSubregions)

    }, [activeSubregions])

    useEffect(() => {
        
        if (legendKeyClicked !== null && activeSubregions.length) {

            activeSubregions.forEach(subregion => {

                setSubregion(subregion);
                setIsClicked(true);

            });

        }
        
    }, [legendKeyClicked])

}

export default MapProcessor;