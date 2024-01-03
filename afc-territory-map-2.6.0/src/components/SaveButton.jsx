import { Button } from '@wordpress/components';
import { 
    useContext,
} from '@wordpress/element';

import { MapContext } from './MapContext';

const SaveButton = () => {

    const { 
        activeSubregions, 
        activeRegions,
    } = useContext(MapContext);

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

    const handleClick = async () => {

        const subregions = [];
        activeSubregions.forEach(subregion => {
            const data = {
                _afct_id: subregion.options._afct_id,
                branch: subregion.branch,
                geoid: subregion.feature.properties.GEOID
            }

            subregions.push(data);
        });

        saveData(JSON.stringify(activeRegions), '_afct_active_regions');
        saveData(JSON.stringify(subregions), '_afct_active_subregions');
    };

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