import { PureComponent } from 'react';
import { has } from './utils';

class Icon extends PureComponent {
  constructor(props) {
    super(props);
    this.getColorClass = this.getColorClass.bind(this);
  }

  getColorClass() {
    const { name, highlights } = this.props;

    return has.call(highlights, name) ? highlights[name] : '';
  }
}

export default Icon;
