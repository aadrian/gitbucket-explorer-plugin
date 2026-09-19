import React from 'react';
import FileNodes from './FileNodes';
import Directory from './Directory';

export default class Root extends Directory {

  componentWillMount() {
    const logo = document.querySelector('header.main-header a.logo');
    if (!logo) {
      return;
    }
    // obtain repository URI
    // - localhost:8080/owner/repo -> /owner/repo
    // - localhost:8080/gitbucket/owner/repo -> /owner/repo
    const baseUrl = logo.getAttribute('href').replace(`${document.location.protocol}//${document.location.host}`, '');
    const relPath = document.location.pathname.replace(baseUrl, '');
    let rootPath;
    let branch;
    if (['tree', 'blob'].some(s => relPath.includes(`/${s}/`))) {
      const m = relPath.match(/(^\/?[^/]+\/[^/]+)\/(?:tree|blob)\/([^/]+)/);
      rootPath = m[1];
      branch = m[2];
    } else {
      rootPath = relPath.match(/^\/?[^/]+\/[^/]+/);
      branch = '';
    }
    this.setState({
      rootPath: `${baseUrl}${rootPath}`,
      branch,
    });
  }

  getLocalStorageKey() {
    return `${this.state.rootPath}/${this.state.branch}`;
  }

  render() {
    const arrow = this.state.expanded ? 'octicon octicon-chevron-down' : 'octicon octicon-chevron-right';
    return (
      <div className="tree-node">
        <button className="root-expander btn btn-default" onClick={() => this.toggleFolder(`${this.state.rootPath}/explore/${this.state.branch}`)} >
          <i className={arrow} />
        </button>
        <a href={this.state.rootPath} className="submenu-files" >
          <i className="menu-icon octicon octicon-file-directory" />
          Files
        </a>
        <div className="file-tree" style={this.state.expanded ? {} : { display: 'none' }} >
          <FileNodes data={this.state.children} />
        </div>
      </div>
    );
  }
}
