import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './App.sass';
import Table from './Table'
import dataJson from './data.json'


const data = dataJson


class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Table data={data} className="table"></Table>
      </div>
    );
  }
}

export default App;
