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
    const { name, highlights } = this.props;

    if (highlights[name]) {
      return colorMap[highlights[name].action];
    }

    return '';
  }
}

export default Annotation;
