import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import {
  ModalHeader,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalTitle,
} from 'react-modal-bootstrap';
import { FormGroup, Input, Label } from 'reactstrap';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';

// Import Css
import styles from './ModalExport.css';

const propsTypes = {
  isOpen: PropTypes.bool,
  handleIsOpen: PropTypes.func,
};

const defaultProps = {
  isOpen: false,
};

class ModalExport extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.isOpen,
      typeExport: 'filter',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.isOpen !== 'undefined') {
      this.setState({
        isOpen: nextProps.isOpen,
      });
    }
  }

  hideModal = () => {
    this.setState({
      isOpen: false,
    }, () => {
      this.props.handleIsOpen(this.state.isOpen);
    });
  };

  handleExport = () => {
    this.hideModal();
    this.props.handleExport(this.state.typeExport);
  };

  handleChangeTypeExport(type) {
    this.setState({
      typeExport: type,
    });
  }

  render() {
    const { getIntl } = this.props;

    return (
      <div className={styles.wrapModalExport}>
        <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
          <ModalHeader>
            <ModalClose onClick={this.hideModal} />
            <ModalTitle>{getIntl('title')}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <FormGroup tag="fieldset">
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="radio1" defaultChecked onClick={this.handleChangeTypeExport.bind(this, 'filter')} />{' '}
                  {getIntl('filterBySearch')}
                </Label>
              </FormGroup>
              <br />
              <FormGroup check>
                <Label check>
                  <Input type="radio" onClick={this.handleChangeTypeExport.bind(this, 'chosen')} name="radio1" />{' '}
                  {getIntl('filterByCoupon')}
                </Label>
              </FormGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-default" onClick={this.hideModal}>
              {getIntl('btnCancel')}
            </button>
            <button className="btn btn-primary" onClick={this.handleExport}>
              {getIntl('btnExport')}
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ModalExport.propTypes = propsTypes;
ModalExport.defaultProps = defaultProps;

export default withIntl({
  prefix: 'components.modalExport',
})(ModalExport);
