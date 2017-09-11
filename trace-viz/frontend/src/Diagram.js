import React, { Component, PureComponent } from 'react';
import DiagramControls from './DiagramControls';
import ExampleResponse from './example_response.json';
import './Diagram.css';

const MARGIN_TOP = 0;
const MARGIN_LEFT = 0;
const SECTION_MARGIN = 20;
const DFSP_WIDTH = 550;
const CENTRAL_WIDTH = 320;
const BOX_WIDTH = 80;

class DiagramNode extends PureComponent {
  render() {
    const { x, y, height, className, text } = this.props;

    // This wonderfully magic incantation ensures that our text is centered vertically for the most part.
    // It's awful because SVG is awful.
    const textY = (height / 2) - (Math.max(24, 17 * (text.length - 1)));

    return (
      <g className={`node node--${className}`} transform={`translate(${x}, ${y})`}>
        <rect fill="#fff" stroke="#000" width={BOX_WIDTH} height={height} x="0" y="0" />
        <text textAnchor="middle" y={textY}>
          {text.map((t, i) => <tspan key={i} x={BOX_WIDTH / 2} dy="20">{t}</tspan>)}
        </text>
      </g>
    );
  }
}

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

class PayerDiagram extends PureComponent {
  render() {
    return (
      <g className="payer-dfsp" transform={`translate(${MARGIN_LEFT},${MARGIN_TOP})`}>
        <text x={MARGIN_LEFT + (DFSP_WIDTH / 2)} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Payer DFSP
        </text>

        <DiagramNode className="payer-dfsp-logic" x="10" y="160" height="200" text={['DFSP', 'Logic']} />

        <DiagramNode className="payer-dfsp-ledger" x="10" y="480" height="150" text={['Ledger']} />

        <DiagramNode
          className="payer-interop-dfsp-directory"
          x="240"
          y="40"
          height="100"
          text={['DFSP', 'Directory', 'Gateway']}
        />

        <DiagramNode
          className="payer-interop-scheme-adapter"
          x="240"
          y="160"
          height="200"
          text={['Scheme', 'Adapter']}
        />

        <DiagramNode
          className="payer-interop-ilp-ledger"
          x="240"
          y="480"
          height="150"
          text={['ILP', 'Ledger', 'Adapter']}
        />

        <DiagramNode className="payer-ilp-service" x="460" y="200" height="80" text={['ILP', 'Service']} />

        <DiagramNode className="payer-ilp-client" x="460" y="290" height="80" text={['ILP', 'Client']} />

        <DiagramNode className="payer-ilp-connector" x="460" y="480" height="150" text={['ILP', 'Connector']} />

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

class CentralDiagram extends PureComponent {
  render() {
    const marginLeft = MARGIN_LEFT + DFSP_WIDTH + SECTION_MARGIN;

    return (
      <g className="central" transform={`translate(${marginLeft},${MARGIN_TOP})`}>
        <text x={CENTRAL_WIDTH / 2} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Central IST
        </text>

        <DiagramNode
          className="central-directory"
          x="120"
          y="40"
          height="80"
          text={['Central', 'Directory/', 'Pathfinder']}
        />

        <DiagramNode
          className="central-ledger"
          x="120"
          y="290"
          height="340"
          text={['ILP', 'Ledger']}
        />

        {/* Central Ledger to payer ILP Connector (notify fulfilled) */}
        <Line path={[{ x: 120, y: 360 }, { x: -40, y: 480 }]} dashed />
        <LineAnnotation x="0" y="390" width="90" text={['C.8 notify', '(fulfilled)']} />

        {/* Central Ledger to payer ILP Connecor (notify (prepared)) */}
        <Line path={[{ x: 120, y: 600 }, { x: -30, y: 600 }]} dashed />
        <LineAnnotation x="10" y="575" width="90" text={['C.4 notify', '(prepared)']} />

        {/* Central Ledger to payee ILP Client (notify fulfilled) */}
        <Line path={[{ x: 200, y: 360 }, { x: 350, y: 360 }]} dashed />
        <LineAnnotation x="220" y="335" width="90" text={['C.8 notify', '(fulfilled)']} />

        {/* Central Ledger to payee ILP Connector (notify prepared) */}
        <Line path={[{ x: 200, y: 520 }, { x: 350, y: 520 }]} />
        <LineAnnotation x="215" y="505" width="100" text={['B.4 quote route']} />

        {/* Central Ledger to payee ILP Connector (notify prepared) */}
        <Line path={[{ x: 200, y: 600 }, { x: 350, y: 600 }]} dashed />
        <LineAnnotation x="220" y="575" width="90" text={['C.4 notify', '(prepared)']} />
      </g>
    );
  }
}

class PayeeDiagram extends PureComponent {
  render() {
    const marginLeft = MARGIN_LEFT + DFSP_WIDTH + CENTRAL_WIDTH + (2 * SECTION_MARGIN);

    return (
      <g className="payee" transform={`translate(${marginLeft},${MARGIN_TOP})`}>

        <text x={DFSP_WIDTH / 2} y="15" textAnchor="middle" fontSize={18} fontWeight="bold">
          Payee DFSP
        </text>

        <DiagramNode className="payee-dfsp-logic" x="460" y="80" height="270" text={['DFSP', 'Logic']} />

        <DiagramNode className="payee-dfsp-ledger" x="460" y="480" height="150" text={['Ledger']} />

        <DiagramNode
          className="payee-interop-scheme-adapter"
          x="240"
          y="80"
          height="270"
          text={['Scheme', 'Adapter']}
        />

        <DiagramNode
          className="payee-interop-ilp-ledger"
          x="240"
          y="480"
          height="150"
          text={['ILP', 'Ledger', 'Adapter']}
        />

        <DiagramNode className="payee-ilp-service" x="10" y="200" height="80" text={['ILP', 'Service']} />

        <DiagramNode className="payee-ilp-client" x="10" y="290" height="80" text={['ILP', 'Client']} />

        <DiagramNode className="payee-ilp-connector" x="10" y="480" height="150" text={['ILP', 'Connector']} />

        {/* Interop Scheme Adapter to DFSP Logic (payee details) */}
        <Line path={[{ x: 320, y: 130 }, { x: 460, y: 130 }]} />
        <LineAnnotation x="340" y="100" width="90" text={['A.2.1 payee', 'details']} />

        {/* Interop Scheme Adapter to DFSP Logic (quote fees) */}
        <Line path={[{ x: 320, y: 180 }, { x: 460, y: 180 }]} />
        <LineAnnotation x="340" y="155" width="90" text={['B.2 quote', 'fees']} />

        {/* Interop Scheme Adapter to DFSP Logic (validate prepare) */}
        <Line path={[{ x: 320, y: 310 }, { x: 460, y: 310 }]} />
        <LineAnnotation x="340" y="285" width="90" text={['C.6.2 validate', 'prepare']} />

        {/* Interop Scheme Adapter to ILP Service */}
        <Line path={[{ x: 240, y: 240 }, { x: 90, y: 240 }]} />
        <LineAnnotation x="130" y="215" width="90" text={['B.3 get ILP', 'IPR']} />

        {/* ILP Client to Central Ledger */}
        <Line path={[{ x: 10, y: 310 }, { x: -140, y: 310 }]} />
        <LineAnnotation x="-105" y="295" width="100" text={['C.7 rest (fulfill)']} />

        {/* ILP Client to Interop Scheme Adapter */}
        <Line path={[{ x: 90, y: 310 }, { x: 240, y: 310 }]} />
        <LineAnnotation x="110" y="285" width="90" text={['C.6.1 validate', 'prepare']} />

        {/* ILP Connector to Interop ILP Ledger Adapter */}
        <Line path={[{ x: 90, y: 520 }, { x: 240, y: 520 }]} />
        <LineAnnotation x="110" y="495" width="90" text={['C.5 rest', '(prepare)']} />

        {/* Interop ILP Ledger Adapter to ILP Connector (notify) */}
        <Line path={[{ x: 240, y: 600 }, { x: 90, y: 600 }]} dashed />
        <LineAnnotation x="130" y="565" width="90" text={['C.6 notify', 'prepared', 'C.9 notify', '(fulfilled)']} />

        {/* Interop ILP Ledger Adapter to Ledger */}
        <Line path={[{ x: 320, y: 560 }, { x: 460, y: 560 }]} />
        <LineAnnotation x="350" y="535" width="70" text={['C.5.1', 'C.9.1']} />

        {/* Interop ILP Ledger Adapter to ILP Client */}
        <Line path={[{ x: 315, y: 480 }, { x: 90, y: 370 }]} dashed />
        <LineAnnotation x="180" y="410" width="120" text={['C.6 notify (prepared)']} />

        {/* ILP Client to Interop ILP Ledger Adapter */}
        <Line path={[{ x: 10, y: 370 }, { x: 240, y: 480 }]} />
        <LineAnnotation x="40" y="410" width="110" text={['C.9 rest (fulfill)']} />
      </g>
    );
  }
}

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


class Diagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data is the raw data from the server, we probably don't actually need to store it on state but we haven't
      // implemented the server code for getting data quite yet.
      data: { ...ExampleResponse },
      // path is the processed data that
      path: [
        // TODO: modify className on Line and LineAnnotation so it can have quote-fees and quote-route
        ['payer-dfsp-logic', 'quote'],
        ['payer-interop-scheme-adapter', 'quote-route'],
        ['payer-ilp-service', 'quote-route'],
        ['payer-ilp-client', 'quote-route'],
        ['payer-ilp-connector', 'quote-route'],
      ],
    };
  }

  render() {
    const width = (DFSP_WIDTH * 2) + CENTRAL_WIDTH + (SECTION_MARGIN * 2);
    const height = 680;
    const zoom = this.props.zoom ? this.props.zoom : 1;

    return (
      <div className="architecture-diagram">
        <DiagramControls {...this.props} path={this.state.path} />

        <svg className="diagram-canvas" width={width} height={height}>
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#000" />
            </marker>

            <marker
              id="arrow--selected"
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#060" />
            </marker>
          </defs>

          <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
            {/* Render the section backgrounds first so everything is rendered on top of them */}
            <SectionBackgrounds />

            <PayerDiagram />

            <CentralDiagram />

            <PayeeDiagram />
          </g>
        </svg>
      </div>
    );
  }
}

export default Diagram;
