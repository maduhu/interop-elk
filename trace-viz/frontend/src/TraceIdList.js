import React, { PureComponent } from 'react';

class TraceIdList extends PureComponent {
  render() {
    const { traceIds, currentTraceId } = this.props;
    let body;

    if (traceIds === null) {
      body = (
        <div className="trace-id-list__loading">
          Loading...
        </div>
      );
    } else {
      body = (
        <ul>
          {traceIds.map((traceId) => {
            const className = `trace-id  ${currentTraceId === traceId ? 'trace-id--selected' : ''}`;

            return (
              <li key={traceId} className={className} onClick={() => this.props.traceIdSelected(traceId)}>
                {traceId}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <div className="trace-id-list">
        <div className="trace-id-list__title">
          <h3>Trace IDs:</h3>
        </div>

        {body}
      </div>
    );
  }
}

export default TraceIdList;
