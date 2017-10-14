import React, { Component } from 'react';
import DiagramControls from './DiagramControls';
import SimplifiedDiagram from './SimplifiedDiagram';
import TraceIdList from './TraceIdList';
import { has } from './utils';
import { Client } from 'elasticsearch';
import './Diagram.css';

const animationSequences = {
  blank: [
    // This is used so we can let animations play out between "actions"
    [],
  ],
  lookup: [
    // These should be highlighted purple
    ['payer-dfsp-logic'],
    ['payer-dfsp-logic-dot'],
    ['payer-scheme-adapter'],
    ['lookup-identifier'],
    ['central-directory'],
    ['pathfinder-dot'],
    ['pathfinder'],
  ],
  resolve: [
    // These should be highlighted purple
    ['payer-dfsp-logic'],
    ['payer-dfsp-logic-dot'],
    ['payer-scheme-adapter'],
    ['resolve-recipient'],
    ['payee-scheme-adapter'],
    ['payee-dfsp-logic-dot'],
    ['payee-dfsp-logic'],
  ],
  quoteFees: [
    // These should be highlighted orange
    ['payer-dfsp-logic'],
    ['payer-dfsp-logic-dot'],
    ['payer-scheme-adapter'],
    ['quote-fees'],
    ['payee-scheme-adapter'],
    ['payee-dfsp-logic-dot'],
    ['payee-dfsp-logic'],
    ['create-condition'],
  ],
  quoteRoute: [
    // These should be highlighted orange
    ['payer-dfsp-logic'],
    ['payer-dfsp-logic-dot'],
    ['payer-scheme-adapter'],
    ['payer-dfsp-connector'],
    ['payer-quote-route'],
    ['central-ist'],
    ['payee-quote-route'],
    ['payee-dfsp-connector'],
  ],
  prepare: [
    // These should be highlighted blue
    ['payer-dfsp-logic'],
    ['payer-dfsp-logic-dot'],
    ['payer-scheme-adapter'],
    ['payer-dfsp-connector'],
    ['payer-ledger-adapter-dot'],
    ['payer-ledger-adapter'],
    ['payer-ledger-db-dot'],
    ['payer-ledger-db'],
    ['payer-prepare'],
    ['central-ist'],
    ['central-ledger-db-dot'],
    ['central-ledger-db'],
    ['payee-prepare'],
    ['payee-dfsp-connector'],
    ['payee-ledger-adapter-dot'],
    ['payee-ledger-adapter'],
    ['evaluate-condition'],
  ],
  fulfill: [
    // These should be highlighted green
    ['evaluate-condition'],
    ['payee-dfsp-connector'],
    ['payee-notify-fulfillment'],
    ['central-ist'],
    ['central-ledger-db-dot'],
    ['central-ledger-db'],
    ['payer-notify-fulfillment', 'payee-notify-fulfillment'],
    ['payer-dfsp-connector', 'payee-dfsp-connector'],
    ['payer-ledger-adapter-dot', 'payee-ledger-adapter-dot'],
    ['payer-ledger-adapter', 'payee-ledger-adapter'],
    ['payer-ledger-db-dot', 'payee-ledger-db-dot'],
    ['payer-ledger-db', 'payee-ledger-db'],
    ['payer-scheme-adapter', 'payee-scheme-adapter'],
    ['payer-dfsp-logic-dot', 'payee-dfsp-logic-dot'],
    ['payer-dfsp-logic', 'payee-dfsp-logic'],
  ],
};

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.cleanUp = this.cleanUp.bind(this);
    this.startCleanUpLoop = this.startCleanUpLoop.bind(this);
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
    this.traceIdSelected = this.traceIdSelected.bind(this);
    this.client = new Client({ host: 'localhost:9200' });

    this.state = {
      traceId: null, // Good test id: 5e97e69e-93af-4b13-acdd-a60bb790a3bf
      traceIds: null,
      actionSequence: null,
      actionStep: 0,
      animationStep: -1,
      highlights: {},
      playLoopId: null,
      cleanupLoopId: null,
    };
  }

  componentDidMount() {
    this.getTraceIds();
    this.getTraceData();
    this.startCleanUpLoop();
  }

  cleanUp() {
    this.setState((state) => {
      if (state.actionSequence) {
        const { actionSequence, actionStep, animationStep, highlights } = state;
        const now = new Date();
        const newHighlights = {};
        const currentAction = actionSequence[actionStep];
        let currentNodes = [];

        if (currentAction && animationStep > -1) {
          currentNodes = animationSequences[currentAction][animationStep];
        }

        Object.keys(highlights).forEach((node) => {
          // Only keep highlights if they're the current node (playback is paused) or if it is less than a second old.
          if (currentNodes.indexOf(node) > -1 || now - highlights[node].time < 1000) {
            newHighlights[node] = highlights[node];
          }
        });

        return { highlights: newHighlights };
      }

      return {};
    });
  }

  startCleanUpLoop() {
    this.setState({ cleanupLoopId: window.setInterval(this.cleanUp, 100)});
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
      const sequence = [];

      data.hits.hits.forEach((hit) => {
        const source = hit._source; // eslint-disable-line

        if (has.call(source, 'l1p_call_type')) {
          callTypes[source.l1p_call_type] = true; // eslint-disable-line
        }
      });

      if (has.call(callTypes, 'user-lookup')) {
        sequence.push('lookup');
      }

      if (has.call(callTypes, 'payee-details')) {
        sequence.push('resolve');
      }

      if (has.call(callTypes, 'quote-fees')) {
        sequence.push('quoteFees');
      }

      if (has.call(callTypes, 'quote-route')) {
        sequence.push('quoteRoute');
      }

      if (has.call(callTypes, 'rest-prepare') || has.call(callTypes, 'dfsp-prepare')) {
        sequence.push('prepare');
      }

      if (has.call(callTypes, 'rest-fulfill') || has.call(callTypes, 'dfsp-fulfill')) {
        if (sequence.length > 0) {
          // Add two blank sequences so the evaluate condition animation has time to complete.
          sequence.push('blank');
          sequence.push('blank');
        }

        sequence.push('fulfill');
      }

      newState.actionSequence = sequence;
      return newState;
    }, this.playPause);
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
      let actionStep = state.actionStep;
      let animationStep = state.animationStep;
      const actionSequence = state.actionSequence;

      if (actionSequence && actionStep === actionSequence.length) {
        // If the user hits play and we have already played from beginning to end then we reset.
        actionStep = 0;
        animationStep = -1;
      }

      return {
        actionStep,
        animationStep,
        playLoopId: window.setInterval(this.forward, 400),
      };
    });
  }

  stopPlayLoop() {
    this.setState((state) => {
      window.clearInterval(state.playLoopId);
      return { playLoopId: null, highlights: {} };
    });
  }

  playPause() {
    if (this.state.playLoopId === null) {
      this.startPlayLoop();
    } else {
      this.stopPlayLoop();
    }
  }

  backward() {
    this.setState((state) => {
      let { actionStep, animationStep } = state;
      const highlights = { ...state.highlights };

      if (animationStep === -1 && actionStep === 0) {
        // We're as far back as we can go, do nothing.
        return {};
      }

      const actionSequence = state.actionSequence;

      animationStep -= 1;

      if (animationStep === -1 && actionStep > 0) {
        actionStep -= 1;
        const action = actionSequence[actionStep];
        const animationSequence = animationSequences[action];
        animationStep = animationSequence.length - 1;
      }

      const action = actionSequence[actionStep];
      const nodes = animationSequences[action][animationStep];

      nodes.forEach((node) => {
        highlights[node] = { action, time: new Date() };
      });

      return { actionStep, animationStep, highlights };
    });
  }

  forward() {
    this.setState((state) => {
      let { actionStep, animationStep } = state;
      const actionSequence = state.actionSequence;
      const highlights = { ...state.highlights };
      let action = actionSequence[actionStep];
      const animationSequence = animationSequences[action];

      if (actionStep === actionSequence.length) {
        // Do nothing if we've gotten to the end of all our steps.
        return {};
      }

      animationStep += 1;

      if (animationStep === animationSequence.length) {
        animationStep = 0;
        actionStep += 1;
      }

      if (actionStep === actionSequence.length) {
        window.clearInterval(state.playLoopId);
        return { actionStep, animationStep, playLoopId: null };
      }

      action = actionSequence[actionStep];
      const nodes = animationSequences[action][animationStep];

      nodes.forEach((node) => {
        highlights[node] = { action, time: new Date() };
      });

      return { actionStep, animationStep, highlights };
    });
  }

  stop() {
    this.setState((state) => {
      window.clearInterval(state.playLoopId);
      return { playLoopId: null, actionStep: 0, animationStep: -1 };
    }, this.reset);
  }

  traceIdSelected(traceId) {
    this.setState((state) => {
      window.clearInterval(state.playLoopId);
      return { traceId, playLoopId: null, actionStep: 0, animationStep: -1 };
    }, this.getTraceData);
  }

  render() {
    /*
    Idea for phasing out older highlights later
      - Store highlights as an object
        - keys are icon names
        - values are arrays of: timestamp when icon updated, action name
      - During loop build up highlight object and store it on this.state
      - Have a separate loop that checks the highlight map and clears any highlights that are older than 1 second,
        except when the highlight is the current active step. Might want to store current step (names + action) on
        state object as well to make this logic easier.
     */
    const width = 1024;
    const height = 500;
    const zoom = this.props.zoom ? this.props.zoom : 1;
    const isPlaying = this.state.playLoopId !== null;
    const highlights = this.state.highlights;

    return (
      <div className="architecture-diagram">
        <div className="main-diagram-container">
          <svg className="diagram-canvas" width={width} height={height}>
            <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
              <SimplifiedDiagram highlights={highlights} />
            </g>
          </svg>

          <TraceIdList
            traceIds={this.state.traceIds}
            currentTraceId={this.state.traceId}
            traceIdSelected={this.traceIdSelected}
          />
        </div>

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
