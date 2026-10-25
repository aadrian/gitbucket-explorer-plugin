import React, { PropTypes } from 'react';
import File from './File';
import Directory from './Directory';
import { scrollToCurrent } from './scroll';

// compare decoded paths without trailing slash,
// the browser and the server may encode them differently
function normalizePath(path) {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch (e) {
    // keep it as it is
  }
  return decoded.replace(/\/+$/, '');
}

export default class FileNodes extends React.Component {
  static get propTypes() {
    return {
      data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        isDirectory: PropTypes.bool.isRequired,
      })).isRequired,
    };
  }

  componentDidMount() {
    scrollToCurrent(this.list);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      scrollToCurrent(this.list);
    }
  }

  render() {
    const currentPath = normalizePath(document.location.pathname);
    const nodes = this.props.data.map((node) => {
      const current = normalizePath(node.url) === currentPath;
      return node.isDirectory ?
        <Directory
          key={node.url}
          name={node.name}
          url={node.url.replace('/tree/', '/explore/')}
          current={current}
        />
        : <File key={node.url} name={node.name} url={node.url} current={current} />;
    });
    return (
      <ul ref={(el) => { this.list = el; }}>
        {nodes}
      </ul>
    );
  }
}