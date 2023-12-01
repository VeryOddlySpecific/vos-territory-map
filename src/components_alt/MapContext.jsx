import { 
    createContext,
    useState
} from "@wordpress/element";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {

    const [activeRegions, setActiveRegions] = useState([]);
    const [activeSubregions, setActiveSubregions] = useState([]);
    const [activeSelection, setActiveSelection] = useState([]);


    return (
        <MapContext.Provider value={{
            activeRegions,
            setActiveRegions,
            activeSubregions,
            setActiveSubregions,
            activeSelection,
            setActiveSelection
        }}>
            {children}
        </MapContext.Provider>
    )

}