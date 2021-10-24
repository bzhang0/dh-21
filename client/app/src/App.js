import logo from './logo.svg';
import React from 'react';
import './App.css';
import WebsiteField from './WebsiteField.js';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <WebsiteField></WebsiteField>
        </header>
      </div>
    );
  }

  
}

export default App;
