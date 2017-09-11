import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import './DiagramControls.css';

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

class DiagramControls extends PureComponent {
  constructor(props) {
    super(props);
    this.startPlayLoop = this.startPlayLoop.bind(this);
    this.stopPlayLoop = this.stopPlayLoop.bind(this);
    this.playPause = this.playPause.bind(this);
    this.back = this.back.bind(this);
    this.forward = this.forward.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);

    window.reset = this.reset;
    window.play = this.playPause;
    window.stop = this.stop;

    this.state = {
      step: null,
      loopId: null,
    };
  }

  componentDidMount() {
    if (this.props.path !== null) {
      console.log('Mounted with path, start playing');
      this.playPause();
    }
  }

  componentWillReceiveProps(props) {
    if (props.path !== this.props.path) {
      console.log('Path changed, stop all animations, reset state, and start playing');
      this.reset();
    }
  }

  startPlayLoop() {
    this.setState((state) => {
      let step = state.step;

      if (step === this.props.path.length - 1) {
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

  back() {
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

  animateStep(step) {
    const [node, action] = this.props.path[step];
    animateNodeAndEdge(node, action, 400, STROKE_START, STROKE_END, FILL_START, FILL_END);
  }

  forward() {
    this.setState((state) => {
      let step = state.step;

      if (step === null) {
        step = 0;
      } else if (step !== this.props.path.length - 1) {
        step += 1;
      }

      this.animateStep(step);

      if (step === this.props.path.length - 1) {
        // If we've reached the last step we can stop the loop.
        window.clearInterval(state.loopId);
        return { step, loopId: null };
      }

      return { step };
    });
  }

  reset() {
    const allElements = d3.select('svg').selectAll('*');

    this.props.path.forEach((item) => {
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
    const playPause = this.state.loopId === null ? 'play' : 'pause';

    return (
      <div className="diagram-controls">
        <span className="diagram-controls__control fa fa-step-backward" onClick={this.back} />

        <span className={`diagram-controls__control fa fa-${playPause}`} onClick={this.playPause} />

        <span className="diagram-controls__control fa fa-stop" onClick={this.stop} />

        <span className="diagram-controls__control fa fa-step-forward" onClick={this.forward} />
      </div>
    );
  }
}

export default DiagramControls;
