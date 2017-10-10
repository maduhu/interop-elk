import React, { PureComponent } from 'react';
import Node from './Node';
import Dot from './Dot';
import { NODE_WIDTH } from './constants';
import Annotation from './Annotation';
import Database from './Database';

class SimplifiedDiagram extends PureComponent {
  render() {
    const annotationPadding = 10;
    const skinnyAnnotationWidth = 150;
    const wideAnnotationWidth = (2 * skinnyAnnotationWidth) + (2 * annotationPadding) + NODE_WIDTH;
    const annotationHeight = 20;
    const yPadding = 20;
    const dotXPadding = 30;
    const dotYPadding = 60;
    const defaultNodeHeight = 120;

    const firstRowY = 10;
    const secondRowY = firstRowY + 70;
    const thirdRowY = secondRowY + yPadding + defaultNodeHeight;
    const fourthRowY = thirdRowY + defaultNodeHeight + yPadding;
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
        {/* Pathfinder Row */}
        <Dot
          name="pathfinder"
          x={sixthColX + annotationPadding}
          y={secondRowY - annotationPadding}
        />

        <Node
          name="pathfinder"
          x={sixthColX + dotXPadding}
          y={firstRowY}
          height={60}
          text={['Pathfinder']}
          dashed
        />

        {/* DFSP Row */}

        <Node
          name="payer-dfsp-logic" x={firstColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Logic']}
        />

        <Dot
          name="payer-dfsp-logic-to-payer-interop-scheme-adapter"
          x={secondColX}
          y={secondRowY + dotYPadding}
        />

        <Node
          name="payer-interop-scheme-adapter"
          x={thirdColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['Scheme', 'Adapter']}
        />

        <Annotation
          x={fourthColX}
          y={secondRowY + (2 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Lookup Identifier"
        />

        <Annotation
          x={fourthColX}
          y={secondRowY + (7 * annotationPadding)}
          width={wideAnnotationWidth}
          height={annotationHeight}
          text="Resolve Recipient"
        />

        <Annotation
          x={fourthColX}
          y={secondRowY + (10 * annotationPadding)}
          width={wideAnnotationWidth}
          height={annotationHeight}
          text="Quote Scheme Fees"
        />

        <Node
          name="central-directory"
          x={fifthColX}
          y={secondRowY}
          height={defaultNodeHeight / 2}
          text={['Central', 'Directory']}
        />

        <Node
          name="payee-interop-scheme-adapter"
          x={seventhColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['Scheme', 'Adapter']}
        />

        <Dot
          name="payee-interop-scheme-adapter-to-payee-dfsp-logic"
          x={eighthColX}
          y={secondRowY + dotYPadding}
        />

        <Node
          name="payee-dfsp-logic"
          x={ninthColX}
          y={secondRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Logic']}
        />

        {/* TODO: Make create condition a cloud icon */}
        <Node
          name="create-condition"
          x={tenthColX}
          y={secondRowY + (defaultNodeHeight / 2)}
          height={defaultNodeHeight / 2}
          text={['Create', 'Condition']}
          dashed
        />

        {/* Ledger Adapter Row */}

        <Node
          name="payer-interop-ledger-adapter"
          x={firstColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['Ledger', 'Adapter']}
        />

        <Dot
          name="payer-ledger-adapter-to-payer-dfsp-connector"
          x={secondColX}
          y={thirdRowY + dotYPadding}
        />

        <Node
          name="payer-dfsp-connector"
          x={thirdColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Connector']}
        />

        <Annotation
          x={fourthColX}
          y={thirdRowY + annotationPadding}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Quote Route"
        />

        <Annotation
          x={fourthColX}
          y={thirdRowY + (4.5 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Prepare"
        />

        <Annotation
          x={fourthColX}
          y={thirdRowY + (8 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Notify Fulfillment"
        />

        <Node
          name="central-ist"
          x={fifthColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['IST']}
        />

        <Annotation
          x={sixthColX}
          y={thirdRowY + annotationPadding}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Quote Route"
        />

        <Annotation
          x={sixthColX}
          y={thirdRowY + (4.5 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Prepare"
        />

        <Annotation
          x={sixthColX}
          y={thirdRowY + (8 * annotationPadding)}
          width={skinnyAnnotationWidth}
          height={annotationHeight}
          text="Notify Fulfillment"
        />

        <Node
          name="payee-dfsp-connector"
          x={seventhColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['DFSP', 'Connector']}
        />

        <Dot
          name="payee-dfs-connector-to-payee-interop-ledger-adapter"
          x={eighthColX}
          y={thirdRowY + dotYPadding}
        />

        <Node
          name="payee-interop-ledger-adapter"
          x={ninthColX}
          y={thirdRowY}
          height={defaultNodeHeight}
          text={['Ledger', 'Adapter']}
        />

        <Node
          name="evaluate-condition"
          x={tenthColX + dotXPadding}
          y={thirdRowY + dotYPadding}
          height={NODE_WIDTH}
          rotate={45}
          text={['Evaluate', 'Condition']}
        />

        {/* Database Dot Row */}

        <Dot
          name="payer-ledger-adapter-db"
          x={firstColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        <Dot
          name="ist-db"
          x={fifthColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        <Dot
          name="payee-ledger-adapter-db"
          x={ninthColX + (NODE_WIDTH / 2)}
          y={fourthRowY}
        />

        <Dot
          name="eval-condition-to-payee-ledger-adapter-db"
          x={tenthColX + 10}
          y={fourthRowY + 10}
        />

        {/* Database Row */}

        <Database
          name="payer-ledger-adapter-db"
          x={firstColX}
          y={fifthRowY}
        />

        <Database
          name="ist-db"
          x={fifthColX}
          y={fifthRowY}
        />

        <Database
          name="payee-ledger-adapter-db"
          x={ninthColX}
          y={fifthRowY}
        />
      </g>
    );
  }
}

export default SimplifiedDiagram;
