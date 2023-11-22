import {
    Card,
    CardHeader,
    CardBody,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    SelectControl,
    ToggleControl
} from '@wordpress/components';

import { useState } from '@wordpress/element';

import branches from '../includes/admin/branches.json';
import branchStyles from '../includes/admin/branch-styles.json';
import fips from '../includes/admin/fips.json';

export default function CountyCard({ county, updateCounty, updateCounties }) {

    if (!county) {
        return null;
    }
    /*
    const hasProp = (obj, prop) => {
        if (prop === 'STATEFP' && obj.hasOwnProperty(prop)) {
            return fips[obj[prop]];
        } else if ((prop === 'STATEFP' && !obj.hasOwnProperty(prop))) {
            return '';
        }
        return obj.hasOwnProperty(prop) ? obj[prop] : '';
    }

    const startStates = {
        name: hasProp(county, 'Name'),
        state: hasProp(county, 'STATEFP'),
        geoid: hasProp(county, 'GEOID'),
    }
    */

    const [active, setActive] = useState(false);
    const [serviceArea, setServiceArea] = useState('');
    const [countyName, setCountyName] = useState(county.Name);
    const [stateName, setStateName] = useState(fips[county.STATEFP]);
    const [geoid, setGeoid] = useState(county.GEOID);
    const [style, setStyle] = useState('');
    
    

    const handleToggleChange = (val) => {
        setActive(val);
        setServiceArea(val ? 'none' : '');
        

        val ? updateCounties((countyList) => [...countyList, county]) : updateCounties((countyList) => countyList.filter((item) => item.geoid !== county.geoid));
    }

    const handleSelectChange = (val) => {
        setServiceArea(val);
        setStyle(branchStyles[val]);
        county.style = branchStyles[val];
        updateCounty(county);
        //console.log("county", county);

        updateCounties((countyList) => countyList.map((item) => {
            if (item.geoid === county.geoid) {
                item.serviceArea = val;
                item.style = branchStyles[val];
            }
            return item;
        }));
    }


    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{countyName} County, {stateName}</Heading>
            </CardHeader>
            <CardBody>
                <ToggleControl
                    label="County In Service"
                    checked={active}
                    onChange={handleToggleChange}
                />
                <Text>Choose a Service Area</Text>
                <SelectControl
                    label="Service Area"
                    value={serviceArea}
                    options={branches}
                    onChange={handleSelectChange}
                />
                <Text></Text>
            </CardBody>
        </Card>
    );
}