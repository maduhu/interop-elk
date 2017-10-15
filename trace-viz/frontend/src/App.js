import React, { PureComponent } from 'react';
import Diagram from './Diagram';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="trace-viz-app">
        <Diagram />
      </div>
    );
  }
}

export default App;
