import logo from './logo.svg';
import React from 'react';
import './App.css';
import WebsiteField from './WebsiteField.js';

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      textField: "",
      websiteURL: "",
      percentage: 0.0
    }
  }

  displayScore = () => {
    if (this.state.percentage > 0.0){
      return this.state.percentage;
    }

    return "";
  }

  render() {


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>vLidity: enter an article URL to start!</h1>
          <h2>{this.state.textField}</h2>
          <h2>{this.displayScore}</h2>  
          <WebsiteField onClick={this.callAPI}></WebsiteField>
        </header>
        
      </div>
    );
  }

  callAPI = async (val) => {
    let params = new FormData();
    params.append("url", val);

    let endpoint = "test";

    let apiURL = "http://localhost:8000/" + endpoint;
    let res = await fetch(apiURL, {method:"POST", body: params})
                         .then(this.statusCheck)
                         .then(response => response.json())
                         .catch(this.handleError  );

    
    // hehe
    if (res === undefined){
      return;
    }

    this.setState({
      textField: res.title,
      percentage: res.score, // FIX THIS FIELD
      websiteURL: res.website
    });
  }

  async statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response;
  }

  handleError = () => {
    alert("Error: bad URL");
  }

  
}

export default App;
