import React, { PureComponent } from 'react';

class Dot extends PureComponent {
  render() {
    const { name, x, y } = this.props;

    return (
      <g className={`dot dot--${name}`}>
        <circle cx={x} cy={y} r={10} fill="none" stroke="#000" strokeWidth="1" />
      </g>
    );
  }
}

export default Dot;
