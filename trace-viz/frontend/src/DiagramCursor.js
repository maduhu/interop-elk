import React, { Component } from 'react';
import * as d3 from 'd3';
import './DiagramCursor.css';

function Cursor(el) {
  const cursor = {};
  let path = null;

  cursor.path = (...args) => {
    if (!args.length) {
      return path;
    }

    path = args[0];

    return cursor;
  };

  cursor.render = () => {
    console.log(d3.select(el));

    return cursor;
  };

  return cursor;
}


class DiagramCursor extends Component {
  /**
   * TODO: use d3 to render a cursor and move/animate it around when state changes.
   */
  static shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.cursor = Cursor(this.el);
  }

  componentWillReceiveProps(props) {
    let dirty = false;
    // eslint-disable-next-line eqeqeq
    if (props.path != this.props.path) {
      console.log('Step has changed!');
      this.cursor.path(props.path);
      dirty = true;
    }

    if (dirty) {
      this.cursor.render();
    }
  }

  render() {
    return <g className="diagram-cursor" ref={el => (this.el = el)} />;
  }
}

export default DiagramCursor;
