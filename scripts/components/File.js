import React, { PropTypes } from 'react';

export default class File extends React.Component {
  static get propTypes() {
    return {
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      current: PropTypes.bool,
    };
  }
  static get defaultProps() {
    return {
      current: false,
    };
  }

  render() {
    return (
      <li className={this.props.current ? 'file-node current' : 'file-node'}>
        <a href={this.props.url}>
          <i className="menu-icon octicon octicon-file" />
          {this.props.name}
        </a>
      </li>
    );
  }
}