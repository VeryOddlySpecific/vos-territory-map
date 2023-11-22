import branchStyles from './includes/admin/branch-styles.json';
import CountyCard from './components/CountyCard';
import fips from './includes/admin/fips.json';

import { createRoot } from 'react-dom';
import { useState } from 'react';

document.addEventListener('DOMContentLoaded', function() {

    var map = TerritoryMap(admin.states);

});

/**
 * Sets up the initial map object
 */
const TerritoryMap = (states) => {

    var map = L.map('territory-map', {
        center: [39.8283, -98.5795],
        zoom: 4,
        minZoom: 4,
        zoomControl: false
    });
    
    states.forEach(state => {
        addStateLayer(state, map);
    });

    return map;
}

/**
 * Runs API call to get state data
 * returns object to add to map
 */
const addStateLayer = (state, map) => {
    const apiRoute = admin.apiBase + 'state/' + state;

    return fetch(apiRoute)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            L.geoJson(data, {
                onEachFeature: function (feature, layer) {

                    const style = branchStyles[feature.properties.GEOID];

                    var countyList = admin.counties;

                    if (countyList.includes(feature.properties.GEOID)) {
                        layer.setStyle(style);
                    }

                    layer.on('click', function (e) {
                        showCountyCard(feature.properties, e);
                    });

                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

const showCountyCard = (props, e) => {
    const [countyList, setCountyList] = useState(admin.counties);
    const countyData = {
        name: props.Name,
        geoid: props.GEOID,
        stateName: fips[props.STATEFP],
        target: e.target,
        counties: countyList,
    }
    const container = document.getElementById('county-card');
    const root = createRoot(container);
    root.render(<CountyCard props={countyData} />);
}

const updateCountyList = (county, operation) => {

    const [countyList, setCountyList] = useState(admin.counties);

    switch(operation) {
        case 'add':
            setCountyList((countyList) => [...countyList, county]);
            break;
        case 'remove':
            setCountyList((countyList) => countyList.filter((item) => item.geoid !== county.geoid));
            break;
        case 'update':
            setCountyList((countyList) => countyList.map((item) => item === county ? county : item));
            break;
        default:
            break;
    }
}