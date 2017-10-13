import { PureComponent } from 'react';

const colorMap = {
  lookup: 'color--lookup',
  resolve: 'color--resolve',
  quoteFees: 'color--quote',
  quoteRoute: 'color--quote',
  prepare: 'color--prepare',
  fulfill: 'color--fulfill',
};

class Annotation extends PureComponent {
  constructor(props) {
    super(props);
    this.getColorClass = this.getColorClass.bind(this);
  }

  getColorClass() {
    const { name, highlight, action } = this.props;

    if ((Array.isArray(highlight) && highlight.indexOf(name) > -1) || (highlight !== null && name === highlight)) {
      return colorMap[action];
    }

    return '';
  }
}

export default Annotation;
