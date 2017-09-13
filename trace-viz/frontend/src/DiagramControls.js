import React, { PureComponent } from 'react';
import './DiagramControls.css';

class DiagramControls extends PureComponent {
  render() {
    const playCls = this.props.isPlaying ? 'pause' : 'play';

    return (
      <div className="diagram-controls">
        <span className="diagram-controls__control fa fa-step-backward" onClick={this.props.backward} />

        <span className={`diagram-controls__control fa fa-${playCls}`} onClick={this.props.playPause} />

        <span className="diagram-controls__control fa fa-stop" onClick={this.props.stop} />

        <span className="diagram-controls__control fa fa-step-forward" onClick={this.props.forward} />
      </div>
    );
  }
}

export default DiagramControls;
