import { MapContext } from "./MapContext";

import { 
    useEffect,
    useState,
    useContext,
} from "@wordpress/element"


const MapProcessor = () => {

    // context properties needed
    // map
    // activeRegions
    // selectedSubregion
    const { mapRef, activeRegions, activeSelection, setActiveSelection } = useContext(MapContext);

    const [ region, setRegion ] = useState(null);
    const [ subregion, setSubregion ] = useState(null);

    useEffect(() => {

        //console.log("activeSelection", activeSelection);

    }, [activeRegions, activeSelection]);

    useEffect(() => {

        // add region shape to map
        if (activeRegions.length) {

            activeRegions.forEach(region => {

                // get region shape data
                const apiRoute = admin.apiBase + '/state/' + region;

                fetch(apiRoute)
                .then(response => response.json())
                .then(data => {

                    setRegion([data, region]);

                });

            });

        }

    }, [activeRegions]);

    useEffect(() => {
        
        if (region) {

            const json = region[0];
            const fips = region[1];

            const shape = turf.convex(turf.combine(json), {concavity: 1});
            
            L.geoJson(shape, {
                style: {
                    color: '#0a1944',
                    weight: 2,
                    opacity: 1,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                fips: fips,
            }).addTo(mapRef.current);

            L.geoJson(json, {
                onEachFeature: (feature, layer) => {

                    layer.setStyle({
                        color: '#0a1944',
                        weight: 1,
                        opacity: .25,
                        fillColor: '#fff',
                        fillOpacity: 0.25,
                    });

                    layer.on('click', (e) => {

                        setSubregion(e.target);

                    })

                }
            }).addTo(mapRef.current);

        }
        
    }, [region]);

    useEffect(() => {

        if (subregion) {

            //console.log("subregion", subregion);

            // add subregion to activeSelection
            if (!activeSelection.includes(subregion)) {

                subregion.setStyle({
                    opacity: 1,
                    fillOpacity: .5
                })

                setActiveSelection([...activeSelection, subregion]);

            } else {

                subregion.setStyle({
                    opacity: .25,
                    fillOpacity: .25
                })

                setActiveSelection(activeSelection.filter(item => item !== subregion));

            }

        }
        
        
        
    }, [subregion]);

}

export default MapProcessor;