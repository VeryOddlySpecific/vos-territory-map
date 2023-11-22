import CountyCard from './components/CountyCard';
import fips from "../includes/admin/fips.json";
import branchColors from '../includes/admin/branch-styles.json'

import { useState } from '@wordpress/element';

import ReactDOM from 'react-dom';



jQuery(document).ready(function($) {

    const states        = admin.states;
    const stateRoute    = admin.apiStateRoute;
    const counties      = admin.counties;

    const [countyList, setCountyList] = useState([]);

    const updateCountyList = (newList) => {
        setCountyList(newList);
    }

    const mtKey         = 'RrIsupW29VxPrqmtF2YA';

    var $stateInputs    = $('input[name="selectedStates[]"]');

    var card = document.createElement('div');
    card.id = 'county-detail-card';
    card.className = 'county-card';
    
    var parent = document.getElementById('territory-map').parentNode;
    parent.appendChild(card);

    var active = {
        "color": "#d12224",
        "weight": 2,
        "opacity": 0.65
    }

    var inactive = {
        "color": "#0a1944",
        "weight": 1,
        "opacity": 0.65
    }

    var map = L.map('territory-map', {
        center: [38.164, -94.293],
        zoom: 3.75,
        zoomControl: false,
    });

    function addCountyInput(geoid) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selectedCounties[]';
        input.id = 'input-' + geoid;
        //input.value = geoid;
        document.getElementById('territory-map').appendChild(input);
    }
    
    var selectedStates = [];

    function addStateLayer(state) {
        var apiRoute = stateRoute + state;

        $.getJSON(apiRoute, function( newData ) {
            
            L.geoJson(newData, {
                style: inactive,
                
                onEachFeature: function (feature, layer) {
                    // give each feature a unique id of the GEOID
                    // ensure that the html element id is the same
                    // as the GEOID

                    layer.id = feature.properties.GEOID;
                    feature.id = feature.properties.GEOID;


                    var allCountySelector = document.getElementById('select-all-' + state);

                    var geoid = feature.properties.GEOID;
                    var propertyName = 'No Name';

                    layer.GEOID = geoid;

                    if (feature.properties.hasOwnProperty('Name')) {
                        propertyName = feature.properties.Name;
                    }

                    if (counties.includes(geoid)) {
                        layer.selected = true;
                        layer.setStyle(active);
                        addCountyInput(geoid);
                    }

                    layer.bindTooltip(
                        propertyName, 
                        {
                            interactive: true,
                            closeButton: false
                        }
                    );

                    layer.on('click', function (e) {

                        // show county card
                        showCountyCard(feature.properties, this);
                    });

                    allCountySelector.addEventListener('change', function() {
                        if ($(this).is(':checked')) {
                            layer.setStyle(active);
                            layer.selected = true;
                            addCountyInput(geoid);
                        } else {
                            layer.setStyle(inactive);
                            layer.selected = false;
                            removeCountyInput(geoid);
                        }
                    });
                }

            }).addTo(map);

        });
    }

    /**
     * 
     * @param {*} props 
     * @param {*} layer 
     */
    function showCountyCard(props, layer) {
        const countyData = {
            name: props.Name,
            stateId: props.STATEFP,
            countyId: props.COUNTYFP,
            stateName: fips[props.STATEFP],
            target: layer,
            list: countyList
        }

        ReactDOM.render(<CountyCard countyData={countyData} onUpdateList={updateCountyList} />, card);
    }

    function removeStateLayer(state) {}

    $stateInputs.each(function() {
        var val = $(this).val();

        if (states.includes(val)) {
            $(this).prop('checked', true);
            selectedStates.push(val);
        }

        // add state layers for checked states
        
        $(this).on('change', function() {
            var state = $(this).val();

            if ($(this).is(':checked')) {
                addStateLayer(state);
                addSelectAllElement(state);
            } else {
                removeStateLayer(state);
                removeSelectAllElement(state);
            }
        });
    });

    selectedStates.forEach(function(state) {
        addStateLayer(state);
        addSelectAllElement(state);
    });

    function addSelectAllElement(state) {

        var newElement = document.createElement('input');
        newElement.type = 'checkbox';
        newElement.name = 'selectAll';
        newElement.id = 'select-all-' + state;
        newElement.value = 'all';
        newElement.text = 'Select All Counties?';

        document.getElementById('state-' + state).appendChild(newElement);

        // create label for select all element
        var newLabel = document.createElement('label');
        newLabel.htmlFor = 'select-all-' + state;
        newLabel.innerHTML = 'Select All Counties?';

        document.getElementById('state-' + state).appendChild(newLabel);
    }

    function removeSelectAllElement(state) {
        var element = document.getElementById('select-all-' + state);
        element.parentNode.removeChild(element);
    }
});