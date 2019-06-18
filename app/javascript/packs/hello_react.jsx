import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import uuidv4 from 'uuid/v4';

import Split from 'react-split'

import _ from 'lodash'

import parse from 'html-react-parser';

import {renderGraph} from './renderGraph'
import {ready} from './ready'

import AceEditor from 'react-ace';
import 'brace/mode/dot';
import {AutoSizer} from 'react-virtualized';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';

import {loremGraphum} from './lorem_graphum';

class Saver {
  constructor() {

  }

  async get(guid) {
    const response = await fetch(`/diagrams/${guid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  }

  async update(guid, src) {
    return fetch(`/diagrams/${guid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: src
      })
    });
  }

  async save(data) {
    const guid = uuidv4();

    await fetch(`/diagrams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        diagram: { guid, data }
      })
    });

    return guid;
  }
}

class SharedGraphApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panZoomValue: {},
      graphCode: props.graphCode,
      graphElement: <svg width={256} height={256}></svg>,
      guid: props.guid || ""
    };

    this.svgView = React.createRef();

    this.saver = new Saver();

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
        <AutoSizer>
          {(({width, height}) => width === 0 || height === 0 ? null : (
            <div style={{ width: width }} >
              <AceEditor
                mode="dot"
                onChange={this.graphCodeChanged.bind(this)}
                name="editor"
                editorProps={{$blockScrolling: true}}
                value={this.state.graphCode}
                width={width + "px"}
                height={(height - 40) + "px"}
              />
              <div id="controls">
                <input type="text" value={this.state.guid} readOnly />
                <button onClick={this.saveClick.bind(this)}>Save</button>
              </div>
            </div>
          ))}
        </AutoSizer>
      </div>
      <div className="split graph">
        <AutoSizer>
          {(({width, height}) => width === 0 || height === 0 ? null : (
            <ReactSVGPanZoom
              width={width}
              height={height}
              background="white"
              tool="pan"
              value={this.state.panZoomValue}
              onChangeValue={panZoomValue => this.setState({panZoomValue})}
              miniatureProps={{position: "none"}}
              toolbarProps={{position: "none"}}
              ref={this.svgView}
              onChangeTool={()=>{}}>
              {this.state.graphElement}
            </ReactSVGPanZoom>
          ))}
        </AutoSizer>
      </div>
    </Split>
  }

  async saveClick() {
    if (this.state.guid) {
      await this.saver.update(this.state.guid, this.state.graphCode);
    } else {
      const guid = await this.saver.save(this.state.graphCode);

      let url = new URL(window.location);
      let params = new URLSearchParams(url.search.slice(1));
      params.set('id', guid);
      window.history.pushState({guid}, 'Shared Diagram', `?${params.toString()}`);

      this.setState({ guid });
    }
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

ready(async function () {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search.slice(1));

  const saver = new Saver();

  const guid = params.get('id');
  const graphCode = guid ? (await saver.get(guid)).data : loremGraphum;

  const app = <SharedGraphApp renderGraph={renderGraph} guid={guid} graphCode={graphCode} />;

  const targetElement = document.querySelector('#app');
  ReactDOM.render(app, targetElement);
});
