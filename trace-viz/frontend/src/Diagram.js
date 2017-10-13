import React, { Component } from 'react';
import DiagramControls from './DiagramControls';
import SimplifiedDiagram from './SimplifiedDiagram';
import { has } from './utils';
import * as d3 from 'd3';
import { Client } from 'elasticsearch';
import {
  FILL,
  STROKE,
  STROKE_START,
  STROKE_END,
  FILL_START,
  FILL_END,
} from './constants';
import './Diagram.css';

/* eslint-disable */
export const colorMap = {
  lookup: '.color--lookup',
  resolve: '.color--resolve',
  quoteFees: '.color--quote',
  quoteRoute: '.color--quote',
  prepare: '.color--prepare',
  fulfill: '.color--fulfill',
};
const animationSequences = {
  lookup: [
    // These should be highlighted purple
    'payer-dfsp-logic',
    'payer-dfsp-logic-dot',
    'payer-scheme-adapter',
    'lookup-identifier',
    'central-directory',
    'pathfinder-dot',
    'pathfinder',
  ],
  resolve: [
    // These should be highlighted purple
    'payer-dfsp-logic',
    'payer-dfsp-logic-dot',
    'payer-scheme-adapter',
    'resolve-recipient',
    'payee-scheme-adapter',
    'payee-dfsp-logic-dot',
    'payee-dfsp-logic',
  ],
  quoteFees: [
    // These should be highlighted orange
    'payer-dfsp-logic',
    'payer-dfsp-logic-dot',
    'payer-scheme-adapter',
    'quote-fees',
    'payee-scheme-adapter',
    'payee-dfsp-logic-dot',
    'payee-dfsp-logic',
    'create-condition',
  ],
  quoteRoute: [
    // These should be highlighted orange
    'payer-dfsp-logic',
    'payer-dfsp-logic-dot',
    'payer-scheme-adapter',
    'payer-dfsp-connector',
    'payer-quote-route',
    'central-ist',
    'payee-quote-route',
    'payee-dfsp-connector',
    'payee-scheme-adapter',
    'payee-dfsp-logic-dot',
    'payee-dfsp-logic',
  ],
  prepare: [
    // These should be highlighted blue
    'payer-dfsp-logic',
    'payer-dfsp-logic-dot',
    'payer-scheme-adapter',
    'payer-dfsp-connector',
    'payer-ledger-adapter-dot',
    'payer-ledger-adapter',
    'payer-ledger-db-dot',
    'payer-ledger-db',
    'payer-prepare',
    'central-ist',
    'central-ledger-db-dot',
    'central-ledger-db',
    'payee-prepare',
    'payee-dfsp-connector',
    'payee-dfsp-ledger-adapter-dot',
    'payee-dfsp-ledger-adapter',
    'evaluate-condition'
  ],
  fulfill: [
    // These should be highlighted green
    'evaluate-condition',
    'payee-dfsp-connector',
    'payee-notify-fulfillment',
    'central-ist',
    'central-ledger-db-dot',
    'central-ledger-db',
    ['payer-notify-fulfillment', 'payee-notify-fulfillment'],
    ['payer-dfsp-connector', 'payee-dfsp-connector'],
    ['payer-ledger-adapter', 'payee-ledger-adapter'],
    ['payer-ledger-db-dot', 'payee-ledger-db-dot'],
    ['payer-ledger-db', 'payee-ledger-db'],
    ['payer-scheme-adapter', 'payee-scheme-adapter'],
    ['payer-dfsp-logic-dot', 'payee-dfsp-logic-dot'],
    ['payer-dfsp-logic', 'payee-dfsp-logic'],
  ],
};
/* eslint-enable */

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
    this.parseTraceIds = this.parseTraceIds.bind(this);
    this.getTraceIds = this.getTraceIds.bind(this);
    this.parseTraceData = this.parseTraceData.bind(this);
    this.getTraceData = this.getTraceData.bind(this);
    this.startPlayLoop = this.startPlayLoop.bind(this);
    this.stopPlayLoop = this.stopPlayLoop.bind(this);
    this.playPause = this.playPause.bind(this);
    this.backward = this.backward.bind(this);
    this.forward = this.forward.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.selectStep = this.selectStep.bind(this);
    this.client = new Client({ host: 'localhost:9200' });
    this.getTraceIds();
    this.state = {
      traceId: null, // Good test id: 5e97e69e-93af-4b13-acdd-a60bb790a3bf
      traceIds: null,
      traceSequence: null,
      step: null,
      stepData: {},
      loopId: null,
    };
  }

  componentDidMount() {
    if (this.state.path !== null) {
      // this.playPause();
    }
  }

  componentWillReceiveProps(props) {
    if (props.traceId !== this.props.traceId) {
      // TraceId changed, stop all animations, reset state, load new data, then start playing
      this.reset();
    }
  }

  parseTraceIds(data) {
    let loadTraceData = false;

    this.setState((state) => {
      const newState = {};
      const traceIdMap = {};
      const traceIdList = [];

      data.hits.hits.forEach((hit) => {
        const source = hit._source; // eslint-disable-line no-underscore-dangle
        const traceId = source.l1p_trace_id;

        if (!has.call(traceIdMap, traceId)) {
          // The trace data is sorted in ascending order so we can assume the first traceId we see is the newest one.
          traceIdMap[traceId] = true;
          traceIdList.push(traceId);
        }
      });

      newState.traceIds = traceIdList;

      if (state.traceId === null) {
        newState.traceId = traceIdList[0];
        loadTraceData = true;
      }

      return newState;
    }, () => {
      if (loadTraceData) {
        this.getTraceData();
      }
    });
  }

  getTraceIds() {
    this.client.search({
      index: 'l1p_index_*',
      body: {
        size: 50,
        sort: {
          '@timestamp': { order: 'desc' },
        },
        query: {
          bool: {
            // We are only interested in data that has a traceId and a callType associated.
            must: [{
              exists: {
                field: 'l1p_trace_id',
              },
            }, {
              exists: {
                field: 'l1p_call_type',
              },
            }],
          },
        },
      },
    }).then(this.parseTraceIds);
  }

  parseTraceData(data) {
    this.setState(() => {
      const newState = { data: data.hits.hits };
      const callTypes = {};
      const sequences = [];

      data.hits.hits.forEach((hit) => {
        const source = hit._source; // eslint-disable-line

        if (has.call(source, 'l1p_call_type')) {
          const callType = source.l1p_call_type;

          if (!has.call(callTypes, callType)) {
            callTypes[callType] = {};
          }

          callTypes[callType][`${source.l1p_environment} - ${source.l1p_service_id}`] = true; // eslint-disable-line
        }
      });

      if (has.call(callTypes, 'user-lookup')) {
        sequences.push('lookup');
      }

      if (has.call(callTypes, 'payee-details')) {
        sequences.push('resolve');
      }

      if (has.call(callTypes, 'quote-fees')) {
        sequences.push('quoteFees');
      }

      if (has.call(callTypes, 'quote-route')) {
        sequences.push('quoteRoute');
      }

      if (has.call(callTypes, 'rest-prepare') || has.call(callTypes, 'dfsp-prepare')) {
        sequences.push('prepare');
      }

      if (has.call(callTypes, 'rest-fulfill') || has.call(callTypes, 'dfsp-fulfill')) {
        sequences.push('fulfill');
      }

      newState.traceSequence = sequences;
      return newState;
    });
  }

  getTraceData() {
    this.client.search({
      index: 'l1p_index_*',
      body: {
        size: 1500,
        sort: {
          '@timestamp': { order: 'asc' },
        },
        query: {
          query_string: {
            query: `l1p_trace_id:"${this.state.traceId}"`,
          },
        },
      },
    }).then(this.parseTraceData);
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
    const width = 1024;
    const height = 500;
    const zoom = this.props.zoom ? this.props.zoom : 1;
    const isPlaying = this.state.loopId !== null;

    return (
      <div className="architecture-diagram">
        <svg className="diagram-canvas" width={width} height={height}>
          <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
            <SimplifiedDiagram />
          </g>
        </svg>


        <DiagramControls
          isPlaying={isPlaying}
          backward={this.backward}
          playPause={this.playPause}
          stop={this.stop}
          forward={this.forward}
        />
      </div>
    );
  }
}

export default Diagram;
