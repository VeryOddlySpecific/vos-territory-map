import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    SelectControl,
    ToggleControl
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

import fips from '../includes/admin/fips.json';
import branches from '../includes/admin/branches.json';
import branchStyles from '../includes/admin/branch-styles.json';

export default function CountyCard({ county, updateCounty }) {

    const countyName = county.Name;
    const stateName = fips[county.STATEFP];
    const [active, setActive] = useState(county.isActive);
    const [serviceArea, setServiceArea] = useState("default");

    useEffect(() => {
        setActive(county.isActive);
        //setServiceArea(county.serviceArea)
    }, [county]);

    const handleToggleChange = () => {
        setActive(prevActive => !prevActive);
        const newCounty = { ...county, isActive: !active};
        updateCounty(newCounty);
    }

    const handleSelectChange = (val) => {
        county.target.setStyle(branchStyles[val]);
        const newCounty = { ...county };
        newCounty.serviceArea = val;
        updateCounty(newCounty);
    }

    return(
        <Card>
            <CardHeader>
                <Heading level={3}>{countyName} County, {stateName}</Heading>
            </CardHeader>
            <CardBody>
                <ToggleControl
                    label='County In Service'
                    checked={active}
                    onChange={handleToggleChange}
                />
                <Text>Choose a Service Area</Text>
                <SelectControl
                    label='Service Area'
                    disabled={!active}
                    value={serviceArea}
                    options={branches}
                    onChange={handleSelectChange}
                />
                <Text></Text>
            </CardBody>
            <CardFooter></CardFooter>
        </Card>
    )

}