import React from 'react';
import ReactDOM from 'react-dom';

import TerritoryMap from './components/TerritoryMap';

const App = () => {
    return (
        <div className="App">
        <TerritoryMap />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('territory-map'));