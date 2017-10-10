import React, { PureComponent } from 'react';
import { NODE_WIDTH } from './constants';

class Node extends PureComponent {
  render() {
    const { x, y, height, name, text, rotate, dashed } = this.props;
    let textY;
    let rotateStr = '';
    let sda = null;

    if (text.length > 1) {
      // This wonderfully magic incantation ensures that our text is centered vertically for the most part.
      // It's awful because SVG is awful.
      textY = (height / 2) - (Math.max(24, 17 * (text.length - 1)));
    } else {
      textY = (height / 2) - 15;
    }

    if (rotate) {
      rotateStr += `rotate(${rotate} ${NODE_WIDTH / 2} ${height / 2})`;
    }

    if (dashed) {
      sda = '5, 5';
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
          strokeDasharray={sda}
        />
        <text textAnchor="middle" y={textY}>
          {text.map((t, i) => <tspan key={i} x={NODE_WIDTH / 2} dy="20">{t}</tspan>)}
        </text>
      </g>
    );
  }
}

export default Node;
