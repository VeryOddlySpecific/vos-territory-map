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

    /**
     * Unused variables
     * 
     * const [clickedState, setClickedState] = useState({});
     * const [counties, setCounties] = useState(admin.counties !== '' ? admin.counties : []);
     * const [clickedCounty, setClickedCounty] = useState({});
     * 
     */

    const mapRef = useRef();

    const [stateData, setStateData] = useState({});

    
    const [states, setStates] = useState(admin.states !== '' ? admin.states : []);
    const [stateShapes, setStateShapes] = useState([]);    
    const [stateCounties, setStateCounties] = useState([]);
    const [selectedCounties, setSelectedCounties] = useState([]);
    
    const stateSelectorRoot = createRoot(document.getElementById('state-selector'));
    const countyCardRoot = createRoot(document.getElementById('county-card'));

    const updateCountySelection = (county) => {

        console.log("Clicked county GEOID:", county.properties.GEOID);
        console.log("Current countySelection:", countySelection);
        
        const countyId = county.properties.GEOID;
    
        // Check if the county is already in the selection
        const countyIsInSelection = countySelection.some(c => c.properties.GEOID === countyId);
    
        // Update the selection: remove if present, add if not
        setCountySelection(prevSelection => 
            countyIsInSelection
                ? prevSelection.filter(c => c.properties.GEOID !== countyId) // Deselect the county
                : [...prevSelection, county] // Select the county
        );       

    }

    /*
    const getStateData = (stateFips) => {

        const apiRoute = admin.apiBase + '/state/' + stateFips;

        var stateData = [];

        fetch(apiRoute)
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();

        })
        .then(stateJson => {

            const stateData = turf.combine(stateJson);
            const stateBorder = turf.convex(
                stateData,
                {
                    concavity: 1
                }
            );

            const stateShape = L.geoJSON(
                stateBorder,
                {
                    style: {
                        color: '#0a1944',
                        weight: 2,
                        opacity: 1,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                    },
                    state: stateFips
                }
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

                    }
                }
            );

            stateData.push(stateShape);
            stateData.push(stateCounties);

        })
        .catch(error => {

            console.error('There has been a problem with your fetch operation:', error);

        });

        return stateData;

    }
    */

    const addSingleState = (stateToAdd) => {

        const stateApi = admin.apiBase + '/state/' + stateToAdd;

        console.log("going to check stateApi", stateApi);
        fetch(stateApi)
            .then(response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();

            })
            .then(stateJson => {

                console.log("success, stateJson", stateJson);
                var stateData = turf.combine(stateJson);

                var layerShape = turf.convex(
                    stateData,
                    {
                        concavity: 1
                    }
                );

                // stateShape is a layerGroup with a single layer that is the state shape
                const stateShape = L.geoJSON(
                    layerShape,
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

                // stateCounties is a layerGroup with a layer for each county in the state
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

                            layer.on('click', () => {

                                setClickedCounty(feature);

                            });
    
                        },
                        state: stateToAdd
                    }
                );

                // add stateShape to stateLayerGroups array
                // add stateCounties to countyLayerGroups array

                setStateLayerGroups((prevGroups) => [...prevGroups, stateShape]);
                setCountyLayerGroups((prevGroups) => [...prevGroups, stateCounties]);

            })
            .catch(error => {

                console.error('There has been a problem with your fetch operation:', error);

            });

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

    /**
         * const function to get state data object
         */
    const processState = (stateFips, operation = 'add' ) => {

        //const [stateData, setStateData] = useState({});

        //var stateData = {};

        if (operation === 'remove') {

            console.log("stateFips", stateFips);
            console.log("stateShapes", stateShapes);
            console.log("stateCounties", stateCounties);

            const stateShapeToRemove = stateShapes.filter((shape) => shape.options.fips === stateFips)[0];
            const stateCountiesToRemove = stateCounties.filter((counties) => counties.options.fips === stateFips)[0];

            console.log("stateShapeToRemove", stateShapeToRemove);
            console.log("stateCountiesToRemove", stateCountiesToRemove);

            setStateShapes((prevShapes) => prevShapes.filter((shape) => shape.options.fips !== stateFips));
            setStateCounties((prevCounties) => prevCounties.filter((counties) => counties.options.fips !== stateFips));

            mapRef.current.removeLayer(stateShapeToRemove);
            mapRef.current.removeLayer(stateCountiesToRemove);

            return;

        }

        const apiRoute = admin.apiBase + '/state/' + stateFips;
        console.log("apiRoute", apiRoute);

        fetch(apiRoute)
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();

        })
        .then(stateJson => {

            const stateData = turf.combine(stateJson);

            const stateShape = turf.convex(
                stateData,
                {
                    concavity: 1
                }
            );

            const stateCounties = stateJson;

            //stateData.shape = stateShape;
            //stateData.counties = stateCounties;

            setStateData({
                shape: stateShape,
                counties: stateCounties,
                fips: stateFips
            });

        })
        .catch(error => {

            console.error('There has been a problem with your fetch operation:', error);

        });

        //console.log("stateData inside", stateData);

        //return stateData;

    }

    /**
     * const function to update selectedCounties
     */
    const updateSelectedCounties = (county) => {

        setSelectedCounties((prevCounties) => {

            const isSelected = prevCounties.includes(county);

            if (isSelected) {

                return prevCounties.filter((prevCounty) => prevCounty !== county);

            } else {

                return [...prevCounties, county];

            }

        });

    }
    
    /**
     * Stage 1
     * initialize map
     * 
     * no dependencies
     */
    useEffect(() => {

        console.log("map initialized");

        mapRef.current = L.map(
            'afc-territory-map',
            {
                center: [39.8283, -98.5795],
                zoom: 4,
                zoomControl: false,
            }
        );
        
    }, []);

    /**
     * Stage 2
     * add state selector
     * 
     * dependencies: states
     */
    useEffect(() => {

        console.log("states hooked", states);        
        
        stateSelectorRoot.render(<StateSelector states={states} updateStates={setStates} />);
  
        if (states.length === 0) {

            if (stateShapes.length === 0) {

                return;

            }

            stateShapes.forEach((shape) => {

                mapRef.current.removeLayer(shape);

            });

            setStateShapes([]);

            if (stateCounties.length === 0) {

                return;

            }

            stateCounties.forEach((counties) => {

                mapRef.current.removeLayer(counties);

            });

            setStateCounties([]);

        }

        // check if states need to be added
        states.forEach((state) => {

            if (stateShapes.length === 0) {

                processState(state.fips);

            } else {

                const stateOnMap = stateShapes.includes((shape) => shape.options.fips === state.fips);

                if (stateOnMap) {

                    return;

                } else {

                    processState(state.fips);

                }

            }

        });

        // check if states need to be removed
        stateShapes.forEach((shape) => {

            if (states.length === 0) {

                return;

            } 

            // shapeNotSelected is true if shape is not in states
            const shapeNotSelected = states.every((state) => state.fips !== shape.options.fips);

            if (shapeNotSelected) {

                processState(shape.options.fips, 'remove');

            }

        });


    }, [states]);

    useEffect(() => {

        console.log("stateData hooked", stateData);

        const stateShape = L.geoJSON(
            stateData.shape,
            {
                style: {
                    color: '#0a1944',
                    weight: 2,
                    opacity: 1,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                fips: stateData.fips
            },
        );

        const stateCounties = L.geoJSON(
            stateData.counties,
            {
                onEachFeature: (feature, layer) => {

                    layer.setStyle({
                        color: '#0a1944',
                        weight: 1,
                        opacity: .5,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                    });

                    layer.on('click', () => {

                        updateSelectedCounties(feature);

                    });

                },
                fips: stateData.fips
            },
        );

        setStateShapes((prevShapes) => [...prevShapes, stateShape]);
        setStateCounties((prevCounties) => [...prevCounties, stateCounties]);

    }, [stateData]);

    /**
     * Stage 3
     * add county card
     * 
     * dependencies: selectedCounties
     */
    useEffect(() => {

        console.log("selectedCounties hooked", selectedCounties);

        countyCardRoot.render(<CountyCard countySelection={selectedCounties} updateCountySelection={setSelectedCounties} />);

    }, [selectedCounties]);
    
    /**
     * Stage 4
     * add state layers
     * 
     * dependencies: stateShapes
     */
    useEffect(() => {

        console.log("stateShapes hooked", stateShapes);

        // if stateLayerGroups is empty, return

        if (stateShapes.length === 0) {

            return;

        }

        // add state layers to mapRef.current

        stateShapes.forEach((shape) => {

            mapRef.current.addLayer(shape);

        });

    }, [stateShapes]);

    /**
     * Stage 5
     * add county layers
     * 
     * dependencies: stateCounties
     */
    useEffect(() => {

        console.log("stateCounties hooked", stateCounties)

        // if countyLayerGroups is empty, return

        if (stateCounties.length === 0) {

            return;

        }

        // add county layers to mapRef.current

        stateCounties.forEach((county) => {

            mapRef.current.addLayer(county);

        });

    }, [stateCounties]);

    /*
    // useEffect for states
    // this hook is triggered when selected states is updated
    useEffect(() => {
        
        stateSelectorRoot.render(<StateSelector states={states} updateStates={setStates} />);

        // if states is empty, return
        // else add or remove state from stateLayers

        if (states.length === 0) {
            return;
        }

        // iterate through states
        states.forEach((state) => {

            if(stateLayerGroups.length === 0) {

                //console.log("stateLayerGroups is empty: adding state", state.name);
                //addSingleState(state.fips);
                const stateData = getStateData(state.fips);
                console.log("stateData", stateData);

            }

            console.log("state outside if", state);
            console.log("state layer groups", stateLayerGroups);
            // check if each state is in stateLayerGroups
            if (!stateLayerGroups.some((group) => group.options.state === state.fips)) {

                console.log("add triggered for " + state.name);
                // if not, add the state
                //console.log("remove " + state.name);
                addSingleState(state.fips);

            }

        });

        // iterate through stateLayerGroups
        stateLayerGroups.forEach((group) => {

            // check if each stateLayerGroup is in states
            if (!states.some((state) => state.fips === group.options.state)) {

                console.log("remove triggered for " + group.options.state);
                console.log("state", state);
                console.log("group", group);
                // if not, remove the state
                removeSingleState(group);

            }

        });

    }, [states]);

    // useEffect for stateLayerGroups
    useEffect(() => {

        // if stateLayerGroups is empty, return
        // else add stateLayerGroups to mapRef.current

        if (stateLayerGroups.length === 0) {

            return;

        }

        // iterate through stateLayerGroups
        stateLayerGroups.forEach((stateGroup) => {

            // check if each stateLayerGroup is in mapRef.current
            if (!mapRef.current.hasLayer(stateGroup)) {

                // if not, add the stateLayerGroup
                mapRef.current.addLayer(stateGroup);

                // then add the countyLayerGroup
                //console.log("countyGroup", countyGroup);

            }

        });


    }, [stateLayerGroups]);

    // useEffect for countyLayerGroups
    useEffect(() => {

        // if countyLayerGroups is empty, return
        // else add countyLayerGroups to mapRef.current

        if (countyLayerGroups.length === 0) {

            return;

        }

        // iterate through countyLayerGroups
        countyLayerGroups.forEach((countyGroup) => {

            // check if each countyLayerGroup is in mapRef.current
            if (!mapRef.current.hasLayer(countyGroup)) {

                // if not, add the countyLayerGroup
                mapRef.current.addLayer(countyGroup);

            }

        });

    }, [countyLayerGroups]);

    
    // useEffect for countySelection
    useEffect(() => {
        
        countyCardRoot.render(<CountyCard countySelection={countySelection} updateCountySelection={setCountySelection} />);

    }, [countySelection]);

    // useEffect for clickedCounty
    useEffect(() => {

        // if clickedCounty is empty, return
        if (Object.keys(clickedCounty).length === 0) {
            return;
        }
        
        console.log("Clicked county GEOID:", clickedCounty.properties.GEOID);
        console.log("Current countySelection:", countySelection);
        
        const countyId = clickedCounty.properties.GEOID;
    
        // Check if the county is already in the selection
        const countyIsInSelection = countySelection.some(c => c.properties.GEOID === countyId);
    
        // Update the selection: remove if present, add if not
        setCountySelection(prevSelection => 
            countyIsInSelection
                ? prevSelection.filter(c => c.properties.GEOID !== countyId) // Deselect the county
                : [...prevSelection, clickedCounty] // Select the county
        );  
        
    }, [clickedCounty]);

    useEffect(() => {
        
        // if clickedState is empty, return
        if (Object.keys(clickedState).length === 0) {
            return;
        }

        console.log("clickedState", clickedState);

        if (clickedState.active) {

            console.log("clickedState is active");

            // add state to states
            setStates((prevStates) => [...prevStates, clickedState]);

        } else {

            console.log("clickedState is not active");

        }

        // if clickedState is in

    }, [clickedState]);
    */

}