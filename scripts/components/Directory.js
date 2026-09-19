import React, { PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import LocalStorageMixin from 'react-localstorage';
import request from 'superagent';
import FileNodes from './FileNodes';

export default class Directory extends React.Component {

  static get propTypes() {
    return {
      url: PropTypes.string,
      name: PropTypes.string
    };
  }
  static get getDefaultProps() {
    return {
      url: '',
      name: ''
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      children: [],
      expanded: false,
    };
  }

  getLocalStorageKey() {
    return this.props.url;
  }

  toggleFolder(path) {
    if (this.state.expanded) {
      this.setState({
        expanded: false,
        children: []
      });
    } else {
      this.setState({ expanded: true });
      request
        .get(path)
        .end((err, res) => {
          if (err) {
            return;
          }
          try {
            this.setState({ children: JSON.parse(res.text) });
          } catch (e) {
            return;
          }
        });
    }
  }

  render() {
    const arrow = this.state.expanded ? 'octicon octicon-chevron-down' : 'octicon octicon-chevron-right';
    return (
      <li className="folder-node">
        <button className="folder-expander" onClick={() => this.toggleFolder(this.props.url)}>
          <i className={arrow} />
          <i className="menu-icon octicon octicon-file-directory" />
          {this.props.name}
        </button>
        <FileNodes data={this.state.children} style={this.state.expanded ? {} : { display: 'none' }} />
      </li>
    );
  }
}
ReactMixin(Directory.prototype, LocalStorageMixin);