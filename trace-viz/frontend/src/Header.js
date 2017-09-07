import React, { PureComponent } from 'react';
import TraceInput from './TraceInput';
import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <div className="header">
        {/*<div className="header__title">*/}
          {/*Welcome to TraceViz*/}
        {/*</div>*/}

        <TraceInput traceId={this.props.traceId} updateTraceId={this.props.updateTraceId} />
      </div>
    );
  }
}

export default Header;
