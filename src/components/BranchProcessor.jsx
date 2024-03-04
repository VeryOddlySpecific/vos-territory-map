import Branches from '../assets/branchesAlt.json';
import Cities from '../assets/citydata.json';
import { MapContext } from './MapContext';

import {
    useContext
} from '@wordpress/element';

import {
    Button
} from '@wordpress/components';

const BranchProcessor = () => {

    const {
        activeSubregions
    } = useContext(MapContext);

    // for each branch, get subregions active with that branch
    // for each subregion, get cities within that subregion polygon

    const branchKeys = Object.keys(Branches);

    const saveData = async (data, key) => { 

        let saveApiRoute = admin.apiBase + '/save';
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

    const handleClick = () => {

        console.log("activeSubregions: ", activeSubregions);
        console.log("branchKeys: ", branchKeys);

        branchKeys.forEach(key => {

            let branchSubregions = activeSubregions.filter(subregion => subregion.branch === key);

            branchSubregions.forEach(subregion => {
             
                let subregionCities = turf.pointsWithinPolygon(Cities, subregion.feature);
                
                saveData(JSON.stringify(subregionCities), "_afct_branch_" + key + "_cities");

            })
        })

    }

    return (
        <>
            
        </>
    )

}

export default BranchProcessor;