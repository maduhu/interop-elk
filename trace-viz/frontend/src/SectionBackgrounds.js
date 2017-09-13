import React, { PureComponent } from 'react';
import { MARGIN_LEFT, DFSP_WIDTH, SECTION_MARGIN, CENTRAL_WIDTH } from './constants';

class SectionBackgrounds extends PureComponent {
  render() {
    const payerOffset = MARGIN_LEFT;
    const centralOffset = MARGIN_LEFT + DFSP_WIDTH + SECTION_MARGIN;
    const payeeOffset = MARGIN_LEFT + DFSP_WIDTH + CENTRAL_WIDTH + (2 * SECTION_MARGIN);
    const fill = 'rgb(80, 200, 232)';

    return (
      <g className="section-backgrounds">
        <rect x={payerOffset} y="0" width={DFSP_WIDTH} height="100%" fill={fill} fillOpacity="0.1" />
        <rect x={centralOffset} y="0" width={CENTRAL_WIDTH} height="100%" fill={fill} fillOpacity="0.1" />
        <rect x={payeeOffset} y="0" width={DFSP_WIDTH} height="100%" fill={fill} fillOpacity="0.1" />
      </g>
    );
  }
}

export default SectionBackgrounds;
