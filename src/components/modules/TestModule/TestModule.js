import React, { Component } from 'react';
import Port from '../../core/Port/Port';

class TestModule extends Component {
  constructor() {
    super();
    this.changeValue = this.changeValue.bind(this);
    this.initialSendValue = 1000;
    this.state = {
      sendValue: this.initialSendValue,
      testLFO: 0,
    }
  }
  
  componentDidMount() {
    setInterval(this.updateLFO.bind(this), 1000);
  }

  changeValue(event) {
    this.setState({
      sendValue:event.target.value
    })
  }

  updateLFO() {
    if(this.state.testLFO == -1) {
      this.setState({testLFO:1});
      console.log("lfo:",1);
    } else {
      this.setState({testLFO:-1});
      console.log("lfo:",-1);
    }
  }
  
  
  render() {
    return(
      <div className="module test-module">
        <h5>Test Module</h5>
        <div>Value: {this.state.sendValue}</div>
        <label>Value:
          0<input type="range" name="sendValue" min="0" max="2000" step="1" defaultValue={this.initialSendValue} onChange={this.changeValue} />2000
         </label>
         <label>CV Out:
         <Port type="output" content={this.state.sendValue} contentType="value" handlePortConnect={this.props.handlePortConnect} />
         </label>
        <label>Test LFO:
          <Port type="output" contentType="value" content={this.state.testLFO} handlePortConnect={this.props.handlePortConnect} />
        </label>
      </div>
    );
  };
}

export default TestModule;