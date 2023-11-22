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

import branchStyles from '../includes/admin/branch-styles.json'

import { useState } from '@wordpress/element';

export default function CountyCard({ countyData, onUpdateCounties }) {
    const [serviceLocation, setServiceLocation] = useState( 'la-vista' );
    const [active, setActive] = useState( false );
    const geoid = countyData.stateId + countyData.countyId;

    const handleToggleChange = (value) => {
        setActive(value);
        
        var dataToPush = {
            geoid: geoid,
            serviceArea: serviceLocation
        };

        value ? pushToList(dataToPush) : removeFromList(dataToPush);  
    };

    const pushToList = (data) => {
        onUpdateCounties((prevList) => [...prevList, data]);
    }

    const removeFromList = (data) => {
        onUpdateCounties((prevList) => prevList.filter((item) => item !== data));
    }

    const updateListItem = (data) => {
        onUpdateCounties((prevList) => prevList.map((item) => item.geoid === data.geoid ? data : item));
    }

    const handleSelectChange = (value) => {
        setServiceLocation(value);
        var style = branchStyles[value];
        countyData.target.setStyle(style);
    }

    return (
        <Card>
            <CardHeader>
                <Heading level={ 3 }>{ countyData.name } County, { countyData.stateName }</Heading>
            </CardHeader>
            <CardBody>
                <ToggleControl
                    label="County In Service Area"
                    checked={ active }
                    onChange={ handleToggleChange }
                />
                <SelectControl
                    label="Select a service location"
                    disabled={ !active }
                    value={ serviceLocation }
                    options={ [
                        { label: 'La Vista', value: 'la-vista' },
                        { label: 'Omaha', value: 'omaha' },
                        { label: 'Lincoln', value: 'lincoln' },
                        { label: 'Kearney', value: 'kearney' },
                        { label: 'Grand Island', value: 'grand-island' },
                        { label: 'Cedar Rapids', value: 'cedar-rapids' },
                        { label: 'Des Moines', value: 'des-moines' },
                        { label: 'Sioux City', value: 'sioux-city' },
                        { label: 'Sioux Falls', value: 'sioux-falls' },
                        { label: 'Rochester', value: 'rochester' },
                        { label: 'Madison', value: 'madison' },
                        { label: 'Kansas City', value: 'kansas-city' },
                        { label: 'Fargo', value: 'fargo' }
                    ] }
                    onChange={ handleSelectChange }
                />
            </CardBody>
            <CardFooter>
                <Heading level={ 4 }>Raw County Data</Heading>
                <Text>
                </Text>
            </CardFooter>
        </Card>
    );
}