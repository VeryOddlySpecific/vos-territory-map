import { 
    useContext,
    useEffect,
} from "@wordpress/element";

import { MapContext } from "./MapContext";

import branchesAlt from "../assets/branches.json";

const LayerStyles = () => {

    const { activeSelection, activeSubregions } = useContext(MapContext);

    useEffect(() => {
        
        if (activeSubregions.length === 0) {

            return;

        }

        //console.log("branches", branches);
        activeSubregions.forEach(subregion => {

            if (subregion.branch) {

                const branch = branchesAlt[subregion.branch];

                const style = branch.style;

                subregion.setStyle(style);
            }

        });
        
    }, [activeSubregions])

    useEffect(() => {
        
        // when active selection is cleared, reset all inactive subregion styles
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