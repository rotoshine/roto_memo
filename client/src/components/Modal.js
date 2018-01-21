import './Modal.css';

import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.getElementById('modal-root');

export default class Modal extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.element
  }

  constructor(props) {
    super(props);

    this.el = document.createElement('div');    
    this.el.className = 'Modal';    
  }

  componentDidMount() {    
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}