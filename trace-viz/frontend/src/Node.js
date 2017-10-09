import React, { PureComponent } from 'react';
import { NODE_WIDTH } from './constants';

class Node extends PureComponent {
  render() {
    const { x, y, height, name, text, rotate } = this.props;

    // This wonderfully magic incantation ensures that our text is centered vertically for the most part.
    // It's awful because SVG is awful.
    const textY = (height / 2) - (Math.max(24, 17 * (text.length - 1)));
    let rotateStr = '';

    if (rotate) {
      rotateStr += `rotate(${rotate} ${NODE_WIDTH / 2} ${height / 2})`;
    }

    return (
      <g className={`node node--${name}`} transform={`translate(${x}, ${y})`}>
        <rect
          fill="#fff"
          stroke="#000"
          width={NODE_WIDTH}
          height={height}
          x="0"
          y="0"
          rx="8"
          ry="8"
          transform={rotateStr}
        />
        <text textAnchor="middle" y={textY}>
          {text.map((t, i) => <tspan key={i} x={NODE_WIDTH / 2} dy="20">{t}</tspan>)}
        </text>
      </g>
    );
  }
}

export default Node;
