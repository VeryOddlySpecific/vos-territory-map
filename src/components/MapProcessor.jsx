import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"

import branchesAlt from "../assets/branchesAlt.json";

const MapProcessor = () => {
    const importedSubregions = [];
    const importedRegions = [];

    if (admin.subregions) {
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

            const regionShape = turf.convex(turf.combine(data), {concavity: 1});
            const regionShapeLayer = L.geoJson(regionShape, {
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

            const subregionsLayer = L.geoJson(data, {
                onEachFeature: (feature, layer) => {
                    const featureIsActive = importedSubregions.some(subregion => Number(subregion.geoid) === Number(feature.properties.GEOID));
                    if (featureIsActive) {
                        const fGeoid = feature.properties.GEOID;
                        const fBranch = importedSubregions.find(subregion => Number(subregion.geoid) === Number(fGeoid)).branch;
                        const fStyle = branchesAlt[fBranch].style;

                        layer.setStyle(fStyle);
                        layer.branch = fBranch;
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
                            layer.bindTooltip(
                                feature.properties.Name + ' County',
                                {
                                    permanent: false,
                                    direction: 'center',
                                }
                            );
                        }
                    });

                    /*
                    const hoverTooltip = L.tooltip({
                        content: feature.properties.Name + ' County',
                        permanent: false,
                        direction: center,
                        opacity: .9
                    })
                    const permaTooltip = L.tooltip({
                        content: feature.properties.Name + ' County',
                        permanent: true,
                        direction: center,
                        opacity: .9
                    })

                    mapRef.current.on('zoomstart', () => {
                        layer.unbindTooltip();
                    });

                    mapRef.current.on('zoomend', () => {
                        layer.unbindTooltip();
                        const zoom = mapRef.current.getZoom();
                        if (zoom > 7) {
                            layer.bindTooltip(permaTooltip);
                        } else {
                            layer.bindTooltip(hoverTooltip);
                        }
                    });
                    */

                    layer.on('click', (e) => {
                        setSubregion(e.target);
                        setIsClicked(true);
                    });
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

    useEffect(() => {
        initData();
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