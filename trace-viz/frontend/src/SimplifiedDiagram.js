import React, { PureComponent } from 'react';
import Node from './Node';
import Dot from './Dot';
import Position from './Position';
import { NODE_WIDTH } from './constants';
import Annotation from './Annotation';
import Database from './Database';

class SimplifiedDiagram extends PureComponent {
  render() {
    const { action, highlights, payerPosition, payeePosition } = this.props;
    const annotationPadding = 10;
    const skinnyAnnotationWidth = 150;
    const wideAnnotationWidth = (2 * skinnyAnnotationWidth) + (2 * annotationPadding) + NODE_WIDTH;
    const annotationHeight = 20;
    const yPadding = 20;
    const dotXPadding = 30;
    const dotYPadding = 60;
    const defaultNodeHeight = 120;
    const labelsY = 30;

    // Pathfinder row
    const firstRowY = 50;

    // DFSP Logic Row
    const secondRowY = firstRowY + 70;

    // Ledger Adapter Row
    const thirdRowY = secondRowY + yPadding + defaultNodeHeight;

    // Database Dots row
    const fourthRowY = thirdRowY + defaultNodeHeight + yPadding;

    // Database Row
    const fifthRowY = fourthRowY + yPadding;

    // First Column for Payer Nodes
    const firstColX = 10;

    // Column for Payer Dots
    const secondColX = firstColX + NODE_WIDTH + dotXPadding;

    // Second Column for Payer Nodes
    const thirdColX = secondColX + dotXPadding;

    // Column between Payer and Central Nodes
    const fourthColX = thirdColX + NODE_WIDTH + annotationPadding;

    // Column for Central Nodes
    const fifthColX = fourthColX + skinnyAnnotationWidth + annotationPadding;

    // Column between Central and Payee Nodes
    const sixthColX = fifthColX + NODE_WIDTH + annotationPadding;

    // Column for first Payee Nodes
    const seventhColX = sixthColX + skinnyAnnotationWidth + annotationPadding;

    // Column for Payee Dots
    const eighthColX = seventhColX + NODE_WIDTH + dotXPadding;

    // Column for Second Payee Nodes
    const ninthColX = eighthColX + dotXPadding;

    // Column for Payee Conditions
    const tenthColX = ninthColX + NODE_WIDTH + annotationPadding;

    return (
      <g className="simplified-diagram">
        <g className="titles">
          <text fontSize={18} x={70} y={labelsY} fontWeight="bold">Payer DFSP</text>
          <text fontSize={18} x={fifthColX} y={labelsY} fontWeight="bold">Central IST</text>
          <text fontSize={18} x={710} y={labelsY} fontWeight="bold">Payee DFSP</text>
        </g>

        {/* Pathfinder Row */}

        <Dot
          name="pathfinder-dot"
          action={action}
          highlights={highlights}
          x={sixthColX + annotationPadding}
          y={secondRowY - annotationPadding}
        />

        <Node
          name="pathfinder"
          action={action}
          highlights={highlights}
          x={sixthColX + dotXPadding}
          y={firstRowY}
          height={60}
          text={['Pathfinder']}
          dashed
        />

        {/* DFSP Row */}

        <Node
          name="payer-dfsp-logic"
          action={action}
          highlights={highlights}
          x={firstColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Logic']}
        />

        <Dot
          name="payer-dfsp-logic-dot"
          action={action}
          highlights={highlights}
          x={secondColX}
          y={secondRowY + dotYPadding}
        />

        <Node
          name="payer-scheme-adapter"
          action={action}
          highlights={highlights}
          x={thirdColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['Scheme', 'Adapter']}
        />

        <Annotation
          name="lookup-identifier"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={secondRowY + (2 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Lookup Identifier"
        />

        <Annotation
          name="resolve-recipient"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={secondRowY + (7 * annotationPadding)}
          width={wideAnnotationWidth}
          height={annotationHeight}
          text="Resolve Recipient"
        />

        <Annotation
          name="quote-fees"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={secondRowY + (10 * annotationPadding)}
          width={wideAnnotationWidth}
          height={annotationHeight}
          text="Quote Scheme Fees"
        />

        <Node
          name="central-directory"
          action={action}
          highlights={highlights}
          x={fifthColX}
          y={secondRowY}
          height={defaultNodeHeight / 2}
          text={['Central', 'Directory']}
        />

        <Node
          name="payee-scheme-adapter"
          action={action}
          highlights={highlights}
          x={seventhColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['Scheme', 'Adapter']}
        />

        <Dot
          name="payee-dfsp-logic-dot"
          action={action}
          highlights={highlights}
          x={eighthColX}
          y={secondRowY + dotYPadding}
        />

        <Node
          name="payee-dfsp-logic"
          action={action}
          highlights={highlights}
          x={ninthColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Logic']}
        />

        <Node
          name="create-condition"
          action={action}
          highlights={highlights}
          x={tenthColX + dotXPadding}
          y={secondRowY + (defaultNodeHeight / 4)}
          height={defaultNodeHeight / 2}
          text={['Create', 'Condition']}
          dashed
        />

        {/* Ledger Adapter Row */}

        <Node
          name="payer-ledger-adapter"
          action={action}
          highlights={highlights}
          x={firstColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['Ledger', 'Adapter']}
        />

        <Dot
          name="payer-ledger-adapter-dot"
          action={action}
          highlights={highlights}
          x={secondColX}
          y={thirdRowY + dotYPadding}
        />

        <Node
          name="payer-dfsp-connector"
          action={action}
          highlights={highlights}
          x={thirdColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Connector']}
        />

        <Annotation
          name="payer-quote-route"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={thirdRowY + annotationPadding}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Quote Route"
        />

        <Annotation
          name="payer-prepare"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={thirdRowY + (4.5 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Prepare"
        />

        <Annotation
          name="payer-notify-fulfillment"
          action={action}
          highlights={highlights}
          x={fourthColX}
          y={thirdRowY + (8 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Notify Fulfillment"
        />

        <Node
          name="central-ist"
          action={action}
          highlights={highlights}
          x={fifthColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['IST']}
        />

        <Annotation
          name="payee-quote-route"
          action={action}
          highlights={highlights}
          x={sixthColX}
          y={thirdRowY + annotationPadding}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Quote Route"
        />

        <Annotation
          name="payee-prepare"
          action={action}
          highlights={highlights}
          x={sixthColX}
          y={thirdRowY + (4.5 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Prepare"
        />

        <Annotation
          name="payee-notify-fulfillment"
          action={action}
          highlights={highlights}
          x={sixthColX}
          y={thirdRowY + (8 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Notify Fulfillment"
        />

        <Node
          name="payee-dfsp-connector"
          action={action}
          highlights={highlights}
          x={seventhColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Connector']}
        />

        <Dot
          name="payee-ledger-adapter-dot"
          action={action}
          highlights={highlights}
          x={eighthColX}
          y={thirdRowY + dotYPadding}
        />

        <Node
          name="payee-ledger-adapter"
          action={action}
          highlights={highlights}
          x={ninthColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['Ledger', 'Adapter']}
        />

        <Node
          name="evaluate-condition"
          action={action}
          highlights={highlights}
          x={tenthColX + dotXPadding}
          y={thirdRowY + yPadding}
          height={NODE_WIDTH}
          rotate={45}
          text={['Evaluate', 'Condition']}
        />

        {/* Database Dot Row */}

        <Dot
          name="payer-ledger-db-dot"
          action={action}
          highlights={highlights}
          x={firstColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        <Dot
          name="central-ledger-db-dot"
          action={action}
          highlights={highlights}
          x={fifthColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        <Dot
          name="payee-ledger-db-dot"
          action={action}
          highlights={highlights}
          x={ninthColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        {/* Database Row */}

        <Database
          name="payer-ledger-db"
          action={action}
          highlights={highlights}
          x={firstColX}
          y={fifthRowY}
          text="DFSP Ledger"
        />

        <Position
          name="payer-position"
          text="DFSP 1 Position"
          position={payerPosition}
          x={fourthColX}
          y={fifthRowY}
        />

        <Database
          name="central-ledger-db"
          action={action}
          highlights={highlights}
          x={fifthColX}
          y={fifthRowY}
          text="IST Ledger"
        />

        <Position
          name="payee-position"
          text="DFSP 2 Position"
          position={payeePosition}
          x={sixthColX}
          y={fifthRowY}
        />

        <Database
          name="payee-ledger-db"
          action={action}
          highlights={highlights}
          x={ninthColX}
          y={fifthRowY}
          text="DFSP Ledger"
        />
      </g>
    );
  }
}

export default SimplifiedDiagram;
