import { Button } from '@wordpress/components';
import { 
    useContext,
    useState,
    useEffect
} from '@wordpress/element';

import { MapContext } from './MapContext';

const SaveButton = () => {

    const { activeSubregions, activeRegions } = useContext(MapContext);

    const [subregionsToSave, setSubregionsToSave] = useState([]);
    const [regionsToSave, setRegionsToSave] = useState([]);

    const [runItems, setRunItems] = useState([]);

    const saveApiRoute = admin.apiBase + '/save';

    const handleClick = async () => {

        //console.log("activeRegions:", activeRegions);
        //console.log("activeSubregions:", activeSubregions);
        //console.log("saveApiRoute:", saveApiRoute);

        setRunItems(['regions', 'subregions']);

        const subregions = [];

        activeSubregions.forEach(subregion => {

            //console.log("subregion:", subregion);

            const subregionData = {
                _afct_id: subregion.options._afct_id,
                branch: subregion.branch,
                geoid: subregion.feature.properties.GEOID
            }

            subregions.push(subregionData);

            setSubregionsToSave(subregions);

        });

        
        setRegionsToSave(activeRegions);
        //setSubregionsToSave(activeSubregions);

    };

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
    
                //console.log('Save successful:', responseData);
            
        } catch (error) {

            console.error('Error saving map:', error);

        }

    };

    
    useEffect(() => {

        if (runItems.includes('subregions')) {

            //console.log("subregionsToSave:", subregionsToSave);

            const bodyToSave = JSON.stringify(subregionsToSave);

            //console.log("subregions bodyToSave:", bodyToSave);

            saveData(bodyToSave, '_afct_active_subregions');

            // remove 'subregions' from runItems
            setRunItems(runItems.filter(item => item !== 'subregions'));

            return;

        }

    }, [subregionsToSave]);

    useEffect(() => {

        if (runItems.includes('regions')) {

            //console.log("regionsToSave:", regionsToSave);

            var bodyToSave = JSON.stringify(activeRegions);

            //console.log("regions bodyToSave:", bodyToSave);

            saveData(bodyToSave, '_afct_active_regions');

            setRunItems(runItems.filter(item => item !== 'regions'));

            return;

        }

    }, [regionsToSave]);

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