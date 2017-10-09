import React, { PureComponent } from 'react';

class Database extends PureComponent {
  render() {
    const { name, x, y } = this.props;
    const curveY = 20;
    const left = 0;
    const right = 80;
    const top = 20;
    const bottom = 60;
    const pathStr = [
      `M ${left} ${top} C ${right * 0.02} ${top - curveY}, ${right * 0.98} ${top - curveY}, ${right} ${top}`,
      `C ${right * 0.98} 40, ${right * 0.02} 40, ${left} ${top}`,
      `L ${left}, ${bottom}`,
      `C ${right * 0.02} ${bottom + curveY}, ${right * 0.98} ${bottom + curveY}, ${right} ${bottom}`,
      `L ${right}, ${top}`,
    ].join('');

    return (
      <g className={`database database--${name}`} transform={`translate(${x}, ${y})`}>
        <path d={pathStr} fill="none" stroke="#000000" />
      </g>
    );
  }
}

export default Database;
