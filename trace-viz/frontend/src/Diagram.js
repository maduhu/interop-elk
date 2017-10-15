import React, { Component } from 'react';
import request from 'superagent/lib/client';
import DiagramControls from './DiagramControls';
import SimplifiedDiagram from './SimplifiedDiagram';
import ActionButtons from './ActionButtons';
import './Diagram.css';

const ANIMATION_SEQUENCES = {
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
  ],
  notify: [
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

const ALL_SEQUENCES = ['lookup', 'resolve', 'quoteFees', 'quoteRoute', 'prepare', 'fulfill', 'notify'];

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.startPlayLoop = this.startPlayLoop.bind(this);
    this.stopPlayLoop = this.stopPlayLoop.bind(this);
    this.playPause = this.playPause.bind(this);
    this.backward = this.backward.bind(this);
    this.forward = this.forward.bind(this);
    this.stop = this.stop.bind(this);
    this.selectAction = this.selectAction.bind(this);
    this.parsePositions = this.parsePositions.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.startPositionsLoop = this.startPositionsLoop.bind(this);
    this.stopPositionsLoop = this.stopPositionsLoop.bind(this);

    this.state = {
      actionSequence: ALL_SEQUENCES,
      actionStep: 0,
      animationStep: -1,
      payerPosition: null,
      payeePosition: null,
      playLoopId: null,
      positionsLoopId: null,
    };
  }

  componentDidMount() {
    this.startPositionsLoop();
  }

  startPlayLoop() {
    this.setState((state) => {
      let actionStep = state.actionStep;
      let animationStep = state.animationStep;
      const actionSequence = state.actionSequence;
      const nodes = ANIMATION_SEQUENCES[actionSequence[actionStep]];

      if (actionStep === actionSequence.length - 1 && animationStep === nodes.length - 1) {
        // If the user hits play and we have already played from beginning to end then we reset.
        actionStep = 0;
        animationStep = -1;
      }

      return {
        actionStep,
        animationStep,
        playLoopId: window.setInterval(this.forward, 250),
      };
    });
  }

  stopPlayLoop() {
    this.setState((state) => {
      window.clearInterval(state.playLoopId);
      return { playLoopId: null };
    });
  }

  playPause() {
    if (this.state.playLoopId === null) {
      this.startPlayLoop();
    } else {
      this.stopPlayLoop();
    }
  }

  buildHighlights() {
    const { actionStep, animationStep, actionSequence } = this.state;
    const action = actionSequence[actionStep];
    const currentNodes = ANIMATION_SEQUENCES[action];

    if (animationStep > -1) {
      const highlightedNodes = currentNodes.slice(0, animationStep + 1);

      return highlightedNodes.reduce((h, nodes, i) => {
        const isLastNode = i === highlightedNodes.length - 1;
        const color = isLastNode ? `color-${action}--primary` : `color-${action}--secondary`;

        nodes.forEach((node) => {
          h[node] = color; // eslint-disable-line no-param-reassign
        });

        return h;
      }, {});
    }

    return {};
  }

  backward() {
    this.setState((state) => {
      let { actionStep, animationStep, playLoopId } = state;
      const isFirstAnimationStep = animationStep === -1;
      const isFirstActionStep = actionStep === 0;

      if (isFirstAnimationStep && isFirstActionStep) {
        window.clearInterval(playLoopId);
        playLoopId = null;
      } else if (isFirstAnimationStep) {
        actionStep -= 1;
        const action = state.actionSequence[actionStep];
        const nodes = ANIMATION_SEQUENCES[action];
        animationStep = nodes.length - 1;
      } else {
        animationStep -= 1;
      }

      return { actionStep, animationStep, playLoopId };
    });
  }

  forward() {
    this.setState((state) => {
      let { actionStep, animationStep, playLoopId } = state;
      const actionSequence = state.actionSequence;
      const action = actionSequence[actionStep];
      const currentNodes = ANIMATION_SEQUENCES[action];
      const isLastAnimationStep = animationStep === currentNodes.length - 1;
      const isLastActionStep = actionStep === actionSequence.length - 1;

      if (isLastAnimationStep && isLastActionStep) {
        window.clearInterval(playLoopId);
        playLoopId = null;
      } else if (isLastAnimationStep) {
        actionStep += 1;
        animationStep = -1;
      } else {
        animationStep += 1;
      }

      return { actionStep, animationStep, playLoopId };
    });
  }

  stop() {
    this.setState((state) => {
      window.clearInterval(state.playLoopId);
      return { playLoopId: null, actionStep: 0, animationStep: -1, highlights: {} };
    });
  }

  selectAction(action) {
    let startPlayback = false;

    this.setState((state) => {
      let actionSequence;

      if (action === 'all') {
        actionSequence = ALL_SEQUENCES;
      } else {
        actionSequence = [action];
      }

      if (state.playLoopId === null) {
        // Start playback.
        startPlayback = true;
      }

      return { actionSequence, actionStep: 0, animationStep: -1 };
    }, () => {
      if (startPlayback) {
        this.startPlayLoop();
      }
    });
  }

  parsePositions(error, response) {
    const data = response.body;

    if (error === null && data !== null) {
      this.setState(() => {
        const newState = {};

        data.positions.forEach((position) => {
          if (position.account.indexOf('dfsp1') > -1) {
            newState.payerPosition = position.net;
          } else if (position.account.indexOf('dfsp2') > -1) {
            newState.payeePosition = position.net;
          }
        });

        return newState;
      });
    } else {
      console.error(error);
    }
  }

  getPositions() {
    request.get('/positions')
      .auth('dfsp1', 'dfsp1')
      .set('Accept', 'application/json')
      .end(this.parsePositions);
  }
  startPositionsLoop() {
    this.setState(() => {
      return { positionsLoopId: window.setInterval(this.getPositions, 1000) };
    });
  }

  stopPositionsLoop() {
    this.setState((state) => {
      window.clearInterval(state.positionsLoopId);
      return { positionsLoopId: null };
    });
  }

  render() {
    const width = 1024;
    const height = 500;
    const zoom = this.props.zoom ? this.props.zoom : 1;
    const isPlaying = this.state.playLoopId !== null;
    const highlights = this.buildHighlights(this.state);
    const { payerPosition, payeePosition } = this.state;

    return (
      <div className="architecture-diagram">
        <div className="main-diagram-container">
          <svg className="diagram-canvas" width={width} height={height}>
            <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
              <SimplifiedDiagram highlights={highlights} payerPosition={payerPosition} payeePosition={payeePosition} />
            </g>
          </svg>

          <ActionButtons selectAction={this.selectAction} />
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
