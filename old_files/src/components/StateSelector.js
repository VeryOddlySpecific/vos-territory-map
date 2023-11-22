import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    __experimentalHeading as Heading
} from '@wordpress/components';

import fips from '../includes/admin/fips.json';

export default function StateSelector({states, updateStates}) {    

    return (
        <Card>
            <CardHeader>
                <Heading level={2}>State Selection</Heading>
            </CardHeader>
            <CardBody>
                {Object.keys(fips).map((state, index) => {
                    return (
                        <ToggleControl
                            key={index}
                            label={fips[state]}
                            checked={states.includes(state)}
                            onChange={(checked) => {
                                if (checked) {
                                    updateStates([...states, state]);
                                } else {
                                    updateStates(states.filter(item => item !== state));
                                }
                            }}
                        />
                    )
                })}
            </CardBody>
        </Card>
    )
}