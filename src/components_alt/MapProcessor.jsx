import {
    useContext,
    useEffect
} from '@wordpress/element';

import { MapContext } from './MapContext';



const MapProcessor = () => {

    const { activeRegions, activeSubregions, activeSelection } = useContext(MapContext);

    const [regionData, setRegionData] = useState({});


    const handleRegionData = (data) => {

        // data is an object with the following properties:
        //     - fips: string
        //     - name: string
        //     - data: object
    
        // set region boundary shape layer

        const tCombined = turf.combine(data.json);
        const tConvex = turf.convex(tCombined, {concavity: 1});
        
        const boundary = L.geoJson(tConvex, {
            style: {
                color: "#0a1944",
                weight: 2,
                opacity: 1,
                fillColor: "transparent",
                fillOpacity: 0
            },
            fips: data.fips,
            name: data.name,   
        });

        const subregions = L.geoJson(data.json, {
            onEachFeature: (feature, layer) => {

                layer.setStyle({
                    color: "#0a1944",
                    weight: 1,
                    opacity: .25,
                    fillColor: "transparent",
                    fillOpacity: 0
                });
                
                layer.on('click', () => {
                   
                    if (activeSelection.length === 0) {

                        setActiveSelection([feature]);

                    } else {

                        const newSelection = [...activeSelection];
                        const selectionIndex = newSelection.findIndex(item => item.properties.fips === feature.properties.fips);

                        if (selectionIndex === -1) {

                            newSelection.push(feature);
                            setActiveSelection(newSelection);

                        } else {

                            newSelection.splice(selectionIndex, 1);
                            setActiveSelection(newSelection);

                        }

                    }
                    
                });

            }

        });
    
        // set region subregion shape layers
    }

    useEffect(() => {

        console.log('activeRegions', activeRegions);
        console.log('activeSubregions', activeSubregions);
        console.log('activeSelection', activeSelection);

    }, [activeRegions, activeSubregions, activeSelection]);

    /**
     * useEffect hook for processing activeRegions
     */
    useEffect(() => {

        // do nothing if activeRegions is empty
        if (activeRegions.length === 0) return;

        // for each active region,
        //     - process region boundary shape
        //     - process region subregion shapes
        activeRegions.forEach(region => {

            const regionFips = region.fips;
            const apiRoute = afct_data.apiBase + '/state/' + regionFips;

            const response = fetch(apiRoute)
            const data = response.json();
            const metaData = {
                fips: regionFips,
                name: region.name,
                json: data
            }

            handleRegionData(metaData);

        });

    }, [activeRegions]);

    /**
     * useEffect hook for processing regionData
     */
    useEffect(() => {

        // do nothing if regionData is empty
        if (Object.keys(regionData).length === 0) return;

        // for each active region,
        //     - process region boundary shape
        //     - process region subregion shapes
        activeRegions.forEach(region => {

            const regionFips = region.fips;
            const apiRoute = afct_data.apiBase + '/state/' + regionFips;

            const response = fetch(apiRoute)
            const data = response.json();

            setRegionData(data);

        });

    }, [regionData]);

    /**
     * useEffect hook for processing activeSubregions
     */

    /**
     * useEffect hook for processing activeSelection
     */

    return null;

}

export default MapProcessor;