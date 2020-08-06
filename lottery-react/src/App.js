import React from 'react';
import './App.css';
import Lottery from './containers/Lottery';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h2>Lottery Smart Contract</h2>
      </header>
      <Lottery></Lottery>
    </div>
  );
}

export default App;
