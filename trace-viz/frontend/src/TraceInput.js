import React, { Component } from 'react';
import './TraceInput.css';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uuidError = 'Trace ID must be a valid UUID';

function isUUID(str) {
  return uuidRegex.exec(str) !== null;
}

class TraceInput extends Component {
  constructor(props) {
    super(props);
    this.updateTraceId = this.updateTraceId.bind(this);
    this.saveTraceId = this.saveTraceId.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.disableEditMode = this.disableEditMode.bind(this);
    this.state = {
      traceId: '',
      error: '',
      editMode: false,
    };
  }

  updateTraceId(event) {
    const value = event.target.value;

    this.setState(() => {
      let error = '';

      if (!isUUID(value)) {
        error = uuidError;
      }

      return { error, traceId: value };
    });
  }

  saveTraceId() {
    // TODO: validate traceId
    // TODO: render error and don't save if invalid
    // TODO: update traceId via props callback if valid
    const traceId = this.state.traceId;

    if (isUUID(traceId)) {
      this.disableEditMode();
      this.props.updateTraceId(traceId);
    } else {
      this.setState({ error: uuidError });
    }
  }

  enableEditMode() {
    this.setState({ editMode: true, traceId: this.props.traceId });
  }

  disableEditMode() {
    this.setState({ editMode: false, traceId: null, error: '' });
  }

  render() {
    let inpt;
    const traceId = this.props.traceId === '' ? 'Click to enter a trace ID...' : this.props.traceId;
    // const isValid = isUUID(this.state.traceId);

    if (this.state.editMode) {
      inpt = (
        <div className="trace-input__edit trace-input__edit--enabled">
          <label className="trace-input__label" htmlFor="trace-input">
            Trace ID:
          </label>

          <input
            autoFocus
            className="trace-input__input"
            id="trace-input"
            type="text"
            value={this.state.traceId}
            onChange={this.updateTraceId}
          />

          <button className="trace-input__button button button--primary" onClick={this.disableEditMode}>cancel</button>

          <button className="trace-input__button button button--secondary" onClick={this.saveTraceId}>save</button>

          <span className="trace-input__error error">{this.state.error}</span>
        </div>
      );
    } else {
      inpt = (
        <div className="trace-input__edit" onClick={this.enableEditMode}>
          <span className="trace-input__label">Trace ID:</span>
          <span className="trace-input__id">{traceId}</span>
          <span className="trace-input__icon fa fa-edit">&nbsp;</span>
        </div>
      );
    }

    return (
      <div className="trace-input">
        {inpt}
      </div>
    );
  }
}

export default TraceInput;
