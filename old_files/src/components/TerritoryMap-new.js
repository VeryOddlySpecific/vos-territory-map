import { useState, useEffect, useRef } from '@wordpress/element';
import StateSelector from './StateSelector';
import CountyCard from './CountyCard-new';
import { createRoot } from 'react-dom';
import fips from '../includes/admin/fips.json';
import branchStyles from '../includes/admin/branch-styles.json';

export default function TerritoryMap() {

    // set a county list by iterating through all arrays in admin.servAreas
    // and adding the geoid to the county list
    // then use the county list to create the map

    const countyList = [];
    for (const servArea in admin.servAreas) {

        
        if (admin.servAreas[servArea] === null) continue;

        var geoids = admin.servAreas[servArea];

        geoids.forEach(geoid => {
            countyList.push(geoid + '_' + servArea);
        });

    }

    const mapRef = useRef(null);
    const [states, setStates] = useState(admin.states);
    const [stateSet, setStateSet] = useState([]); // set of states
    const [counties, setCounties] = useState(countyList);
    const [county, setCounty] = useState(null);
    const [cardRoot, setCardRoot] = useState(createRoot(document.getElementById('county-card')));
    const [stateSelectRoot, setStateSelectRoot] = useState(createRoot(document.getElementById('afct-state-select')));
    const [formData, setFormData] = useState(null);

    const [leafletLayers, setLeafletLayers] = useState([]);


    /******* vv TESTING AREA vv ************/
    
    const [selectedStates, setSelectedStates] = useState(admin.states);
    const [mapStates, setMapStates] = useState([]);

    const [multiSelect, setMultiSelect] = useState([]);

    /******* ^^ TESTING AREA ^^ ************/

    // useEffect run once to initialize map

    useEffect(() => {
        mapRef.current = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            minZoom: 4,
            zoomControl: false
        });

        if (admin.states.length === 0) return;
        
        states.forEach(state => {

            if (states.length === 1) {
                setStates([state]);
            } else {
                setStates((prevStates) => [...prevStates, state]);
            }


            addStateLayer(state);
            addStateInput(state);
        });

        /***** Service Area Color Legend *****/
        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
            labels = [];
            
            // for each property in branchStyles object as 
            //     prop = service area
            //     branchStyles[prop] = style object
            //     branchStyles[prop].color = color
            
            for (const prop in branchStyles) {
                // make prop easily readable and capitalize each word
                var newProp = capitalizeWordsAndReplaceHyphen(prop);
                labels.push('<span><i style="display:block;height:.8rem;width:.8rem;background:' + branchStyles[prop].color + '"></i> ' + newProp + '</span>');
            }

            labels.forEach(label => {
                div.innerHTML += label + '<br>';
            });

            return div;

        }

        legend.addTo(mapRef.current);

        
        stateSelectRoot.render(<StateSelector states={states} updateStates={setStates} />);

    }, []);

    useEffect(() => {
        stateSelectRoot.render(<StateSelector states={states} updateStates={setStates} />);

        // if states and mapStates are the same, do nothing
        if (Array.isArray(states) && Array.isArray(mapStates)) {
            if (arraysEqual(states, mapStates)) return;
        }
        
        // if states is empty, remove all state layers from map
        if (states.length === 0) {
            mapRef.current.eachLayer(layer => {
                if (layer.feature) {
                    mapRef.current.removeLayer(layer);
                    var hiddenInput = document.getElementById('input-' + layer.feature.properties.GEOID);
                    if (hiddenInput) {
                        hiddenInput.remove();
                    }
                }
            });
            return;
        }

        // if there are states in states that are not in mapStates
        //     add that state layer to the map
        //     add that state to mapStates
        states.forEach(state => {
            if (!mapStates.includes(state)) {
                addStateLayer(state);
                addStateInput(state);
                setMapStates((prevStates) => [...prevStates, state]);
            }
        });

        // if there are states in mapStates that are not in states
        //     remove that state layer from the map
        //     remove that state from mapStates
        mapStates.forEach(state => {
            if (!states.includes(state)) {
                removeStateLayer(state);
                removeStateInput(state);
                setMapStates(mapStates.filter(item => item !== state));
            }
        });
        
    }, [states])
    
   useEffect(() => {
        if (!county) return;

        const mapDiv = document.getElementById('territory-map');

        var countyInput = document.getElementById('input-' + county.GEOID);
        if (countyInput) {
            countyInput.name = county.serviceArea + '[]';
        } else {
            countyInput = document.createElement('input');
            countyInput.setAttribute('type', 'hidden');
            countyInput.setAttribute('name', county.serviceArea + '[]');
            countyInput.setAttribute('value', county.GEOID);
            countyInput.setAttribute('id', 'input-' + county.GEOID);
            mapDiv.appendChild(countyInput);
        }
        
        cardRoot.render(<CountyCard county={county} updateCounty={setCounty} />);
    
    }, [county]);

    useEffect(() => {

        if (counties.length === 0) return;

        // loop through counties array
        // counties is an object with each property as the service area, and the value is an array containing the service area's geoids

        


        /*
        counties.forEach(county => {
            if (county.target) {
                console.log("county", county);
                var tempCounty = {
                    serviceArea: county.serviceArea,
                    geoid: county.GEOID
                };

                if (formData) {

                    formData.forEach((obj, index) => {
                        
                        if (obj.geoid === county.GEOID && obj.serviceArea !== county.serviceArea) {
                            setFormData((prevFormData) => {
                                const newFormData = [...prevFormData];
                                newFormData[index] = tempCounty;
                                return newFormData;
                            });
                        } else {
                            setFormData((prevFormData) => {
                                return [...prevFormData, tempCounty];
                            });
                        }
                    });
                } else {
                    setFormData([tempCounty]);
                }                             
            }
        });
        */

    }, [counties]);

    useEffect(() => {

        var hiddenInput = document.getElementById('county-form-data');
        hiddenInput.value = JSON.stringify(formData);

    }, [formData]);

    const addStateLayer = (state) => {
        
        const apiRoute = admin.apiBase + 'state/' + state;

        fetch(apiRoute)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            var stateData = turf.combine(data);
            var stateShape = turf.convex(
                stateData,
                {
                    concavity: 3
                });

            L.geoJson(stateShape, {
                style: {
                    "color": "#0a1944",
                    "fillColor": "transparent",
                    "weight": 4,
                    "opacity": 1
                }
            }).addTo(mapRef.current);


            
            L.geoJson(data, {
                style: {
                    "color": "#0a1944",
                    "weight": 1,
                    "opacity": 0.65
                },
                onEachFeature: function (feature, layer) {

                    
                    var layerData = {
                        layerId: layer._leaflet_id,
                        state: feature.properties.STATEFP,
                        geoid: feature.properties.GEOID
                    }
                    if (leafletLayers.length > 0) {
                        setLeafletLayers((prevLayers) => [...prevLayers, layerData]);
                    }

                    var props = feature.properties;

                    if(counties.length > 0) {
                        counties.forEach(county => {
                            const countyProps = county.split('_');
                            const geoid = countyProps[0];
                            const cServiceArea = countyProps[1];
                            if (geoid === props.GEOID) {
                                const style = branchStyles[cServiceArea];
                                layer.setStyle(style);
                                const mapDiv = document.getElementById('territory-map');

                                var countyInput = document.getElementById('input-' + geoid);
                                if (countyInput) {
                                    countyInput.name = cServiceArea + '[]';
                                } else {
                                    countyInput = document.createElement('input');
                                    countyInput.setAttribute('type', 'hidden');
                                    countyInput.setAttribute('name', cServiceArea + '[]');
                                    countyInput.setAttribute('value', geoid);
                                    countyInput.setAttribute('id', 'input-' + geoid);
                                    mapDiv.appendChild(countyInput);
                                }
                            }
                        })
                    }

                    var props = feature.properties;
                    
                    layer.on('click', function (e) {

                        props.target = e.target;

                        if (e.originalEvent.ctrlKey) {
                            if (multiSelect.length === 0) {
                                setMultiSelect(props);
                            } else {
                                setMultiSelect((prevMultiSelect) => [...prevMultiSelect, props]);
                            }
                        } else {
                            setMultiSelect([]);
                            setCounty(props);
                        }
                        console.log("multiSelect", multiSelect);
                        
                        // set up logic to allow for multiple counties to be selected
                        // if county is already selected, remove it from counties array
                        // if county is not selected, add it to counties array
                        
                    });

                    layer.bindTooltip(
                        props.Name + ' County, ' + fips[props.STATEFP],
                        {
                            interactive: true,
                            closeButton: false,
                        }
                    )
                }
            }).addTo(mapRef.current);
            
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    const removeStateLayer = (state) => {

        console.log(mapRef.current);
        mapRef.current.eachLayer(layer => {            
            // if layer has feature property and feature.properties.STATEFP === state
            if(layer.feature && layer.feature.properties.STATEFP === state) {
                mapRef.current.removeLayer(layer);
                var hiddenInput = document.getElementById('input-' + layer.feature.properties.GEOID);
                if (hiddenInput) {
                    hiddenInput.remove();
                }
            }
        });

    }

    const addStateInput = (state) => {
        var stateHiddenInput = document.getElementById('input-' + state);

        if (stateHiddenInput) {
            stateHiddenInput.name = 'stateSelection[]';
        } else {
            stateHiddenInput = document.createElement('input');
            stateHiddenInput.setAttribute('type', 'hidden');
            stateHiddenInput.setAttribute('name', 'stateSelection[]');
            stateHiddenInput.setAttribute('value', state);
            stateHiddenInput.setAttribute('id', 'input-' + state);
            const mapDiv = document.getElementById('territory-map');
            mapDiv.appendChild(stateHiddenInput);
        }

    }

    const removeStateInput = (state) => {
        var stateHiddenInput = document.getElementById('input-' + state);

        if (stateHiddenInput) {
            stateHiddenInput.remove();
        }
    }

    const clearMultiSelect = () => {
        multiSelect.forEach(county => {
            county.target.setStyle({
                "color": "#0a1944",
                "weight": 1,
                "opacity": 0.65
            });
        });
    }

    function arraysEqual(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    function capitalizeWordsAndReplaceHyphen(str) {
        // replace hypens with spaces
        str = str.replace(/-/g, ' ');

        // capitalize each word
        str = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        return str;
    }
}