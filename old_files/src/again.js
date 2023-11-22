/**
 * External dependencies
 */
import { 
    useState,
    useEffect
 } from '@wordpress/element';

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import CountyCard from './components/CountyCard';
import fips from './includes/admin/fips.json';
import styles from './includes/admin/branch-styles.json';

document.addEventListener('DOMContentLoaded', function() {
    
    var map = L.map('territory-map', {
        center: [38.164, -94.293],
        zoom: 3.75,
        zoomControl: false
    });

    const TerritoryMap = (adminStates, apiBase, map) => {

        const [states, setStates] = useState(adminStates);
    
        states.forEach(state => {
            var apiRoute = apiBase  + 'state/' + state;
            addStateLayer(apiRoute, map);
        });
    
    }
    
    TerritoryMap(admin.states, admin.apiBase, map);

});




function addStateLayer(apiRoute, map) {
    
        $.getJSON(apiRoute, function(data) {
            //console.log(data);
    
            L.geoJson(data, {
    
                onEachFeature: function(feature, layer) {
                    var inactive = {
                        "color": "#0a1944",
                        "weight": 1,
                        "opacity": 0.65
                    }

                    counties.forEach(county => {
                        if (county.geoid === feature.properties.GEOID) {
                            const style = styles[county.serviceArea];
                            layer.setStyle(style);
                        } else {
                            layer.setStyle(inactive);
                        }
                    });                    
    
                    layer.on('click', function(e) {
                        showCountyCard(map, feature.properties, e);
                    });
    
                }
    
            }).addTo(map);
    
        });
}




/*

jQuery(document).ready(function($) { 

    var map = L.map('territory-map', {
        center: [38.164, -94.293],
        zoom: 3.75,
        zoomControl: false
    });

    //const [counties, setCounties] = useState(admin.counties);
    const [states, setStates] = useState(admin.states);   
    
    TerritoryMap(states, admin.apiBase, map);









    var map = L.map('territory-map', {
        center: [38.164, -94.293],
        zoom: 3.75,
        zoomControl: false
    });

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

    function addStateLayer(state) {

        const apiRoute = admin.apiBase  + 'state/' + state;
    
        $.getJSON(apiRoute, function(data) {
            //console.log(data);
    
            L.geoJson(data, {
    
                onEachFeature: function(feature, layer) {

                    layer.setStyle(inactive);
    
                    layer.on('click', function(e) {
                        showCountyCard(map, feature.properties, e);
                    });
    
                }
    
            }).addTo(map);
    
        });
    
    };
    
    const showCountyCard = (map, props, e) => {
    
        const countyData = {
            name: props.Name,
            geoid: props.GEOID,
            stateName: fips[props.STATEFP],
            target: e.target,
            countyList: counties,
            map: map,
        }
    
        //ReactDOM.render(<CountyCard countyData={countyData} onUpdateCounties={updateCountyList} />, document.getElementById('county-card'));
    
        const countyCard = document.getElementById('county-card');
        const cardRoot = createRoot(countyCard);
        cardRoot.render(<CountyCard countyData={countyData} onUpdateCounties={updateCountyList} />);
    };
    
    const updateCountyList = (newList) => {
        setCounties(newList);
    };
    
    const TerritoryMap = () => {
    
        const apiBase = admin.apiBase;
    
        const initCounties = admin.counties || [];
        const initStates = admin.states || [];
    
        const [counties, setCounties] = useState(initCounties);
        const [states, setStates] = useState(initStates);
    
        

        states.forEach(state => {
            addStateLayer(state);
            console.log(state + " added");
        });
        
    };    

    const container = document.getElementById('territory-map');
    const root = createRoot(container);
    root.render(<TerritoryMap />);

});

*/