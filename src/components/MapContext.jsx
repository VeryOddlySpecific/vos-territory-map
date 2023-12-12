import { 
    createContext,
    useState,
    useRef,
} from "@wordpress/element";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {

    const [activeRegions, setActiveRegions] = useState([]);
    const [activeSubregions, setActiveSubregions] = useState([]);
    const [activeSelection, setActiveSelection] = useState([]);
    const [legendKeyClicked, setLegendKeyClicked] = useState(null);
    const [toggledRegion, setToggledRegion] = useState({});

    const mapRef = useRef();


    return (
        <MapContext.Provider value={{
            mapRef,
            activeRegions,
            setActiveRegions,
            activeSubregions,
            setActiveSubregions,
            activeSelection,
            setActiveSelection,
            toggledRegion,
            setToggledRegion,
            legendKeyClicked,
            setLegendKeyClicked,
        }}>
            {children}
        </MapContext.Provider>
    )

}