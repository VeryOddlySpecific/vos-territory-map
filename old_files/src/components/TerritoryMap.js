import { useState, useEffect } from '@wordpress/element';
import CountyCard from './CountyCard-alt';
import { createRoot } from 'react-dom';
import branchStyles from '../includes/admin/branch-styles.json';
import fips from '../includes/admin/fips.json';

export default function TerritoryMap() {

    const [states, setStates] = useState(admin.states);
    const [counties, setCounties] = useState(admin.counties);
    const [county, setCounty] = useState(null);
    const [style, setStyle] = useState('');

    

    useEffect(() => {
        var map = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            minZoom: 4,
            zoomControl: false
        });

        // set up states with all their features
        states.forEach(state => {
            addStateLayer(state, map);
        });

        const cardContainer = document.getElementById('county-card');
        const cardRoot = createRoot(cardContainer);

        cardRoot.render(<CountyCard county={county} updateCounty={setCounty} updateCounties={setCounties} />);
        
    }, []);

    /*
    useEffect(() => {
        const cardContainer = document.getElementById('county-card');
        const cardRoot = createRoot(cardContainer);

        cardRoot.render(<CountyCard county={county} updateCounty={setCounty} updateCounties={setCounties} />);
    }, [county, counties]);
    */
    /**
     * I need to figure out how to make sure the county shape layer gets it's style updated
     * when I update the county style in the county card.
     * I think I need to pass the county style to the county card, and then pass it back
     * then, I need to pass the county style to the county shape layer
     * I can target the county shape layer by the GEOID by using the county object
     * to get the GEOID and then use that to target the layer
     * 
     * I may have to add a listener of some kind to the feature layer
     * in order to update the style when the county style changes 
     */

    const addStateLayer = (state, map) => {
        const apiRoute = admin.apiBase + 'state/' + state;

        fetch(apiRoute)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                L.geoJson(data, {
                    onEachFeature: function (feature, layer) {

                        if (counties.includes(feature.properties.GEOID)) {
                            layer.setStyle(style);
                        }

                        layer.on('click', function (e) {
                            setCounty(feature.properties);
                        });
                    }
                }).addTo(map);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };
}