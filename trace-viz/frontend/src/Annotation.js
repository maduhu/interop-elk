import React, { PureComponent } from 'react';

const TEXT_Y = 15;

class Annotation extends PureComponent {
  render() {
    const { name, x, y, width, height, color, text } = this.props;
    const colorClass = `color--${color === undefined ? 'annotation-inactive' : color}`;

    return (
      <g className={`annotation annotation--${name}`} transform={`translate(${x}, ${y})`}>
        <rect
          className={colorClass}
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
