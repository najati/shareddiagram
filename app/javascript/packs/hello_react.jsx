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
import {AutoSizer} from 'react-virtualized';
import {UncontrolledReactSVGPanZoom} from 'react-svg-pan-zoom';

import {loremGraphum} from './lorem_graphum';

class SharedGraphApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphCode: props.graphCode,
      graphElement: <svg width={256} height={256}></svg>
    };

    this.svgView = React.createRef();

    const updateGraph = async () => {
      try {
        const graphHtml = await this.props.renderGraph(this.state.graphCode);
        this.renderGraph(graphHtml);
      } catch (err) {
        console.log("derp", err);
      }
    };
    this.updateGraph = _.debounce(updateGraph, 300);

    this.updateGraph();
  }

  render() {
    return <Split id="panes" sizes={[25, 75]} onDragEnd={this.splitMoved}>
      <div className="split">
        <div id="controls">
          <button>Fart</button>
        </div>

        <AutoSizer>
          {(({width, height}) => width === 0 || height === 0 ? null : (
            <AceEditor
              mode="dot"
              onChange={this.graphCodeChanged.bind(this)}
              name="editor"
              editorProps={{$blockScrolling: true}}
              value={this.state.graphCode}
              width={width}
              height={height - 40}
            />
          ))}
        </AutoSizer>
      </div>
      <div className="split graph">
        <AutoSizer>
          {(({width, height}) => width === 0 || height === 0 ? null : (
            <UncontrolledReactSVGPanZoom
              width={width}
              height={height}
              background="white"
              tool="pan"
              miniatureProps={{position: "none"}}
              toolbarProps={{position: "none"}}
              ref={this.svgView}>
              {this.state.graphElement}
            </UncontrolledReactSVGPanZoom>
          ))}
        </AutoSizer>
      </div>
    </Split>
  }

  splitMoved() {
    window.dispatchEvent(new Event('resize'));
  }

  renderGraph(graphHtml) {
    // TODO fix
    // this hack removes the pt from the svg width/height attrs
    // which is needed by svg pan zoom thing
    graphHtml = graphHtml.replace("pt", "");
    graphHtml = graphHtml.replace("pt", "");
    const graphElement = parse(graphHtml).find(e => React.isValidElement(e) && e.type === 'svg');

    if (graphElement) {
      this.setState({graphElement: graphElement});
    }

    setTimeout(() => this.svgView.current.fitToViewer("center", "center"), 500);
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
