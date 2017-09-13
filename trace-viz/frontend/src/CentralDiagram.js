import React, { PureComponent } from 'react';
import Node from './Node';
import Line from './Line';
import LineAnnotation from './LineAnnotation';
import { MARGIN_LEFT, MARGIN_TOP, DFSP_WIDTH, CENTRAL_WIDTH, SECTION_MARGIN } from './constants';

class CentralDiagram extends PureComponent {
  render() {
    const marginLeft = MARGIN_LEFT + DFSP_WIDTH + SECTION_MARGIN;

    return (
      <g className="central" transform={`translate(${marginLeft},${MARGIN_TOP})`}>
        <text x={CENTRAL_WIDTH / 2} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Central IST
        </text>

        <Node
          className="central-directory"
          x="120"
          y="40"
          height="80"
          text={['Central', 'Directory/', 'Pathfinder']}
        />

        <Node
          className="central-ledger"
          x="120"
          y="290"
          height="340"
          text={['ILP', 'Ledger']}
        />

        {/* Central Ledger to payer ILP Connector (notify fulfilled) */}
        <Line
          className="central-ledger-payment-notify-fulfilled"
          path={[{ x: 120, y: 360 }, { x: -40, y: 480 }]}
          dashed
        />

        <LineAnnotation
          className="central-ledger-payment-notify-fulfilled"
          x="0"
          y="390"
          width="90"
          text={['C.8 notify', '(fulfilled)']}
        />

        {/* Central Ledger to payee ILP Client (notify fulfilled) */}
        <Line
          className="central-ledger-payment-fulfilled"
          path={[{ x: 200, y: 360 }, { x: 350, y: 360 }]}
          dashed
        />

        <LineAnnotation
          className="central-ledger-payment-fulfilled"
          x="220"
          y="335"
          width="90"
          text={['C.8 notify', '(fulfilled)']}
        />

        {/* Central Ledger to payer ILP Connector (notify (prepared)) */}
        <Line className="" path={[{ x: 120, y: 600 }, { x: -30, y: 600 }]} dashed />

        <LineAnnotation className="" x="10" y="575" width="90" text={['C.4 notify', '(prepared)']} />

        {/* Central Ledger to payee ILP Connector (notify prepared) */}
        <Line
          className="central-ledger-payment-notify-prepared"
          path={[{ x: 200, y: 600 }, { x: 350, y: 600 }]}
          dashed
        />

        <LineAnnotation
          className="central-ledger-payment-notify-prepared"
          x="220"
          y="575"
          width="90"
          text={['C.4 notify', '(prepared)']}
        />

        {/* Central Ledger to payee ILP Connector (quote route) */}
        <Line
          className="central-ledger-quote-route"
          path={[{ x: 200, y: 520 }, { x: 350, y: 520 }]}
        />

        <LineAnnotation
          className="central-ledger-payment-quote-route"
          x="215"
          y="505"
          width="100"
          text={['B.4 quote route']}
        />
      </g>
    );
  }
}

export default CentralDiagram;
