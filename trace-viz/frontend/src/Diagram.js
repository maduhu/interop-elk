import React, { Component } from 'react';
import DiagramControls from './DiagramControls';
import PayerDiagram from './PayerDiagram';
import CentralDiagram from './CentralDiagram';
import PayeeDiagram from './PayeeDiagram';
import SectionBackgrounds from './SectionBackgrounds';
import ExampleResponse from './example_response.json';
import { DFSP_WIDTH, CENTRAL_WIDTH, SECTION_MARGIN } from './constants';
import './Diagram.css';

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data is the raw data from the server, we probably don't actually need to store it on state but we haven't
      // implemented the server code for getting data quite yet.
      data: { ...ExampleResponse },
      // path is the processed data that
      path: [
        // TODO: modify className on Line and LineAnnotation so it can have quote-fees and quote-route
        ['payer-dfsp-logic', 'quote'],
        ['payer-interop-scheme-adapter', 'quote-route'],
        ['payer-ilp-service', 'quote-route'],
        ['payer-ilp-client', 'quote-route'],
        ['payer-ilp-connector', 'quote-route'],
      ],
    };
  }

  render() {
    const width = (DFSP_WIDTH * 2) + CENTRAL_WIDTH + (SECTION_MARGIN * 2);
    const height = 680;
    const zoom = this.props.zoom ? this.props.zoom : 1;

    return (
      <div className="architecture-diagram">
        <svg className="diagram-canvas" width={width} height={height}>
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#000" />
            </marker>

            <marker
              id="arrow--selected"
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#060" />
            </marker>
          </defs>

          <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
            {/* Render the section backgrounds first so everything is rendered on top of them */}
            <SectionBackgrounds />

            <PayerDiagram />

            <CentralDiagram />

            <PayeeDiagram />
          </g>
        </svg>

        <DiagramControls step={this.state.step} path={this.state.path} />
      </div>
    );
  }
}

export default Diagram;
