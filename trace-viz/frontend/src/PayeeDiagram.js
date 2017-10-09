import React, { PureComponent } from 'react';
import Node from './Node';
import Line from './Line';
import LineAnnotation from './LineAnnotation';
import { MARGIN_TOP, MARGIN_LEFT, DFSP_WIDTH, SECTION_MARGIN, CENTRAL_WIDTH } from './constants';

class PayeeDiagram extends PureComponent {
  render() {
    const marginLeft = MARGIN_LEFT + DFSP_WIDTH + CENTRAL_WIDTH + (2 * SECTION_MARGIN);

    return (
      <g className="payee" transform={`translate(${marginLeft},${MARGIN_TOP})`}>

        <text x={DFSP_WIDTH / 2} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Payee DFSP
        </text>

        <Node name="payee-dfsp-logic" x="460" y="80" height="270" text={['DFSP', 'Logic']} />

        <Node name="payee-dfsp-ledger" x="460" y="480" height="150" text={['Ledger']} />

        <Node
          className="payee-interop-scheme-adapter"
          x="240"
          y="80"
          height="270"
          text={['Scheme', 'Adapter']}
        />

        <Node
          className="payee-interop-ilp-ledger"
          x="240"
          y="480"
          height="150"
          text={['ILP', 'Ledger', 'Adapter']}
        />

        <Node name="payee-ilp-service" x="10" y="200" height="80" text={['ILP', 'Service']} />

        <Node name="payee-ilp-client" x="10" y="290" height="80" text={['ILP', 'Client']} />

        <Node name="payee-ilp-connector" x="10" y="480" height="150" text={['ILP', 'Connector']} />

        {/* Interop Scheme Adapter to DFSP Logic (payee details) */}
        <Line className="payee-interop-scheme-adapter-payee-details" path={[{ x: 320, y: 130 }, { x: 460, y: 130 }]} />

        <LineAnnotation
          className="payee-interop-scheme-adapter-payee-details"
          x="340"
          y="100"
          width="90"
          text={['A.2.1 payee', 'details']}
        />

        {/* Interop Scheme Adapter to DFSP Logic (quote fees) */}
        <Line className="payee-interop-scheme-adapter-quote-fees" path={[{ x: 320, y: 180 }, { x: 460, y: 180 }]} />

        <LineAnnotation
          className="payee-interop-scheme-adapter-quote-fees"
          x="340"
          y="155"
          width="90"
          text={['B.2 quote', 'fees']}
        />

        {/* Interop Scheme Adapter to DFSP Logic (validate prepare) */}
        <Line
          className="payee-interop-scheme-adapter-payment-prepare"
          path={[{ x: 320, y: 310 }, { x: 460, y: 310 }]}
        />

        <LineAnnotation
          className="payee-interop-scheme-adapter-payment-prepare"
          x="340"
          y="285"
          width="90"
          text={['C.6.2 validate', 'prepare']}
        />

        {/* Interop Scheme Adapter to ILP Service */}
        <Line className="payee-interop-scheme-adapter-quote-ilp" path={[{ x: 240, y: 240 }, { x: 90, y: 240 }]} />

        <LineAnnotation
          className="payee-interop-scheme-adapter-quote-ilp"
          x="130"
          y="215"
          width="90"
          text={['B.3 get ILP', 'IPR']}
        />

        {/* ILP Client to Central Ledger */}
        <Line className="payee-ilp-client-payment-fulfill" path={[{ x: 10, y: 310 }, { x: -140, y: 310 }]} />

        <LineAnnotation
          className="payee-ilp-client-payment-fulfill"
          x="-105"
          y="295"
          width="100"
          text={['C.7 rest (fulfill)']}
        />

        {/* ILP Client to Interop Scheme Adapter */}
        {/*
          TODO: determine if we are using the appropriate className, this line is labeled as C.9 the one above that
          shares the same className is labeled as C.7
        */}
        <Line className="payee-ilp-client-payment-fulfill" path={[{ x: 90, y: 310 }, { x: 240, y: 310 }]} />

        <LineAnnotation
          className="payee-ilp-client-payment-fulfill"
          x="110"
          y="285"
          width="90"
          text={['C.6.1 validate', 'prepare']}
        />

        {/* ILP Connector to Interop ILP Ledger Adapter */}
        <Line className="payee-ilp-connector-payment-prepare" path={[{ x: 90, y: 520 }, { x: 240, y: 520 }]} />
        <LineAnnotation
          className="payee-ilp-connector-payment-prepare"
          x="110"
          y="495"
          width="90"
          text={['C.5 rest', '(prepare)']}
        />

        {/* Interop ILP Ledger Adapter to ILP Connector (notify) */}
        <Line
          className="payee-interop-ilp-ledger-payment-notify"
          path={[{ x: 240, y: 600 }, { x: 90, y: 600 }]}
          dashed
        />
        <LineAnnotation
          className="payee-interop-ilp-ledger-payment-notify"
          x="130"
          y="565"
          width="90"
          text={['C.6 notify', 'prepared', 'C.9 notify', '(fulfilled)']}
        />

        {/* Interop ILP Ledger Adapter to Ledger */}

        <Line
          className="payee-interop-ilp-ledger-payment"
          path={[{ x: 320, y: 560 }, { x: 460, y: 560 }]}
        />
        <LineAnnotation
          className="payee-interop-ilp-ledger-payment"
          x="350"
          y="535"
          width="70"
          text={['C.5.1', 'C.9.1']}
        />

        {/* Interop ILP Ledger Adapter to ILP Client */}
        <Line
          className="payee-interop-ilp-ledger-payment-notify"
          path={[{ x: 315, y: 480 }, { x: 90, y: 370 }]}
          dashed
        />

        <LineAnnotation
          className="payee-interop-ilp-ledger-payment-notify"
          x="180"
          y="410"
          width="120"
          text={['C.6 notify (prepared)']}
        />

        {/* ILP Client to Interop ILP Ledger Adapter */}
        <Line
          className="payee-interop-ilp-ledger-payment-fulfill"
          path={[{ x: 10, y: 370 }, { x: 240, y: 480 }]}
        />

        <LineAnnotation
          className="payee-interop-ilp-ledger-payment-fulfill"
          x="40"
          y="410"
          width="110"
          text={['C.9 rest (fulfill)']}
        />
      </g>
    );
  }
}

export default PayeeDiagram;
