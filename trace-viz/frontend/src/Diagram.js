import React, { Component, PureComponent } from 'react';
import DiagramControls from './DiagramControls';
import DiagramCursor from './DiagramCursor';
import ExampleResponse from './example_response.json';
// import * as d3 from 'd3';
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
      <g className={className} transform={`translate(${x}, ${y})`}>
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
      <g className={className} transform={`translate(${x}, ${y})`}>
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
      <g className={className}>
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
          className="l--payer-dfsp-logic-to-payer-interop-dfsp-directory"
          path={[{ x: 50, y: 160 }, { x: 50, y: 90 }, { x: 240, y: 90 }]}
        />

        <LineAnnotation
          className="la---payer-dfsp-logic-to-payer-interop-dfsp-directory"
          x="105"
          y="75"
          width="100"
          text={['A. lookup']}
        />

        {/* DFSP Directory Gateway to Central Directory */}
        <Line
          className="l--payer-interop-dfsp-directory-to-central-directory"
          path={[{ x: 320, y: 80 }, { x: 690, y: 80 }]}
        />

        <LineAnnotation
          className="la--payer-interop-dfsp-directory-to-central-directory"
          x="330"
          y="65"
          width="120"
          text={['A.1 user lookup']}
        />

        {/* Payer DFSP Directory Gateway to Payee Interop Scheme Adapter */}
        <Line
          className="l--payer-interop-dfsp-directory-to-payee-interop-scheme-adapter"
          path={[{ x: 320, y: 130 }, { x: 1150, y: 130 }]}
        />

        <LineAnnotation
          className="la--payer-interop-dfsp-directory-to-payee-interop-scheme-adapter"
          x="330"
          y="115"
          width="120"
          text={['A.2 payee details']}
        />

        {/* Payer Interop Scheme Adatper to Payee Interop Scheme Adapter */}
        <Line
          className="l--payer-interop-scheme-adapter-to-payee-interop-scheme-adapter"
          path={[{ x: 320, y: 170 }, { x: 1150, y: 170 }]}
        />

        <LineAnnotation
          className="la--payer-interop-scheme-adapter-to-payee-interop-scheme-adapter"
          x="330"
          y="155"
          width="120"
          text={['B.1 quote fees']}
        />

        {/* DFSP Logic to Interop Scheme Adapter (quote fees and route) */}
        <Line
          className="l--payer-dfsp-logic-to-payer-interop-scheme-adapter"
          path={[{ x: 90, y: 220 }, { x: 240, y: 220 }]}
        />

        <LineAnnotation
          className="la--payer-dfsp-logic-to-payer-interop-scheme-adapter-quote"
          x="105"
          y="195"
          width="110"
          text={['B. quote', '(fees and route)']}
        />

        {/* DFSP Logic to Interop Scheme Adapter (payment) */}
        <Line
          className="l--payer-dfsp-logic-to-payer-interop-scheme-adapter-payment"
          path={[{ x: 90, y: 320 }, { x: 240, y: 320 }]}
        />

        <LineAnnotation
          className="la--payer-dfsp-logic-to-payer-interop-scheme-adapter-payment"
          x="105"
          y="305"
          width="110"
          text={['C. payment']}
        />

        {/* Interop Scheme Adapter to ILP Service */}
        <Line
          className="l--payer-interop-scheme-adapter-to-payer-ilp-service"
          path={[{ x: 320, y: 220 }, { x: 460, y: 220 }]}
        />

        <LineAnnotation
          className="la--payer-interop-scheme-adapter-to-payer-ilp-service"
          x="330"
          y="205"
          width="100"
          text={['B.4 quote route']}
        />

        {/* Interop Scheme Adapter to ILP Client */}
        <Line
          className="l--payer-interop-scheme-adapter-to-payer-ilp-client"
          path={[{ x: 320, y: 300 }, { x: 460, y: 300 }]}
        />

        <LineAnnotation
          className="la--payer-interop-scheme-adapter-to-payer-ilp-client"
          x="335"
          y="285"
          width="90"
          text={['C.1 rest']}
        />

        {/* Interop ILP Adapter to ILP Client (notify) */}
        <Line
          className="l--payer-interop-ilp-ledger-to-payer-ilp-client"
          path={[{ x: 240, y: 480 }, { x: 460, y: 310 }]}
          dashed
        />

        <LineAnnotation
          className="la--payer-interop-ilp-ledger-to-payer-ilp-client"
          x="250"
          y="365"
          width="145"
          text={['C.2 notify (prepared)', 'C.9 notify (fulfilled)']}
        />

        {/* ILP Client to Interop ILP Adapter */}
        <Line
          className="l--payer-ilp-client-to-payer-interop-ilp-ledger"
          path={[{ x: 460, y: 370 }, { x: 320, y: 480 }]}
        />

        <LineAnnotation
          className="la--payer-ilp-client-to-payer-interop-ilp-ledger"
          x="320"
          y="425"
          width="145"
          text={['C..1 rest (prepare)']}
        />

        {/* ILP Client to ILP connector */}
        <Line
          className="l--payer-ilp-client-to-payer-ilp-connector"
          path={[{ x: 500, y: 370 }, { x: 500, y: 480 }]}
        />

        <LineAnnotation
          className="la--payer-ilp-client-to-payer-ilp-connector"
          x="445"
          y="380"
          width="110"
          text={['B.4 quote route']}
        />

        {/* ILP Connector to ILP Ledger Adapter */}
        <Line
          className="l--payer-ilp-connector-to-payer-interop-ilp-ledger"
          path={[{ x: 460, y: 500 }, { x: 320, y: 500 }]}
        />

        <LineAnnotation
          className="l--payer-ilp-connector-to-payer-interop-ilp-ledger"
          x="355"
          y="475"
          width="90"
          text={['C.8.1 rest', '(fulfill)']}
        />

        {/* ILP Ledger Adapter to ILP Connector */}
        <Line
          className="l--payer-interop-ilp-ledger-to-payer-ilp-connector"
          path={[{ x: 320, y: 570 }, { x: 460, y: 570 }]}
          dashed
        />

        <LineAnnotation
          className="la--payer-interop-ilp-ledger-to-payer-ilp-connector"
          x="335"
          y="545"
          width="90"
          text={['C.2 notify', '(prepared)', 'C.9 notify', '(fulfilled)']}
        />

        {/* ILP Ledger Adapter to Ledger */}
        <Line
          className="l--payer-interop-ilp-ledger-to-payer-dfsp-ledger"
          path={[{ x: 240, y: 500 }, { x: 90, y: 500 }]}
        />

        <LineAnnotation
          className="la--payer-interop-ilp-ledger-to-payer-dfsp-ledger"
          x="135"
          y="475"
          width="70"
          text={['C.1.1', 'C.8.1']}
        />


        {/* Ledger to ILP Ledger Adapter */}
        <Line
          className="l--payer-dfsp-ledger-to-payer-interop-ilp-ledger"
          path={[{ x: 90, y: 600 }, { x: 240, y: 600 }]}
        />

        <LineAnnotation
          className="la--payer-dfsp-ledger-to-payer-interop-ilp-ledger"
          x="100"
          y="575"
          width="110"
          text={['D. get transfer', 'status']}
        />

        {/* ILP Ledger Adapter to Central Ledger */}
        <Line
          className="l--payer-interop-ilp-ledger-to-central-ledger"
          path={[{ x: 280, y: 630 }, { x: 280, y: 660 }, { x: 730, y: 660 }, { x: 730, y: 630 }]}
        />

        <LineAnnotation
          className="la--payer-interop-ilp-ledger-to-central-ledger"
          x="310"
          y="645"
          width="160"
          text={['D.1 get transfer status']}
        />

        {/* ILP Connector to Central Ledger (quote route) */}
        <Line
          className="l--payer-ilp-connector-to-central-ledger-quote"
          path={[{ x: 540, y: 500 }, { x: 690, y: 500 }]}
        />

        <LineAnnotation
          className="la--payer-ilp-connector-to-central-ledger-quote"
          x="550"
          y="485"
          width="110"
          text={['B.4 quote route']}
        />

        {/* ILP Connector to Central Ledger (rest (prepare)) */}
        <Line
          className="l--payer-ilp-connector-to-central-ledger-payment"
          path={[{ x: 540, y: 550 }, { x: 690, y: 550 }]}
        />

        <LineAnnotation
          className="la--payer-ilp-connector-to-central-ledger-payment"
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
          className="central-ilp-ledger"
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
    this.updatePath = this.updatePath.bind(this);

    this.state = {
      data: { ...ExampleResponse },
      path: null,
    };
  }

  updatePath(path) {
    this.setState(() => ({ path }));
  }

  render() {
    /**
     * Thoughts: using react to render base canvas seems like the best idea because it's static, then we can create a
     * component that is just used to handle rendering and animating some sort of "cursor" object on the canvas. We can
     * even use JSX to render the base canvas (and make parts of it dynamic if needed).
     */
    const width = (DFSP_WIDTH * 2) + CENTRAL_WIDTH + (SECTION_MARGIN * 2);
    const height = 680;
    const zoom = this.props.zoom ? this.props.zoom : 1;

    return (
      <div className="architecture-diagram">
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
          </defs>

          <g className="diagram-zoom-container" transform={`scale(${zoom})`}>
            {/* Render the section backgrounds first so everything is rendered on top of them */}
            <SectionBackgrounds />

            <PayerDiagram />

            <CentralDiagram />

            <PayeeDiagram />
          </g>

          <DiagramCursor path={this.state.path} />
        </svg>

        <DiagramControls {...this.props} data={this.state.data} />
      </div>
    );
  }
}

export default Diagram;
