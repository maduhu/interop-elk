import React from 'react';
import Icon from './Icon';

class Dot extends Icon {
  render() {
    const { name, x, y } = this.props;

    return (
      <g className={`dot dot--${name}`}>
        <circle className={this.getColorClass()} cx={x} cy={y} r={10} fill="none" stroke="#000" strokeWidth="1" />
      </g>
    );
  }
}

export default Dot;
