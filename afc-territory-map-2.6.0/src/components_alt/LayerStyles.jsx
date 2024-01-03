import { 
    useContext,
    useEffect,
} from "@wordpress/element";

import { MapContext } from "../components/MapContext";

import branchesAlt from "../assets/branches.json";

const LayerStyles = () => {

    const { activeSelection, activeSubregions } = useContext(MapContext);

    useEffect(() => {
        
        if (activeSubregions.length === 0) {

            return;

        }

        activeSubregions.forEach(subregion => {

            if (subregion.branch) {

                //console.log("subregion", subregion)
                //console.log("subregion.branch", subregion.branch)
                //console.log("branchesAlt", branchesAlt)

                const branch = branchesAlt.find(branchAlt => Number(branchAlt.value) === Number(subregion.branch));

                //console.log("branch", branch);

                const style = branch.style;

                subregion.setStyle(style);

                /*
                const branch = branchesAlt[subregion.branch];
                console.log("branch", branch);
                const style = branch.style;

                subregion.setStyle(style);
                */
            }

        });
        
    }, [activeSubregions])

    useEffect(() => {

        if (activeSelection.count === 0) {

            activeSubregions.forEach(subregion => {

                if (subregion.branch) {

                    const branch = branchesAlt[subregion.branch];

                    

                    const style = branch.style;

                    subregion.setStyle(style);
                }

            });

        }
        
    }, [activeSelection])

}

export default LayerStyles;