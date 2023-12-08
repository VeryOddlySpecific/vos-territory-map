import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"

import branchesAlt from "../assets/branchesAlt.json";

const MapProcessor = () => {

    if (!admin.subregions) {

        var adminSubregions = [];

    } else {
                
        var adminSubregions = JSON.parse(admin.subregions);

    }

    const importedSubregions = adminSubregions;

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
        subregionHover,
        setSubregionHover,
    } = useContext(MapContext);

    const [ region, setRegion ] = useState(null);
    const [ subregion, setSubregion ] = useState(null);
    const [ isClicked, setIsClicked ] = useState(false);

    const [allowSave, setAllowSave] = useState(false);

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

    const saveActiveRegions = async () => {

        console.log("saving active regions");

        const payload = {
            id: '_afct_active_regions',
            data: JSON.stringify(activeRegions)
        }

        try {

            const response = await fetch(admin.apiBase + '/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw Error(response.statusText);
            }

            const data = await response.json();

        } catch (error) {
                
            console.error(error);

        }

    }

    const saveActiveSubregions = async () => {

        console.log("saving active subregions");

        const subregionSaveData = [];

        activeSubregions.forEach(subregion => {

            const subregionData = {
                _afct_id: subregion.options._afct_id,
                branch: subregion.branch,
                geoid: subregion.feature.properties.GEOID
            }

            subregionSaveData.push(subregionData);

        });

        const payload = {
            id: '_afct_active_subregions',
            data: JSON.stringify(subregionSaveData)
        }

        try {

            const response = await fetch(admin.apiBase + '/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw Error(response.statusText);
            }

            const data = await response.json();

        } catch (error) {
            
            console.error(error);

        }

    }

    // to add saved regions and subregions to map, ensuring their styles if needed
    useEffect(() => {

        //console.log("saved regions", activeRegions)
        //console.log("saved subregions", activeSubregions)

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

        if (!init) {

            console.log("activeRegions allowed save");
            setAllowSave(true);

        }
        

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

                    const featureIsActive = importedSubregions.some(subregion => Number(subregion.geoid) === Number(geoid));
                    

                    if (featureIsActive) {

                        const activeSubregionBranch = importedSubregions.find(subregion => Number(subregion.geoid) === Number(geoid))?.branch;

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

                    layer.on('mouseover', () => {

                        if (layer.branch) {

                            setSubregionHover(layer.branch);

                        }

                    });

                    layer.on('mouseout', () => {

                        setSubregionHover(null);

                    });

                    layer.bindTooltip(hoverTooltip);

                    mapRef.current.on('zoomstart', () => {
                     
                        layer.unbindTooltip();
                        
                    })

                    mapRef.current.on('zoomend', () => {

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

                        if (zoom > 7) {

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
                    fillOpacity: .75,
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

        if (!init) {

            //console.log("activeSubregions allowed save");
            //setAllowSave(true);

        }

    }, [activeSubregions])

    useEffect(() => {
        
        if (legendKeyClicked !== null && activeSubregions.length) {

            activeSubregions.forEach(subregion => {

                setSubregion(subregion);
                setIsClicked(true);

            });

        }
        
    }, [legendKeyClicked])

    useEffect(() => {

        console.log("on activeSelection change");
        
        const activeSelectionEmpty = activeSelection.length === 0;

        if (!activeSelectionEmpty) {

            activeSelection.forEach(subregion => {

                if (subregion.branch) {

                    console.log("subregion has branch")
                    const branch = branchesAlt[subregion.branch];

                    if (Number(branch) === 6) {

                        const style = branch.activeStyle;

                        subregion.setStyle(style);

                    } else {

                        const style = branch.style;

                        style.opacity = 1;
                        style.fillOpacity = 1;

                        subregion.setStyle(style);
                    }

                } else {

                    console.log("subregion has no branch")

                    subregion.setStyle({
                        opacity: 1,
                        fillOpacity: 1,
                    })

                }

            });

        } else if (activeSubregions.length) {

            // reset styles on all map layers
            mapRef.current.eachLayer(layer => {

                // if layer is a subregion,
                // determined by checking if layer.options._afct_id starts with 'subregion-'
                // reset style to default, if no branch,
                // or to branch style if branch is set
                if (layer.options._afct_id) {

                    if (layer.options._afct_id.startsWith('subregion-')) {

                        const subregion = layer;

                        if (subregion.branch) {

                            const branch = branchesAlt[subregion.branch];

                            const style = branch.style;

                            style.opacity = .25;
                            style.fillOpacity = .25;

                            if (Number(branch) === 6) {

                                console.log("branch 6 should get active style")
                                const tempStyle = branch.activeStyle;

                                subregion.setStyle(tempStyle);

                            } else {

                                subregion.setStyle(style);

                            }

                        } else {

                            subregion.setStyle({
                                opacity: .25,
                                fillOpacity: .25,
                            })

                        }

                    }

                }

            });

        }
        
    }, [activeSelection])

    useEffect(() => {
        
        if (allowSave) {

            //console.log("save allowed confirmed");

            //saveActiveRegions();
            //saveActiveSubregions();

            //setAllowSave(false);

        }
        
    }, [allowSave])

}

export default MapProcessor;