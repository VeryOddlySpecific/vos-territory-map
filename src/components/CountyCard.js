import {
    Card,
    CardHeader,
    CardBody,
    __experimentalHeading as Heading,
    __experimentalText as Text,
    ToggleControl,
    SelectControl
} from '@wordpress/components';

import { useState } from '@wordpress/element';

import branches from '../assets/branches.json';

export default function CountyCard({ countySelection, updateCountySelection }) {

    const countiesAreActive = (counties) => {

        if (counties.length) {

            return counties.every((county) => county.active);

        }

        return false;
    };

    const getCountiesBranch = (counties) => {

        // if counties.length is truthy, and all counties have the same branch, return that branch
        // otherwise, return 'default'

        if (counties.length && counties.every((county) => county.branch === counties[0].branch)) {

            return counties[0].branch;

        }

        return '';

    };

    const [active, setActive] = useState(countiesAreActive(countySelection));
    const [branch, setBranch] = useState(getCountiesBranch(countySelection));    

    const handleToggleChange = () => {

        setActive(prevActive => !prevActive);

        updateCountySelection((prevCountySelection) => {
                
            return prevCountySelection.map((county) => {

                return {
                    ...county,
                    active: !prevActive,
                };

            });

        });

    };

    const handleBranchChange = (branch) => {

        setBranch(branch);

        updateCountySelection((prevCountySelection) => {
                
            return prevCountySelection.map((county) => {

                return {
                    ...county,
                    branch: branch,
                };

            });

        });

    };

    return (
        <Card>
            <CardHeader>
                {
                    countySelection.length ? 
                        (
                            countySelection.map((county) => (
                                <Heading key={county.fips} level={2}>{county.name}</Heading>
                            ))
                        ) : (
                            <Heading level={2}>Select A County</Heading>
                        )
                }
            </CardHeader>
            <CardBody>
                <ToggleControl
                    label="Activate County"
                    checked={active}
                    onChange={handleToggleChange}
                />
                <SelectControl
                    label="Select Branch"
                    disabled={!active}
                    value={branch}
                    options={branches}
                    onChange={handleBranchChange}
                />
            </CardBody>
        </Card>
    )

}