// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party Libs
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Import Styles
import styles from './styles.css';

const propTypes = {
  content: PropTypes.any,
  isDisabled: PropTypes.bool,
  handleChangeContent: PropTypes.func,
  placeholder: PropTypes.string,
};

const defaultProps = {
  content: '',
  isDisabled: false,
  handleChangeContent: () => void(0),
  placeholder: '',
};

class CKEditorWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.content,
      isDisabled: this.props.isDisabled,
    };
  }

  componentDidMount() {
    const licenseBar = document.querySelector('a[href="https://froala.com/wysiwyg-editor"]');
    const licenseBar2 = document.querySelector('a[href="https://www.froala.com/wysiwyg-editor?k=u"]');

    if (licenseBar) {
      licenseBar.remove();
    }

    if (licenseBar2) {
      licenseBar2.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content) {
      this.setState({ content: nextProps.content });
    }

    if (nextProps.isDisabled !== undefined) {
      this.setState({ isDisabled: nextProps.isDisabled });
    }
  }

  handleModelChange(content) {
    this.setState({
      content,
    }, () => this.props.handleChangeContent(this.state.content));
  }

  render() {
    if (window === undefined) {
      return null;
    }

    const FroalaEditor = require('react-froala-wysiwyg').default; // eslint-disable-line

    const buttonsCustomize = [
      'fullscreen', 'bold', 'italic', 'underline',
      'strikeThrough', 'subscript', 'superscript', '|',
      'fontFamily', 'fontSize', 'color', 'inlineStyle',
      'paragraphStyle', '|', 'paragraphFormat', 'align',
      'formatOL', 'formatUL', 'outdent', 'indent',
      'quote', 'insertLink', 'insertImage',
      'embedly', 'insertTable', '|', 'specialCharacters',
      'insertHR', 'selectAll', 'clearFormatting', '|',
      'html', '|', 'undo', 'redo',
    ];
    const fluginsCustomize = [
      'align', 'charCounter', 'codeBeautifier', 'codeView',
      'colors', 'embedly', 'entities', 'file',
      'fontFamily', 'fontSize', 'fullscreen', 'image',
      'inlineStyle', 'lineBreaker', 'link', 'lists',
      'paragraphFormat', 'paragraphStyle', 'quote',
      'save', 'table', 'url', 'wordPaste',
    ];
    const { isDisabled, content } = this.state;
    const editorClass = `${styles.editor} ${isDisabled ? styles.disabled : ''}`;

    return (
      <div className={editorClass}>
        <div className={styles.disableMask} style={{ zIndex: 99 }} />
        <FroalaEditor
          tag="textarea"
          model={content}
          config={{
            placeholderText: this.props.placeholder,
            charCounterCount: false,
            toolbarButtons: buttonsCustomize,
            pluginsEnabled: fluginsCustomize,
            imageUpload: false,
            quickInsertTags: [''],
            theme: 'gray',
            heightMin: 300,
            spellcheck: false,
          }}
          onModelChange={this.handleModelChange.bind(this)}
        />
      </div>
    );
  }
}

CKEditorWidget.propTypes = propTypes;
CKEditorWidget.defaultProps = defaultProps;

export default CKEditorWidget;
