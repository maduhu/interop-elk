import React, { PureComponent } from 'react';
import './ActionButtons.css';

class ActionButton extends PureComponent {
  render() {
    const { name, label, onClick } = this.props;

    return (
      <button className={`action-button action-button--${name}`} onClick={() => onClick(name)}>
        {label}
      </button>
    );
  }
}

class ActionButtons extends PureComponent {
  render() {
    return (
      <div className="action-buttons">
        <ActionButton name="all" label="A" onClick={this.props.selectAction} />

        <ActionButton name="lookup" label="L" onClick={this.props.selectAction} />

        <ActionButton name="resolve" label="R" onClick={this.props.selectAction} />

        <ActionButton name="quoteFees" label="QF" onClick={this.props.selectAction} />

        <ActionButton name="quoteRoute" label="QR" onClick={this.props.selectAction} />

        <ActionButton name="prepare" label="P" onClick={this.props.selectAction} />

        <ActionButton name="fulfill" label="F" onClick={this.props.selectAction} />

        <ActionButton name="notify" label="N" onClick={this.props.selectAction} />
      </div>
    );
  }
}

export default ActionButtons;
