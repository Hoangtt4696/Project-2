import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import { SketchPicker } from 'react-color';
import { Button, Input, InputGroup } from 'reactstrap';
import hexToRgb from 'hex-rgb';

// Import Css
import styles from './ColorPicker.css';

const propTypes = {
  color: PropTypes.object,
  name: PropTypes.string,
  handleChangeColor: PropTypes.func,
  hex: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  color: {},
  hex: '',
  disabled: true,
};

class ColorPicker extends Component {
  state = {
    displayColorPicker: false,
    color: this.props.color,
    hex: this.props.hex,
    isDisabled: this.props.disabled,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.color) {
      this.parseRgb(nextProps.color);
    }

    if (nextProps.hex) {
      this.setState({
        hex: nextProps.hex,
      });
    }

    if (typeof nextProps.disabled !== 'undefined') {
      this.setState({
        isDisabled: nextProps.disabled,
      });
    }
  }

  parseRgb(rgbObject) {
    const rgb = {};

    rgb.r = rgbObject.red;
    rgb.g = rgbObject.green;
    rgb.b = rgbObject.blue;
    rgb.a = rgbObject.alpha;

    this.setState({
      color: rgb,
    });
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (colors) => {
    this.setState({
      color: colors.rgb,
      hex: colors.hex,
    }, () => {
      this.props.handleChangeColor({ name: this.props.name, color: this.state.hex });
    });
  };

  handleChangeInput(e) {
    this.setState({
      hex: e.target.value,
      color: hexToRgb(e.target.value),
    });
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  render() {
    const { color, displayColorPicker, hex, isDisabled } = this.state;
    const styleButton = {
      backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      border: '1px solid #CFD6DB',
    };

    return (
      <InputGroup>
        <Input
          disabled={isDisabled}
          type="text"
          value={hex}
          className={styles.ipValue}
          readOnly
          onChange={this.handleChangeInput.bind(this)}
        />
        <Button disabled={isDisabled} style={styleButton} onClick={this.handleClick} >&nbsp;&nbsp;</Button>
        {displayColorPicker ? (<div className={styles.popover}>
          <div className={styles.cover} onClick={this.handleClose} />
          <SketchPicker disableAlpha color={hex} onChange={this.handleChange} />
        </div>) : null}
      </InputGroup>
    );
  }
}

ColorPicker.propTypes = propTypes;

ColorPicker.defaultProps = defaultProps;

export default ColorPicker;
