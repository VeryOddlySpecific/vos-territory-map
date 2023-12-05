import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    __experimentalHeading as Heading,
} from '@wordpress/components';

import RegionData from '../assets/fips.json';

import SaveButton from './SaveButton';

import { MapContext } from './MapContext';
import { useContext } from '@wordpress/element';

const RegionSelector = () => {

    const { activeRegions, setActiveRegions } = useContext(MapContext);

    const toggleRegion = (region) => {

        if (activeRegions.includes(region)) {

            setActiveRegions(activeRegions.filter(item => item !== region));

        } else {

            setActiveRegions([...activeRegions, region]);

        }

    }

    return (
        <>
        <Card>

            <CardHeader>
                <Heading>Region Selector</Heading>
                <SaveButton />
            </CardHeader>

            <CardBody>
                    
                    {RegionData.map((region) => {
    
                        return (
                            <ToggleControl
                                key={region.fips}
                                label={region.name}
                                checked={activeRegions.includes(region.fips)}
                                onChange={() => toggleRegion(region.fips)}
                            />
                        )
    
                    })}

            </CardBody>

        </Card>
        </>

    )

}

export default RegionSelector;