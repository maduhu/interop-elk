import React, { PureComponent } from 'react';
import Node from './Node';
import Line from './Line';
import LineAnnotation from './LineAnnotation';
import { MARGIN_LEFT, MARGIN_TOP, DFSP_WIDTH } from './constants';

class PayerDiagram extends PureComponent {
  render() {
    return (
      <g className="payer-dfsp" transform={`translate(${MARGIN_LEFT},${MARGIN_TOP})`}>
        <text x={MARGIN_LEFT + (DFSP_WIDTH / 2)} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Payer DFSP
        </text>

        <Node className="payer-dfsp-logic" x="10" y="160" height="200" text={['DFSP', 'Logic']} />

        <Node className="payer-dfsp-ledger" x="10" y="480" height="150" text={['Ledger']} />

        <Node
          className="payer-interop-dfsp-directory"
          x="240"
          y="40"
          height="100"
          text={['DFSP', 'Directory', 'Gateway']}
        />

        <Node
          className="payer-interop-scheme-adapter"
          x="240"
          y="160"
          height="200"
          text={['Scheme', 'Adapter']}
        />

        <Node
          className="payer-interop-ilp-ledger"
          x="240"
          y="480"
          height="150"
          text={['ILP', 'Ledger', 'Adapter']}
        />

        <Node className="payer-ilp-service" x="460" y="200" height="80" text={['ILP', 'Service']} />

        <Node className="payer-ilp-client" x="460" y="290" height="80" text={['ILP', 'Client']} />

        <Node className="payer-ilp-connector" x="460" y="480" height="150" text={['ILP', 'Connector']} />

        {/* DFSP Logic to DFSP Directory Gateway */}
        <Line
          className="payer-dfsp-logic-lookup"
          path={[{ x: 50, y: 160 }, { x: 50, y: 90 }, { x: 240, y: 90 }]}
        />

        <LineAnnotation
          className="payer-dfsp-logic-lookup"
          x="105"
          y="75"
          width="100"
          text={['A. lookup']}
        />

        {/* DFSP Directory Gateway to Central Directory */}
        <Line
          className="payer-interop-dfsp-directory-lookup"
          path={[{ x: 320, y: 80 }, { x: 690, y: 80 }]}
        />

        <LineAnnotation
          className="payer-interop-dfsp-directory-lookup"
          x="330"
          y="65"
          width="120"
          text={['A.1 user lookup']}
        />

        {/* Payer DFSP Directory Gateway to Payee Interop Scheme Adapter */}
        <Line
          className="payer-interop-dfsp-directory-payee-details"
          path={[{ x: 320, y: 130 }, { x: 1150, y: 130 }]}
        />

        <LineAnnotation
          className="payer-interop-dfsp-directory-payee-details"
          x="330"
          y="115"
          width="120"
          text={['A.2 payee details']}
        />

        {/* Payer Interop Scheme Adatper to Payee Interop Scheme Adapter */}
        <Line
          className="payer-interop-scheme-adapter-quote-fees"
          path={[{ x: 320, y: 170 }, { x: 1150, y: 170 }]}
        />

        <LineAnnotation
          className="payer-interop-scheme-adapter-to-quote-fees"
          x="330"
          y="155"
          width="120"
          text={['B.1 quote fees']}
        />

        {/* DFSP Logic to Interop Scheme Adapter (quote fees and route) */}
        {/* TODO: modify className so it can have quote-fees and quote-route */}
        <Line
          className="payer-dfsp-logic-quote"
          path={[{ x: 90, y: 220 }, { x: 240, y: 220 }]}
        />

        <LineAnnotation
          className="payer-dfsp-logic-quote"
          x="105"
          y="195"
          width="110"
          text={['B. quote', '(fees and route)']}
        />

        {/* DFSP Logic to Interop Scheme Adapter (payment) */}
        <Line
          className="payer-dfsp-logic-payment"
          path={[{ x: 90, y: 320 }, { x: 240, y: 320 }]}
        />

        <LineAnnotation
          className="payer-dfsp-logic-payment"
          x="105"
          y="305"
          width="110"
          text={['C. payment']}
        />

        {/* Interop Scheme Adapter to ILP Service */}
        <Line
          className="payer-interop-scheme-adapter-quote-route"
          path={[{ x: 320, y: 220 }, { x: 460, y: 220 }]}
        />

        <LineAnnotation
          className="payer-interop-scheme-adapter-quote-route"
          x="330"
          y="205"
          width="100"
          text={['B.4 quote route']}
        />

        {/* Interop Scheme Adapter to ILP Client */}
        <Line
          className="payer-interop-scheme-adapter-payment"
          path={[{ x: 320, y: 300 }, { x: 460, y: 300 }]}
        />

        <LineAnnotation
          className="payer-interop-scheme-adapter-payment"
          x="335"
          y="285"
          width="90"
          text={['C.1 rest']}
        />

        {/* Interop ILP Adapter to ILP Client (notify) */}
        {/* TODO: verify that it's ok to highlight both notification arrows at the same time */}
        <Line
          className="payer-interop-ilp-ledger-notify"
          path={[{ x: 240, y: 480 }, { x: 460, y: 310 }]}
          dashed
        />

        <LineAnnotation
          className="payer-interop-ilp-ledger-notify"
          x="250"
          y="365"
          width="145"
          text={['C.2 notify (prepared)', 'C.9 notify (fulfilled)']}
        />

        {/* ILP Client to Interop ILP Adapter */}
        <Line
          className="payer-ilp-client-to-payment-prepare"
          path={[{ x: 460, y: 370 }, { x: 320, y: 480 }]}
        />

        <LineAnnotation
          className="payer-ilp-client-payment-prepare"
          x="320"
          y="425"
          width="145"
          text={['C..1 rest (prepare)']}
        />

        {/* ILP Client to ILP connector */}
        <Line
          className="payer-ilp-client-quote-route"
          path={[{ x: 500, y: 370 }, { x: 500, y: 480 }]}
        />

        <LineAnnotation
          className="payer-ilp-client-quote-route"
          x="445"
          y="380"
          width="110"
          text={['B.4 quote route']}
        />

        {/* ILP Connector to ILP Ledger Adapter */}
        <Line
          className="payer-ilp-connector-payment-fulfill"
          path={[{ x: 460, y: 500 }, { x: 320, y: 500 }]}
        />

        <LineAnnotation
          className="payer-ilp-connector-payment-fullfill"
          x="355"
          y="475"
          width="90"
          text={['C.8.1 rest', '(fulfill)']}
        />

        {/* ILP Ledger Adapter to ILP Connector */}
        {/* TODO: verify that it's ok to highlight both notification arrows at the same time */}
        <Line
          className="payer-interop-ilp-ledger-payment-notify"
          path={[{ x: 320, y: 570 }, { x: 460, y: 570 }]}
          dashed
        />

        <LineAnnotation
          className="payer-interop-ilp-ledger-payment-notify"
          x="335"
          y="545"
          width="90"
          text={['C.2 notify', '(prepared)', 'C.9 notify', '(fulfilled)']}
        />

        {/* ILP Ledger Adapter to Ledger */}
        {/*
          TODO: allow multiple classNames so we can have payment-prepare and payment-fulfill OR just have multiple lines
          and annotations for this.
        */}
        <Line
          className="payer-interop-ilp-ledger-payment"
          path={[{ x: 240, y: 500 }, { x: 90, y: 500 }]}
        />

        <LineAnnotation
          className="payer-interop-ilp-ledger-payment"
          x="135"
          y="475"
          width="70"
          text={['C.1.1', 'C.8.1']}
        />


        {/* Ledger to ILP Ledger Adapter */}
        <Line
          className="payer-dfsp-ledger-transfer-status"
          path={[{ x: 90, y: 600 }, { x: 240, y: 600 }]}
        />

        <LineAnnotation
          className="payer-dfsp-ledger-transfer-status"
          x="100"
          y="575"
          width="110"
          text={['D. get transfer', 'status']}
        />

        {/* ILP Ledger Adapter to Central Ledger */}
        <Line
          className="payer-interop-ilp-ledger-transfer-status"
          path={[{ x: 280, y: 630 }, { x: 280, y: 660 }, { x: 730, y: 660 }, { x: 730, y: 630 }]}
        />

        <LineAnnotation
          className="payer-interop-ilp-ledger-transfer-status"
          x="310"
          y="645"
          width="160"
          text={['D.1 get transfer status']}
        />

        {/* ILP Connector to Central Ledger (quote route) */}
        <Line
          className="payer-ilp-connector-quote-route"
          path={[{ x: 540, y: 500 }, { x: 690, y: 500 }]}
        />

        <LineAnnotation
          className="payer-ilp-connector-quote-route"
          x="550"
          y="485"
          width="110"
          text={['B.4 quote route']}
        />

        {/* ILP Connector to Central Ledger (rest (prepare)) */}
        <Line
          className="payer-ilp-connector-to-payment-prepare"
          path={[{ x: 540, y: 550 }, { x: 690, y: 550 }]}
        />

        <LineAnnotation
          className="payer-ilp-connector-to-payment-prepare"
          x="550"
          y="535"
          width="110"
          text={['C.3 rest (prepare)']}
        />
      </g>
    );
  }
}

export default PayerDiagram;
