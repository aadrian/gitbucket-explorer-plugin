import React, { PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import LocalStorageMixin from 'react-localstorage';
import request from 'superagent';
import FileNodes from './FileNodes';
import { stopAutoScroll } from './scroll';

export default class Directory extends React.Component {
  static get propTypes() {
    return {
      url: PropTypes.string,
      name: PropTypes.string,
      current: PropTypes.bool
    };
  }
  static get getDefaultProps() {
    return {
      url: '',
      name: '',
      current: false
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      children: [],
      expanded: false,
    };
  }

  // also runs when the expanded flag is restored from localStorage
  componentDidUpdate(prevProps, prevState) {
    if (this.state.expanded && !prevState.expanded) {
      request
        .get(this.getExploreUrl())
        .end((err, res) => {
          if (err || !this.state.expanded) {
            return;
          }
          try {
            this.setState({ children: JSON.parse(res.text) });
          } catch (e) {
            // not JSON, e.g. a sign-in page after the session expired
          }
        });
    }
  }

  getLocalStorageKey() {
    return this.props.url;
  }

  // persist only the expanded flag; children are always loaded from the server
  // eslint-disable-next-line class-methods-use-this
  getStateFilterKeys() {
    return ['expanded'];
  }

  getExploreUrl() {
    return this.props.url;
  }

  toggleFolder() {
    stopAutoScroll();
    if (this.state.expanded) {
      this.setState({
        expanded: false,
        children: []
      });
    } else {
      this.setState({ expanded: true });
    }
  }

  render() {
    const arrow = this.state.expanded ? 'octicon octicon-chevron-down' : 'octicon octicon-chevron-right';
    return (
      <li className={this.props.current ? 'folder-node current' : 'folder-node'}>
        <button className="folder-expander" onClick={() => this.toggleFolder()}>
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