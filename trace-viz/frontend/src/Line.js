import React, { PureComponent } from 'react';

class Line extends PureComponent {
  render() {
    const { className, dashed } = this.props;
    const path = this.props.path.map((point, idx) => {
      const { x, y } = point;
      let command = 'L';

      if (idx === 0) {
        command = 'M';
      }

      return `${command}${x},${y}`;
    }).join(' ');

    let sda = null;

    if (dashed) {
      sda = '5, 5';
    }

    return (
      <g className={`line line--${className}`}>
        <path d={path} stroke="#000" strokeWidth={2} fillOpacity="0" markerEnd="url(#arrow)" strokeDasharray={sda} />
      </g>
    );
  }
}

export default Line;
