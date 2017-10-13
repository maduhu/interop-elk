import React from 'react';
import Icon from './Icon';

const TEXT_Y = 15;

class Annotation extends Icon {
  render() {
    const { name, x, y, width, height, text } = this.props;

    return (
      <g className={`annotation annotation--${name}`} transform={`translate(${x}, ${y})`}>
        <rect
          className={this.getColorClass()}
          fill="#aaaaaa"
          x="0"
          y="0"
          width={width}
          height={height}
          rx="12"
          ry="12"
        />
        <text textAnchor="middle" fontSize={14} x={width / 2} y={TEXT_Y}>
          {text}
        </text>
      </g>
    );
  }
}

export default Annotation;
