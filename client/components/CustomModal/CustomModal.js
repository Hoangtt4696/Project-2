// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party Components
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from 'react-modal-bootstrap';

// Import Styles
import styles from './styles.css';

// Component Props Define
const propTypes = {
  header: PropTypes.element,
  footer: PropTypes.element,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

const defaultProps = {
  header: null,
  footer: null,
  isOpen: false,
};

class CustomModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.isOpen,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== undefined) {
      this.setState({
        isOpen: nextProps.isOpen,
      });
    }
  }

  hideModal() {
    this.setState({
      isOpen: false,
    });

    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  render() {
    const { className, header, footer, ...customProps } = this.props;
    const { isOpen } = this.state;
    const customClassName = `${className || ''} ${styles.customModal}`;

    if (customProps) {
      delete customProps.isOpen;
    }

    return (
      <Modal
        isOpen={isOpen}
        onRequestHide={this.hideModal.bind(this)}
        className={customClassName}
        {...customProps}
      >
        <ModalHeader>
          <ModalClose onClick={this.hideModal.bind(this)} />
          <ModalTitle>
            {header}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {this.props.children}
        </ModalBody>
        <ModalFooter>
          {footer}
        </ModalFooter>
      </Modal>
    );
  }
}

CustomModal.propTypes = propTypes;
CustomModal.defaultProps = defaultProps;

export default CustomModal;
