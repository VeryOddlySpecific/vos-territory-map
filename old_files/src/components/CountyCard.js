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

export default function CountyCard({ props, onUpdateCounties }) {
    const [active, setActive] = useState(false);
    const [serviceLocation, setServiceLocation] = useState('');

    const handleToggleChange = (value) => {
        setActive(value);

        const dataToPush = {
            geoid: props.geoid,
            serviceArea: serviceLocation
        };

        value ? addToList(dataToPush) : removeFromList(dataToPush);
    }

    const handleSelectChange = (value) => {
        setServiceLocation(value);

        updateListItem({
            geoid: props.geoid,
            serviceArea: value
        });

        props.target.setStyle(branchStyles[value]);
    }
    
    const addToList = (data) => {
        onUpdateCounties((prevList) => [...prevList, data]);
    }

    const removeFromList = (data) => {
        onUpdateCounties((prevList) => prevList.filter((item) => item.geoid !== data.geoid));
    }

    const updateListItem = (data) => {
        onUpdateCounties((prevList) => prevList.map((item) => item === data ? data : item));
    }

    return (
        <Card>
            <CardHeader>
                <Heading level={ 3 }>{props.name} County, {props.stateName}</Heading>
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
        </Card>
    )
}