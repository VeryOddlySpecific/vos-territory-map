/**
 * External dependencies
 */
import { createRoot } from 'react-dom';

/**
 * WordPress dependencies
 */
import {
    useState,
    useEffect,
    useRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import StateSelector from './StateSelector';
import CountyCard from './CountyCard';
import fips from '../assets/fips.json';
import branches from '../assets/branches.json';

export default function TerritoryMap() {

    const mapRef = useRef();

    // state layers
    const [states, setStates] = useState(admin.states !== '' ? admin.states : []);
    const [stateLayers, setStateLayers] = useState(L.layerGroup());

    // county layers
    const [counties, setCounties] = useState(admin.counties !== '' ? admin.counties : []);
    const [countyLayers, setCountyLayers] = useState(L.layerGroup());

    // county selection
    const [countySelection, setCountySelection] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState({});

    // root elements
    const stateSelectorRoot = createRoot(document.getElementById('state-selector'));
    const countyCardRoot = createRoot(document.getElementById('county-card'));

    const addInitialStates = () => {

        if (states.length) {

            states.forEach((state) => {

                const stateLayer = L.geoJSON(
                    state,
                    {
                        style: {
                            color: '#0a1944',
                            weight: 1,
                            opacity: 1,
                            fillColor: 'transparent',
                            fillOpacity: 0,
                        },
                    }
                );

                setStateLayers((prevStateLayers) => prevStateLayers.addLayer(stateLayer))

            });

            stateLayers.addTo(mapRef.current);

        }

    };

    const addInitialCounties = () => {

        if (counties.length) {

            counties.forEach((county) => {

                const countyLayer = L.geoJSON(
                    county,
                    {
                        style: {
                            color: '#0a1944',
                            weight: 1,
                            opacity: 1,
                            fillColor: 'transparent',
                            fillOpacity: 0,
                        },
                    }
                );

                setCountyLayers((prevCountyLayers) => prevCountyLayers.addLayer(countyLayer))

            });

            countyLayers.addTo(mapRef.current);

        }

    };

    const addSingleState = (stateToAdd) => {

        const stateApi = admin.apiBase + '/state/' + stateToAdd;

        fetch(stateApi)
            .then(response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();

            })
            .then(stateJson => {

                var stateData = turf.combine(stateJson);

                var stateShape = turf.convex(
                    stateData,
                    {
                        concavity: 1
                    }
                );

                const stateLayer = L.geoJSON(
                    stateShape,
                    {
                        style: {
                            color: '#0a1944',
                            weight: 2,
                            opacity: 1,
                            fillColor: 'transparent',
                            fillOpacity: 0,
                        },
                        fips: stateToAdd
                    },
                );

                const stateCounties = L.geoJSON(
                    stateJson,
                    {
                        onEachFeature: (feature, layer) => {

                            layer.setStyle({
                                color: '#0a1944',
                                weight: 1,
                                opacity: .5,
                                fillColor: 'transparent',
                                fillOpacity: 0,
                            });

                            const stateName = fips.filter((state) => state.fips === feature.properties.STATEFP)[0].name;

                            layer.bindTooltip(
                                feature.properties.Name + ' County, ' + stateName,
                                {
                                    interactive: true
                                }
                            );

                            layer.on('click', (e) => {

                                setSelectedCounty(feature);

                            });
    
                        },
                        state: stateToAdd
                    }
                );

                setStateLayers((prevStateLayers) => prevStateLayers.addLayer(stateLayer));

                setCountyLayers((prevCountyLayers) => prevCountyLayers.addLayer(stateCounties));

            })
            .catch(error => {

                console.error('There has been a problem with your fetch operation:', error);

            });

            stateLayers.addTo(mapRef.current);
            countyLayers.addTo(mapRef.current);

    }

    const removeSingleState = (stateToRemove) => {

        console.log("stateToRemove", stateToRemove);
        console.log("countyLayers", countyLayers.getLayers());
        console.log("stateLayers", stateLayers.getLayers());

        const stateFips = stateToRemove.options.fips;

        const stateLayerToRemove = stateLayers.getLayers().filter((layer) => layer.options.fips === stateFips)[0];

        const countiesLayerToRemove = countyLayers.getLayers().filter((layer) => layer.options.state === stateFips)[0];

        // remove state shape
        stateLayers.removeLayer(stateLayerToRemove);

        // remove state counties
        countyLayers.removeLayer(countiesLayerToRemove);        

    }

    const addCounties = (countiesToAdd) => {

        if (countiesToAdd.length) {

            countiesToAdd.forEach((county) => {

                const countyLayer = L.geoJSON(
                    county,
                    {
                        style: {
                            color: '#0a1944',
                            weight: 1,
                            opacity: 1,
                            fillColor: 'transparent',
                            fillOpacity: 0,
                        },
                    }
                );

                setCountyLayers((prevCountyLayers) => prevCountyLayers.addLayer(countyLayer))

            });

            countyLayers.addTo(mapRef.current);

        }

    }

    const removeCounties = (countiesToRemove) => {

        if (countiesToRemove.length) {

            countiesToRemove.forEach((county) => {

                const countyLayer = countyLayers.getLayers().filter((layer) => layer.feature.properties.GEOID === county)[0];

                countyLayers.removeLayer(countyLayer);

            });

        }

    }

    useEffect(() => {

        mapRef.current = L.map(
            'afc-territory-map',
            {
                center: [39.8283, -98.5795],
                zoom: 4,
                zoomControl: false,
            }
        );

        addInitialStates();
        addInitialCounties();

    }, []);

    useEffect(() => {

        stateSelectorRoot.render(<StateSelector states={states} updateStates={setStates} />);

        if (states.length > stateLayers.getLayers().length) {

            const stateToAdd = states.filter((state) => !stateLayers.getLayers().some((layer) => layer.options.fips === state.fips))[0];

            addSingleState(stateToAdd.fips);

        }

        if (states.length < stateLayers.getLayers().length) {

            const stateToRemove = stateLayers.getLayers().filter((layer) => !states.some((state) => state.fips === layer.options.fips))[0];

            removeSingleState(stateToRemove);

        }       

    }, [states]);

    useEffect(() => {

        if (counties.length > countyLayers.getLayers().length) {

            const geoids = counties.map((county) => county.properties.GEOID);

            const countyLayersGeoids = countyLayers.getLayers().map((layer) => layer.feature.properties.GEOID);

            const countiesToAdd = geoids.filter((geoid) => !countyLayersGeoids.includes(geoid));

            const countiesToRemove = countyLayersGeoids.filter((geoid) => !geoids.includes(geoid));

            addCounties(countiesToAdd);
            removeCounties(countiesToRemove);

        }

    }, [counties]);

    useEffect(() => {

        console.log("countySelection", countySelection);

        countySelection.forEach((county) => {

            const branchStyle = branches.filter((branch) => branch.value === county.branch).style;

            // set county layer style
            // get county layer

            //var countyLayer = countyLayers.getLayers().filter((layer) => layer.feature.properties.GEOID === county.properties.GEOID)[0];

            

            console.log
            console.log("countyLayers", countyLayers.getLayers()[0]._layers);

            Object.keys(countyLayers.getLayers()[0]).forEach((layer) => {

                console.log("layer", layer);

                //layer.setStyle(branchStyle);

            });

            /*
            var countyLayer = countyLayers.getLayers()[0]._layers.filter((layer) => {

                return layer.feature.properties.GEOID === county.properties.GEOID;

                
            
                // setting style for counties with a style property
                //const countiesLayers = layer._layers;

                //console.log("countiesLayers", countiesLayers);

                return countiesLayers.filter((countyLayer) => {
                    
                    return countyLayer.feature.properties.GEOID === county.properties.GEOID;

                });
            });

            countyLayer.setStyle(branchStyle);
            */

        });

        /*
        setCounties((prevCounties) => {

            return prevCounties.map((county) => {

                const countySelectionCounty = countySelection.filter((selectionCounty) => selectionCounty.fips === county.properties.GEOID)[0];

                if (countySelectionCounty) {

                    return {
                        ...county,
                        branch: countySelectionCounty.branch,
                    };

                }

                return county;

            });

        });
        */
        
        countyCardRoot.render(<CountyCard countySelection={countySelection} updateCountySelection={setCountySelection} />);

    }, [countySelection]);

    useEffect(() => {

        if (Object.keys(selectedCounty).length === 0) {
            return;
        }

        if (countySelection.length === 0 ) {

            setCountySelection([selectedCounty]);

        } else {

            const countyInSelection = countySelection.some((county) => county.properties.GEOID === selectedCounty.properties.GEOID);

            if (countyInSelection) {

                setCountySelection((prevCountySelection) => prevCountySelection.filter((county) => county.properties.GEOID !== selectedCounty.properties.GEOID));

            } else {

                setCountySelection((prevCountySelection) => [...prevCountySelection, selectedCounty]);

            }

        }

    }, [selectedCounty]);
}