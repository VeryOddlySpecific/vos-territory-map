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

    const addStates = (statesToAdd) => {

        if (statesToAdd.length) {

            statesToAdd.forEach((state) => {

                const stateJson = admin.apiBaseUrl + 'state/' + state + '.json';

                // fetch api response from stateJson

                console.log("stateJson", stateJson);

                const stateLayer = L.geoJSON(
                    stateJson,
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

    const removeStates = (statesToRemove) => {

        if (statesToRemove.length) {

            statesToRemove.forEach((state) => {

                const stateLayer = stateLayers.getLayers().filter((layer) => layer.feature.properties.STATE === state)[0];

                stateLayers.removeLayer(stateLayer);

            });

        }

    };

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

        if (states) {

            console.log("states", states);

            const stateFips = states.map((state) => state.fips);

            const stateLayersFips = stateLayers.getLayers().map((layer) => layer.feature.properties.STATE);

            const statesToAdd = stateFips.filter((fips) => !stateLayersFips.includes(fips));

            const statesToRemove = stateLayersFips.filter((fips) => !stateFips.includes(fips));

            addStates(statesToAdd);
            removeStates(statesToRemove);

        }

    }, [states]);

    useEffect(() => {

        if (counties) {

            const geoids = counties.map((county) => county.properties.GEOID);

            const countyLayersGeoids = countyLayers.getLayers().map((layer) => layer.feature.properties.GEOID);

            const countiesToAdd = geoids.filter((geoid) => !countyLayersGeoids.includes(geoid));

            const countiesToRemove = countyLayersGeoids.filter((geoid) => !geoids.includes(geoid));

            addCounties(countiesToAdd);
            removeCounties(countiesToRemove);

        }

    }, [counties]);

    useEffect(() => {

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
        
        countyCardRoot.render(<CountyCard countySelection={countySelection} updateCountySelection={setCountySelection} />);

    }, [countySelection]);
}