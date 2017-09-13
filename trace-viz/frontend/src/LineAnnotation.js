import React, { PureComponent } from 'react';

class LineAnnotation extends PureComponent {
  render() {
    const { x, y, width, className, text } = this.props;

    // This wonderfully magic incantation ensures that our text is centered vertically for the most part.
    // It's awful because SVG is awful.
    // const textY = (height / 2) - (Math.max(24, 17 * (text.length - 1)));
    const textY = 0;
    const height = 10 + (text.length * 20);

    return (
      <g className={`annotation annotation--${className}`} transform={`translate(${x}, ${y})`}>
        <rect fill="#ffffff" stroke="#000" width={width} height={height} x="0" y="0" rx="15" ry="15" />
        <text textAnchor="middle" y={textY} fontSize={12}>
          {text.map((t, i) => <tspan key={i} x={width / 2} dy="20">{t}</tspan>)}
        </text>
      </g>
    );
  }
}

export default LineAnnotation;
