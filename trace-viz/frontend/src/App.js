import React, { Component } from 'react';
// import Header from './Header';
import Diagram from './Diagram';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.updateTraceId = this.updateTraceId.bind(this);
    this.loadTraceData = this.loadTraceData.bind(this);

    this.state = {
      traceId: '',
      traceData: null,
    };
  }

  updateTraceId(traceId) {
    this.setState({ traceId }, this.loadTraceData);
  }

  loadTraceData() {
    console.log(`Loading trace data for ${this.state.traceId}`);
  }

  render() {
    return (
      <div className="trace-viz-app">
        {/*<Header traceId={this.state.traceId} updateTraceId={this.updateTraceId} />*/}
        <Diagram traceId={this.state.traceId} data={this.state.traceData} />
      </div>
    );
  }
}

export default App;
