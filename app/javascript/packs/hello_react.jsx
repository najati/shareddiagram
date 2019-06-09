import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Split from 'react-split'

import _ from 'lodash'

import parse from 'html-react-parser';

import {renderGraph} from './renderGraph'
import {ready} from './ready'

import AceEditor from 'react-ace';
import 'brace/mode/dot';

import {loremGraphum} from './lorem_graphum';

class SharedGraphApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphCode: props.graphCode
    };

    const updateGraph = async () => {
      const graphHtml = await this.props.renderGraph(this.state.graphCode);
      this.renderGraph(graphHtml);
    };
    this.updateGraph = _.debounce(updateGraph, 300);

    this.updateGraph();
  }

  render() {
    return <Split id="panes" sizes={[25, 75]}>
      <div className="split">
        <AceEditor
          mode="dot"
          onChange={this.graphCodeChanged.bind(this)}
          name="editor"
          editorProps={{$blockScrolling: true}}
          value={this.state.graphCode}
        />
      </div>
      <div className="split graph">
        {this.state.graphElement}
      </div>
    </Split>
  }

  renderGraph(graphHtml) {
    this.setState({graphElement: parse(graphHtml)});
  }

  graphCodeChanged(graphCode) {
    this.setState({graphCode: graphCode});
    this.updateGraph();
  }
}

SharedGraphApp.propTypes = {
  graphCode: PropTypes.string,
  renderGraph: PropTypes.func
};

ready(function () {
  const app = <SharedGraphApp graphCode={loremGraphum} renderGraph={renderGraph}/>;

  const targetElement = document.querySelector('#app');
  ReactDOM.render(app, targetElement);
});
