import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"

import branchesAlt from "../assets/branchesAlt.json";
import allCities from "../assets/citydata.json";

const MapProcessor = () => {
    const importedSubregions = [];
    const importedRegions = [];

    if (admin.subregions && admin.subregions.length > 0) {
        const adminSubregionsData = JSON.parse(admin.subregions);
        adminSubregionsData.forEach(subregion => {
            importedSubregions.push(subregion);
        });
    }

    if (admin.regions) {
        const adminRegionsData = JSON.parse(admin.regions);
        adminRegionsData.forEach(region => {
            importedRegions.push(region);
        });
    }

    const { 
        mapRef, 
        activeRegions, 
        setActiveRegions,
        activeSubregions,
        setActiveSubregions,
        activeSelection, 
        setActiveSelection,
        toggledRegion,
        legendKeyClicked,
        setLegendKeyClicked,
    } = useContext(MapContext);

    const [ mapLayers, setMapLayers ] = useState([]);
    const [ subregion, setSubregion ] = useState(null);
    const [ isClicked, setIsClicked ] = useState(false);
    const [ init, setInit ] = useState(true);
    

    const handleRegionData = async (apiRoute, rFips) => {
        try {
            const response = await fetch(apiRoute);
            const data = await response.json();

            // const savedRegionShape  = await fetch(admin.apiBase + '/region-shape/' + rFips);
            // const savedSubregions   = await fetch(admin.apiBase + '/subregions/' + rFips);

            let combined    = turf.combine(data);
            let regionShape = turf.convex(combined, {concavity: 1});

            const maskPolygon = turf.mask(combined, null);
            let maskPolygonCoords = maskPolygon.geometry.coordinates[1];
            let interiorMaskPolygon = turf.polygon([maskPolygonCoords]);

            const regionShapeLayer = L.geoJson(interiorMaskPolygon, {
                style: {
                    color: '#0a1944',
                    weight: 2,
                    opacity: 1,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                _afct_id: 'shape-' + rFips
            });
            regionShapeLayer.addTo(mapRef.current);

            setActiveRegions((prevActiveRegions) => [...prevActiveRegions, rFips]);
            console.log("geojson data:", data);
            const subregionsLayer = L.geoJson(data, {
                onEachFeature: (feature, layer) => {
                    const featureIsActive = importedSubregions.some(subregion => Number(subregion.geoid) === Number(feature.properties.GEOID));
                    // console.log("imported subregions:", importedSubregions);
                    if (featureIsActive) {
                        // console.log("active Feature:", feature)
                        // if the feature is active, does the feature have restrictions?
                        // this should check saved/imported subregion data to see if it has a property for restrictions
                        const featureHasRestrictions = importedSubregions.find(subregion => Number(subregion.geoid) === Number(feature.properties.GEOID)).restrictions;
                        console.log("does this feature have restrictions?", featureHasRestrictions)
                        const fGeoid = feature.properties.GEOID;
                        const fBranch = importedSubregions.find(subregion => Number(subregion.geoid) === Number(fGeoid)).branch;
                        const fStyle = branchesAlt[fBranch].style;

                        layer.setStyle(fStyle);
                        layer.branch = fBranch;
                        // if feature has restrictions, add red border style
                        if (featureHasRestrictions) {
                            layer.options.restrictions = featureHasRestrictions;
                            layer.options.restrictionDetails = importedSubregions.find(subregion => Number(subregion.geoid) === Number(fGeoid)).restrictionDetails;
                            layer.setStyle({
                                color: '#f00'
                            })
                        }
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

                    const zoom = mapRef.current.getZoom();

                    layer.bindTooltip(
                        feature.properties.Name + ' County',
                        {
                            permanent: false,
                            direction: 'center',
                        }
                    );

                    mapRef.current.on('zoomstart', () => {
                        layer.unbindTooltip();
                    });

                    mapRef.current.on('zoomend', () => {
                        const zoom = mapRef.current.getZoom();
                        if (zoom > 7) {
                            layer.bindTooltip(
                                feature.properties.Name + ' County',
                                {
                                    permanent: true,
                                    direction: 'center',
                                }
                            );
                        } else {
                            //console.log(layer)
                            //console.log(feature)
                            layer.bindTooltip(
                                feature.properties.Name + ' County',
                                {
                                    permanent: false,
                                    direction: 'center',
                                }
                            );
                        }
                    });

                    layer.on('click', (e) => {
                        setSubregion(e.target);
                        setIsClicked(true);
                    });

                    layer.on('baselayerchange', (e) => {
                        console.log(e);
                    });

                    layer.options._afct_sr_name = feature.properties.Name;
                },
                _afct_id: 'subregions-' + rFips,
            });
            subregionsLayer.addTo(mapRef.current);

            setMapLayers((prevMapLayers) => [...prevMapLayers, regionShapeLayer, subregionsLayer]);
        } catch (error) {
            console.error(error);
        }
    
    }

    const initData = () => {
        if (importedRegions.length) {
            importedRegions.forEach(rFips => {
                const apiRoute = admin.apiBase + '/state/' + rFips;
                handleRegionData(apiRoute, rFips);
            });
        }
    }
    
    const altMapSetup = () => {
        if (admin.mapLayers) {
            // parse admin.mapLayers to be json featureCollection
            const mapLayersData = JSON.parse(admin.mapLayers);
            mapLayersData.features.forEach(feature => {
                if (feature.properties.Name === 'Otoe') {
                    console.log("feature:", feature)
                }
                const layer = L.geoJson(feature);
                layer.addTo(mapRef.current);
                // setMapLayers((prevMapLayers) => [...prevMapLayers, layer]);
            });
        }
    }

    

    useEffect(() => {
        L.tileLayer('https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=GXUO6RDrkZ9BfFwKsVIr', {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 19,
        }).addTo(mapRef.current);
        console.log("current admin data object", admin);
        initData();
        // altMapSetup();
        
    }, []);

    useEffect(() => {
        if (subregion && isClicked) {
            const layerIsInActiveSelection = activeSelection.includes(subregion);
            if (!layerIsInActiveSelection) {
                const fBranch = subregion.branch;
                if (fBranch) {
                    const fStyle = branchesAlt[fBranch].activeStyle;
                    subregion.setStyle(fStyle);
                } else {
                    subregion.setStyle({
                        color: '#0a1944',
                        weight: 2,
                        opacity: 1,
                        fillColor: '#fff',
                        fillOpacity: 0.95,
                    })
                }
                setActiveSelection([...activeSelection, subregion]);
            } else {
                const fBranch = subregion.branch;
                if (fBranch) {
                    const fStyle = branchesAlt[fBranch].style;
                    subregion.setStyle(fStyle);
                } else {
                    subregion.setStyle({
                        color: '#0a1944',
                        weight: 1,
                        opacity: .25,
                        fillColor: '#fff',
                        fillOpacity: 0.25,
                    })
                }
                setActiveSelection(activeSelection.filter(item => item !== subregion));
            }

            setIsClicked(false);
        }
    }, [subregion, isClicked]);

    /**
     * useEffect runs on a change in toggledRegion
     * toggledRegion will contain the region code and a boolean value of its active state
     * if the region is active, it will call handleRegionData with the apiRoute and region code
     * if the region is not active, it will:
     *      remove the region shape layer from the map
     *      remove the subregions layers from the map
     *      remove the region code from the activeRegions array
     */
    useEffect(() => {
        if (toggledRegion) {
            if (toggledRegion.active) {
                handleRegionData(admin.apiBase + '/state/' + toggledRegion.fips, toggledRegion.fips);
            } else if (activeRegions.includes(toggledRegion.fips)) {
                const shapeLayer = mapLayers.find(layer => layer.options._afct_id === 'shape-' + toggledRegion.fips);
                const subregionsLayers = mapLayers.filter(layer => layer.options._afct_id === 'subregions-' + toggledRegion.fips);
                mapRef.current.removeLayer(shapeLayer);
                subregionsLayers.forEach(layer => {
                    mapRef.current.removeLayer(layer);
                });
                setActiveRegions(activeRegions.filter(region => region !== toggledRegion.fips));
            }
        }
    }, [toggledRegion])

    /**
     * runs on a change in activeSubregions or legendKeyClicked
     * checks if a legend key was clicked and if there are active subregions
     * if there are active subregions, it will:
     *     loop through the active subregions
     *     if the subregion has a branch and the branch matches the legend key clicked, set the subregion style to the active style
     *     if the subregion has a branch and the branch does not match the legend key clicked, set the subregion style to the default style
     *     if the subregion has no branch, set the subregion style to the default style
     */
    useEffect(() => {
        
        if (legendKeyClicked && activeSubregions.length) {
            const branchSubregions = [];
            activeSubregions.forEach(subregion => {
                if (subregion.branch && subregion.branch === legendKeyClicked) {
                    const branchStyle = branchesAlt[subregion.branch].activeStyle;
                    subregion.setStyle(branchStyle);
                    branchSubregions.push(subregion);
                } else if (subregion.branch) {
                    const branchStyle = branchesAlt[subregion.branch].style;
                    subregion.setStyle(branchStyle);
                } else {
                    subregion.setStyle({
                        color: '#0a1944',
                        weight: 1,
                        opacity: .25,
                        fillColor: '#fff',
                        fillOpacity: 0.25,
                    });
                }
            })
            activeSelection.forEach(subregion => {
                if (!branchSubregions.includes(subregion)) {
                    if (subregion.branch) {
                        const branchStyle = branchesAlt[subregion.branch].style;
                        subregion.setStyle(branchStyle);
                    } else {
                        subregion.setStyle({
                            color: '#0a1944',
                            weight: 1,
                            opacity: .25,
                            fillColor: '#fff',
                            fillOpacity: 0.25,
                        });
                    }
                }   
            })
            setLegendKeyClicked(null);
            setActiveSelection(branchSubregions);
            if (branchSubregions.length) {
                mapRef.current.flyToBounds(branchSubregions.map(subregion => subregion.getBounds()));
            }
        }

    }, [activeSelection, legendKeyClicked])

    
}

export default MapProcessor;