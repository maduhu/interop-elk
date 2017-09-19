import React, { Component } from 'react';
import DiagramControls from './DiagramControls';
import PayerDiagram from './PayerDiagram';
import CentralDiagram from './CentralDiagram';
import PayeeDiagram from './PayeeDiagram';
import SectionBackgrounds from './SectionBackgrounds';
import TraceTable from './TraceTable';
import * as d3 from 'd3';
import ExampleResponse from './example_response.json';
import {
  DFSP_WIDTH,
  CENTRAL_WIDTH,
  SECTION_MARGIN,
  FILL,
  STROKE,
  STROKE_START,
  STROKE_END,
  FILL_START,
  FILL_END,
} from './constants';
import './Diagram.css';

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

function processData(data) {
  /**
   * processData extracts the information we need from an ElasticSearch query and converts it to a less verbose format.
   */
  return data.hits.hits.map((hit) => {
    const source = hit._source; // eslint-disable-line no-underscore-dangle

    return {
      timestamp: new Date(source['@timestamp']),
      environment: source.l1p_environment,
      service: source.l1p_service_id,
      message: source.message,
    };
  });
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
    this.selectStep = this.selectStep.bind(this);

    const fakePath = [
      ['payer-dfsp-logic', 'quote'],
      ['payer-interop-scheme-adapter', 'quote-route'],
      ['payer-ilp-service', 'quote-route'],
      ['payer-ilp-client', 'quote-route'],
      ['payer-ilp-connector', 'quote-route'],
    ];
    const fakeData = processData(ExampleResponse).slice(0, fakePath.length);

    this.state = {
      step: null,
      loopId: null,
      data: fakeData, // TODO: actually query the ES server for data.
      path: fakePath, // TODO: generate path based on data retrieved from ElasticSearch
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

  selectStep(step) {
    this.setState((state) => {
      // Only allow a user to select a step via click if we're not currently playing back the steps.
      if (state.loopId === null) {
        this.animateStep(step);
        return { step };
      }

      return {};
    });
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

        <TraceTable step={this.state.step} path={this.state.path} data={this.state.data} selectStep={this.selectStep} />
      </div>
    );
  }
}

export default Diagram;
