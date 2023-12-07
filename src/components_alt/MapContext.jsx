import { 
    createContext,
    useState,
    useRef,
} from "@wordpress/element";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {

    const [activeRegions, setActiveRegions] = useState(JSON.parse(admin.regions));
    const [activeSubregions, setActiveSubregions] = useState([]);
    const [activeSelection, setActiveSelection] = useState([]);
    const [mapLayers, setMapLayers] = useState([]);
    const [legendKeyClicked, setLegendKeyClicked] = useState(null);

    const mapRef = useRef();


    return (
        <MapContext.Provider value={{
            activeRegions,
            setActiveRegions,
            activeSubregions,
            setActiveSubregions,
            activeSelection,
            setActiveSelection,
            mapLayers,
            setMapLayers,
            mapRef,
            legendKeyClicked,
            setLegendKeyClicked,
        }}>
            {children}
        </MapContext.Provider>
    )

}