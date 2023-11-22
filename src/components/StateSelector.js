import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    __experimentalHeading as Heading
} from '@wordpress/components';

import fips from '../includes/admin/fips.json';

export default function StateSelector({ states, updateStates }) {

    return (
        <Card>
            <CardHeader>
                <Heading level={2}>States</Heading>
            </CardHeader>
            <CardBody>
                {fips.map((state) => (
                    <ToggleControl
                        key={state.fips}
                        label={state.name}
                        checked={states.some((selectedState) => selectedState.fips === state.fips)}
                        onChange={(checked) => {
                            if (checked) {
                                updateStates((prevStates) => [...prevStates, state]);
                            } else {
                                updateStates((prevStates) => prevStates.filter((prevState) => prevState.fips !== state.fips));
                            }
                        }}
                    />
                ))}
            </CardBody>
        </Card>
    );
}