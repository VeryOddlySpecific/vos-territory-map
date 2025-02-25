import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    __experimentalHeading as Heading,
    __experimentalGrid as Grid,
} from '@wordpress/components';

import RegionData from '../assets/fips.json';

import { MapContext } from './MapContext';
import { useContext } from '@wordpress/element';

const RegionSelector = () => {

    const { 
        activeRegions,
        setToggledRegion,
    } = useContext(MapContext);

    const toggleRegion = (region) => {
        const regionIsActive = activeRegions.includes(region);
        const regionData = {
            fips: region,
            active: !regionIsActive
        }

        setToggledRegion(regionData);
    }

    return (
        <>
        <Card>

            <CardHeader>
                <Heading>Region Selector</Heading>
                
            </CardHeader>

            <CardBody>
                <Grid
                    columns={6}
                    gap={2}
                >
                    
                    {
                    RegionData.map((region) => {
    
                        return (
                            <ToggleControl
                                key={region.fips}
                                label={region.name}
                                checked={activeRegions.includes(region.fips)}
                                onChange={() => toggleRegion(region.fips)}
                            />
                        )
    
                    })
                    }
                </Grid>

            </CardBody>

        </Card>
        </>

    )

}

export default RegionSelector;