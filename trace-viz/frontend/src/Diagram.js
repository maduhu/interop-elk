import React, { Component } from 'react';
import DiagramControls from './DiagramControls';
import PayerDiagram from './PayerDiagram';
import CentralDiagram from './CentralDiagram';
import PayeeDiagram from './PayeeDiagram';
import SectionBackgrounds from './SectionBackgrounds';
import TraceTable from './TraceTable';
import * as d3 from 'd3';
import ExampleResponse from './example_response.json';
import { DFSP_WIDTH, CENTRAL_WIDTH, SECTION_MARGIN } from './constants';
import './Diagram.css';

// TODO: move these to constants.js
const STROKE = '#000';
const FILL = '#fff';
const STROKE_START = '#060';
const STROKE_END = '#5C5';
const FILL_START = '#7F7';
const FILL_END = '#CFC';


function animateEdge(node, action, duration, strokeStart) {
  const sel = d3.select(`.line--${node}-${action} path`);
  const name = node + action; // Needed to cancel transitions if user takes action mid-animation.

  sel.transition(name)
    .duration(duration)
    .attr('stroke', strokeStart)
    .attr('marker-end', 'url(#arrow--selected)');
}

function animateNode(node, action, duration, strokeStart, strokeEnd, fillStart, fillEnd) {
  let sel;
  let name; // Needed to cancel transitions if user takes action mid-animation.

  if (action === null) {
    sel = d3.select(`.node--${node} rect`);
    name = node;
  } else {
    sel = d3.select(`.annotation--${node}-${action} rect`);
    name = node + action;
  }

  sel.transition(name)
    .duration(duration)
    .attr('fill', fillStart)
    .attr('stroke', strokeStart)
    .on('end', () => {
      sel.transition(name)
        .duration(duration * 3)
        .attr('fill', fillEnd)
        .attr('stroke', strokeEnd);
    });
}

function animateNodeAndEdge(node, action, duration, strokeStart, strokeEnd, fillStart, fillEnd) {
  animateNode(node, null, duration, strokeStart, strokeEnd, fillStart, fillEnd);
  animateNode(node, action, duration, strokeStart, strokeEnd, fillStart, fillEnd);
  animateEdge(node, action, duration, strokeStart, strokeEnd);
}

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.startPlayLoop = this.startPlayLoop.bind(this);
    this.stopPlayLoop = this.stopPlayLoop.bind(this);
    this.playPause = this.playPause.bind(this);
    this.backward = this.backward.bind(this);
    this.forward = this.forward.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {
      step: null,
      loopId: null,
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

  componentDidMount() {
    if (this.state.path !== null) {
      this.playPause();
    }
  }

  componentWillReceiveProps(props) {
    if (props.traceId !== this.props.traceId) {
      // TraceId changed, stop all animations, reset state, load new data, then start playing
      this.reset();
    }
  }

  startPlayLoop() {
    this.setState((state) => {
      let step = state.step;

      if (step === this.state.path.length - 1) {
        // If the user hits play and we have already played from beginning to end then we reset.
        step = null;
        this.reset();
      }

      return {
        step,
        loopId: window.setInterval(this.forward, 400),
      };
    });
  }

  stopPlayLoop() {
    this.setState((state) => {
      window.clearInterval(state.loopId);
      return { loopId: null };
    });
  }

  playPause() {
    if (this.state.loopId === null) {
      this.startPlayLoop();
    } else {
      this.stopPlayLoop();
    }
  }

  animateStep(step) {
    const [node, action] = this.state.path[step];
    animateNodeAndEdge(node, action, 400, STROKE_START, STROKE_END, FILL_START, FILL_END);
  }

  backward() {
    this.setState((state) => {
      if (state.step === null) {
        return {};
      }

      let step = state.step - 1;

      if (step < 0) {
        step = null;
        this.reset();
      } else {
        this.animateStep(step);
      }

      return { step };
    });
  }

  forward() {
    this.setState((state) => {
      let step = state.step;

      if (step === null) {
        step = 0;
      } else if (step !== this.state.path.length - 1) {
        step += 1;
      }

      this.animateStep(step);

      if (step === this.state.path.length - 1) {
        // If we've reached the last step we can stop the loop.
        window.clearInterval(state.loopId);
        return { step, loopId: null };
      }

      return { step };
    });
  }

  reset() {
    const allElements = d3.select('svg').selectAll('*');

    this.state.path.forEach((item) => {
      // Interrupt all pending transitions, transitions are named via node + action;
      const [node, action] = item;
      allElements.interrupt(node);
      allElements.interrupt(node + action);
    });

    d3.selectAll('.line path').attr('stroke', STROKE).attr('marker-end', 'url(#arrow)');
    d3.selectAll('.annotation rect').attr('fill', FILL).attr('stroke', STROKE);
    d3.selectAll('.node rect').attr('fill', FILL).attr('stroke', STROKE);
  }

  stop() {
    this.setState((state) => {
      window.clearInterval(state.loopId);
      return { loopId: null, step: null };
    }, this.reset);
  }

  render() {
    const width = (DFSP_WIDTH * 2) + CENTRAL_WIDTH + (SECTION_MARGIN * 2);
    const height = 680;
    const zoom = this.props.zoom ? this.props.zoom : 1;
    const isPlaying = this.state.loopId !== null;

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


        <DiagramControls
          isPlaying={isPlaying}
          backward={this.backward}
          playPause={this.playPause}
          stop={this.stop}
          forward={this.forward}
        />

        <TraceTable step={this.state.step} path={this.state.path} data={this.state.data} />
      </div>
    );
  }
}

export default Diagram;
