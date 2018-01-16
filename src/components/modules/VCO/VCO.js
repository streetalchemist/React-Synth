import React, { Component } from 'react';
import Port from '../../core/Port/Port';

class VCO extends Component {
  constructor() {
    super();
    this.initialFreq = 400;
    this.updateFineTuneFreq = this.updateFineTuneFreq.bind(this);
    this.handleWaveformChange = this.handleWaveformChange.bind(this);
    this.handleCVIn = this.handleCVIn.bind(this);
    this.state = {
      oscillator:null,
      frequency:400,
      fineTuneFrequency:400,
      waveForm:'sine',
      cvInValue:0,
    }
  }
  
  componentDidMount() {
    var newOscillator = this.props.ctx.createOscillator();
    newOscillator.type = this.state.waveForm;
    newOscillator.frequency.value = this.state.frequency;
    newOscillator.start();
    this.setState({oscillator:newOscillator});
  }
  
  updateFineTuneFreq(event) {
    this.setState({
      fineTuneFrequency:event.target.value,
    });
  }

  handleCVIn(newCV) {
    this.setState({cvInValue:newCV});
  }
  
  handleWaveformChange(event) {
    this.state.oscillator.type = event.target.value;
    this.setState({
      waveForm: event.target.value,
    });
  }
  
  render() {
    var finalFrequency = parseInt(this.state.fineTuneFrequency, 10) + parseInt(this.state.cvInValue, 10);
    if(this.state.oscillator) {
      this.state.oscillator.frequency.value = finalFrequency;
    }

    return(
      <div className="module vco">
        <h5>VCO</h5>
        <div>Waveform: {this.state.waveForm}</div>
        <select value={this.state.waveForm} onChange={this.handleWaveformChange}>
            <option value="sine">Sine</option>
            <option value="triangle">Triangle</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="square">Square</option>
          </select>
          <div>Frequency: {finalFrequency}</div>
          <div>Fine Tune: {this.state.fineTuneFrequency}</div>
          <label>Fine Tune:
          0<input type="range" name="fineTuneFrequency" min="0" max="2000" step="1" defaultValue={this.initialFreq} onChange={this.updateFineTuneFreq} />2000
         </label>
         <label>CV In:
         <Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleCVIn} />
         </label>
         <label>Output:
         <Port type="output" contentType="audioNode" content={this.state.oscillator} handlePortConnect={this.props.handlePortConnect} />
         </label>
      </div>
    );
  };
}

export default VCO;