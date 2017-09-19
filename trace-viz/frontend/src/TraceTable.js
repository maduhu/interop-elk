import React, { PureComponent } from 'react';
import './TraceTable.css';

class TraceTable extends PureComponent {
  render() {
    return (
      <div className="trace-table-container">
        <table className="trace-table">
          <tbody>
          <tr>
            {/* TODO: what other columns do we want? */}
            <th className="trace-table__header trace-table__header--env">environment</th>
            <th className="trace-table__header trace-table__header--svc">service</th>
            <th className="trace-table__header trace-table__header--msg">log message</th>
          </tr>

          {this.props.data.map((item, idx) => {
            let activeClass = '';

            if (this.props.step === idx) {
              activeClass = 'trace-table__row--active';
            }

            return (
              <tr key={idx} className={`trace-table__row ${activeClass}`} onClick={() => this.props.selectStep(idx)}>
                <td className="trace-table__col">{item.environment}</td>
                <td className="trace-table__col">{item.service}</td>
                <td className="trace-table__col">{item.message}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TraceTable;
