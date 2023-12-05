import { Button } from '@wordpress/components';
import { useContext } from '@wordpress/element';

import { MapContext } from './MapContext';

const SaveButton = () => {

    const { activeSubregions, activeRegions } = useContext(MapContext);

    const handleClick = async () => {

        const saveApiRoute = admin.apiBase + '/save';

        console.log("activeRegions:", activeRegions);
        console.log("activeSubregions:", activeSubregions);
        console.log("saveApiRoute:", saveApiRoute);

        const subregionsToSave = [];

        activeSubregions.forEach((subregion) => {

            const subregionData = {
                geoid: subregion.feature.properties.GEOID,
                branch: subregion.branch
            };

            subregionsToSave.push(subregionData);

        });

        const bodyToSave = JSON.stringify({ activeRegions, subregionsToSave });

        console.log("bodyToSave:", bodyToSave);

        try {

            const response = await fetch(saveApiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyToSave,
            });

            if (!response.ok) {

                throw new Error('Network response was not ok');

            }

            const responseData = await response.json();

            console.log('Save successful:', responseData);

        } catch (error) {

            console.error('Error saving map:', error);

        }

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