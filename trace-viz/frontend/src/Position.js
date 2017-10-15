import React, { PureComponent } from 'react';

class Position extends PureComponent {
  render() {
    const { x, y, name, text, position } = this.props;
    return (
      <g className={`position position--${name}`} transform={`translate(${x}, ${y})`}>
        <text textAnchor="middle" x={75} y={20}>{text}:</text>
        <text textAnchor="middle" x={75} y={45}>{position}</text>
      </g>
    );
  }
}

export default Position;
