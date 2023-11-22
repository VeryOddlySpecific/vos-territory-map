import { useRef, useEffect } from '@wordpress/element';
import branchStyles from '../includes/admin/branch-styles.json';
import fips from '../includes/admin/fips.json';


export default function TerritoryMap() {

    const counties = [];
    for (const serviceArea in publicData.serviceAreas) {

        if (publicData.serviceAreas[serviceArea] === null) continue;

        var geoids = publicData.serviceAreas[serviceArea];

        geoids.forEach(geoid => {
            counties.push(geoid + '_' + serviceArea);
        });

    }

    const mapRef = useRef(null);
    const states = publicData.states;

    useEffect(() => {
        
        mapRef.current = L.map('territory-map', {
            center: [39.8283, -98.5795],
            zoom: 4,
            minZoom: 4,
            zoomControl: false
        });

        states.forEach(state => {
            addStateLayer(state);
        });

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
            labels = [];
            
            for (const prop in branchStyles) {
                var newProp = capitalizeWordsAndReplaceHyphen(prop);
                labels.push('<span><i style="display:block;height:.8rem;width:.8rem;background:' + branchStyles[prop].color + '"></i><p style="color:black;margin-bottom:0;">' + newProp + '</p></span>');
            }

            labels.forEach(label => {
                div.innerHTML += label + '<br>';
            });

            return div;

        }

        legend.addTo(mapRef.current);

    }, []);

    const addStateLayer = (state) => {

        const apiRoute = publicData.apiRoute + 'state/' + state;

        fetch(apiRoute)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            L.geoJson(data, {
                style: {
                    "color": "#0a1944",
                    "weight": 1,
                    "opacity": 0.65
                },
                onEachFeature: function (feature, layer) {

                    var props = feature.properties;
                    var state = props.STATEFP;
                    state = fips[state];

                    layer.bindTooltip(
                        props.Name + ' County, ' + state,
                        {
                            interactive: true,
                            closeButton: false,
                        }
                    );

                    if (counties.length > 0) {
                        
                        counties.forEach(county => {

                            const countyProps = county.split('_');
                            const cGeoid = countyProps[0];
                            const cServiceArea = countyProps[1];

                            if (cGeoid === props.GEOID) {
                                const style = branchStyles[cServiceArea];
                                layer.setStyle(style);
                            }
                        })
                    }
                }
            }).addTo(mapRef.current);

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
                    "weight": 3,
                    "opacity": 1
                }
            }).addTo(mapRef.current);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    function capitalizeWordsAndReplaceHyphen(str) {
        // replace hypens with spaces
        str = str.replace(/-/g, ' ');

        // capitalize each word
        str = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        return str;
    }
}