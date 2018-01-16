import React, { Component } from 'react';
import Port from '../../core/Port/Port';

class VCF extends Component {
  constructor() {
    super();
    this.initialFreq = 0;
    this.handleFrequenceyChange = this.handleFrequenceyChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.state = {
      filter:null,
      frequency:0,
      type:'lowpass'
    }
  }
  
  componentDidMount() {
    var newFilter = this.props.ctx.createBiquadFilter();
    newFilter.type = this.state.type;
    newFilter.frequency.value = this.state.frequency;
    this.setState({filter:newFilter});
  }
  
  handleFrequenceyChange(event) {
    this.state.filter.frequency.value = event.target.value;
    this.setState({
      frequency:event.target.value
    })
  }
  
  handleTypeChange(event) {
    this.state.filter.type = event.target.value;
    this.setState({
      type: event.target.value,
    });
  }
  
  render() {
    return(
      <div className="module vcf">
        <h5>VCF</h5>
        <div>Type: {this.state.type}</div>
        <select value={this.state.type} onChange={this.handleTypeChange}>
            <option value="lowpass">Lowpass</option>
            <option value="highpass">Highpass</option>
            <option value="bandpass">Bandpass</option>
          </select>
        <div>Frequency: {this.state.frequency}</div>
        <label>Frequency:
        0<input type="range" name="frequency" min="0" max="2000" step="1" defaultValue={this.initialFreq} onChange={this.handleFrequenceyChange} />2000
        </label>
        <label>Input:
          <Port type="input" contentType="audioNode" content={this.state.filter} handlePortConnect={this.props.handlePortConnect} />
        </label>
        <label>Output:
          <Port type="output" contentType="audioNode" content={this.state.filter} handlePortConnect={this.props.handlePortConnect} />
        </label>
      </div>
    );
  };
}

export default VCF;