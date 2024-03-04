import { Button } from '@wordpress/components';
import { 
    useContext,
    useState,
    useEffect
} from '@wordpress/element';

import { MapContext } from './MapContext';

import cityData from '../assets/citydata.json';

const SaveButton = () => {

    const { 
        activeSubregions, 
        activeRegions,
        mapRef,
    } = useContext(MapContext);

    const [ branchGroups, setBranchGroups ] = useState([]);

    const saveApiRoute = admin.apiBase + '/save';

    const saveData = async (data, key) => { 
        const payload = {
            id: key,
            data: data
        }

        try {
            const response = await fetch(saveApiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Error saving map in try:', response);
            }

            const responseData = await response.json();
        } catch (error) {
            console.error('Error saving map:', error);
        }
    };

    const collectRegionsInServiceAreas = () => {

        mapRef.current.eachLayer((layer) => {

            if (layer.branch) {

                const branchGroup = branchGroups.find(group => group.branch === layer.branch);

                if (branchGroup) {

                    branchGroup.subregions.push(layer);

                } else {

                    branchGroups.push({
                        branch: layer.branch,
                        subregions: [layer],
                    });

                }

            }
            
        });

        setBranchGroups(branchGroups);
        
    }

    const handleClick = async () => {

        const newBranchGroups = [];
        const branchCities    = [];
        mapRef.current.eachLayer((layer) => {

            if (layer.branch) {

                const branchGroup = newBranchGroups.find(group => group.branch === layer.branch);

                if (branchGroup) {

                    branchGroup.subregions.push(layer);

                } else {

                    newBranchGroups.push({
                        branch: layer.branch,
                        subregions: [layer]
                    });

                }

            }

        });

        newBranchGroups.forEach(group => {

            let groupFeatures = [];

            group.subregions.forEach(subregion => {
                groupFeatures.push(subregion.feature);
            });

            let featureCollection  = turf.featureCollection(groupFeatures);
            let combinedFeature    = turf.combine(featureCollection);
            let featureMask        = turf.mask(combinedFeature);
            let featurePolygon     = turf.polygon([featureMask.geometry.coordinates[1]]);
            let citiesInBranchArea = turf.pointsWithinPolygon(cityData, featurePolygon);

            branchCities.push({
                branch: group.branch,
                cities: citiesInBranchArea,
            });

        });

        const subregions = [];
        activeSubregions.forEach(subregion => {
            const data = {
                _afct_id: subregion.options._afct_id,
                branch: subregion.branch,
                geoid: subregion.feature.properties.GEOID,
                restrictions: subregion.options.restrictions,
                restrictionDetails: subregion.options.restrictionDetails,
            }
            console.log("subregion data", data);
            subregions.push(data);
        });

        saveData(JSON.stringify(activeRegions), '_afct_active_regions');
        saveData(JSON.stringify(subregions), '_afct_active_subregions');
        saveData(JSON.stringify(branchCities), '_afct_branch_cities');
        // testing to see how data gets saved, if I save the whole map....
        // create LayerGroup to contain all current layers on mapRef
        // var layerGroup = L.layerGroup();
        // mapRef.current.eachLayer(function(layer) {
        //     layerGroup.addLayer(layer);
        // });
        // prep layerGroup for saving
        // var savableLayerGroup = layerGroup.toGeoJSON();
        // saveData(layerGroup, '_afct_map_layers');
    };

    useEffect(() => {
        console.log(branchGroups)
    }, [branchGroups])

    return (
        <Button 
            variant="primary"
            onClick={ handleClick }
        >
            Save Map
        </Button>
    );

};

export default SaveButton;