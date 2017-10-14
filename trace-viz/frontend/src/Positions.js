import React, { Component } from 'react';
import request from 'superagent/lib/client';
import './Positions.css';
import exampleData from './example_positions.json';

// For demo purposes we are going to assume that both DFSPs have only 10k available to transfer.
const BANK_TOTAL = 10000;

class Positions extends Component {
  constructor(props) {
    super(props);
    this.parsePositions = this.parsePositions.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.stopLoop = this.stopLoop.bind(this);

    this.state = {
      payerNet: null,
      payeeNet: null,
      loopId: null,
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  parsePositions(error, data) {
    if (error === null && data !== null) {
      this.setState(() => {
        const newState = {};

        data.positions.forEach((position) => {
          if (position.account.indexOf('dfsp1') > -1) {
            newState.payerNet = position.net;
          } else if (position.account.indexOf('dfsp2') > -1) {
            newState.payeeNet = position.net;
          }
        });
        return newState;
      });
    } else {
      console.error(error);
    }
  }

  getPositions() {
    request.get('/positions')
      .auth('dfsp1', 'dfsp1')
      .set('Accept', 'application/json')
      .end(this.parsePositions);
  }

  startLoop() {
    this.setState(() => {
      return { loopId: window.setInterval(this.getPositions, 1000) };
    });
  }

  stopLoop() {
    this.setState((state) => {
      window.clearInterval(state.loopId);
      return { loopId: null };
    });
  }

  calculateDetails(net) {
    if (net === null) {
      return { desc: '', className: 'loading' };
    }

    let percent;
    let desc;
    let className;

    if (net < 0) {
      percent = ((-net) / BANK_TOTAL) * 100;
      desc = `${net} (${percent}%)`;

      if (percent < 50) {
        className = 'ok';
      } else if (percent >= 50 && percent < 75) {
        className = 'warning';
      } else if (percent >= 75) {
        className = 'critical';
      }
    } else {
      desc = net;
      className = 'ok';
    }

    return { desc, className };
  }

  render() {
    const payerDetails = this.calculateDetails(this.state.payerNet);
    const payeeDetails = this.calculateDetails(this.state.payeeNet);

    return (
      <div className="positions">
        <div className="positions__payer">
          <span className="position-label">Payer DFSP:</span>
          <span className={`position-desc ${payerDetails.className}`}>{payerDetails.desc}</span>
        </div>

        <div className="positions__title">
          Net Position View
        </div>

        <div className="positions__payee">
          <span className="position-label">Payee DFSP:</span>
          <span className={`position-desc ${payeeDetails.className}`}>{payeeDetails.desc}</span>
        </div>
      </div>
    );
  }
}

export default Positions;
