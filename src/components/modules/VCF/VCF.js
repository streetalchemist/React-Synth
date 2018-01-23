import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import StandardKnob from '../../standardControls/StandardKnob/StandardKnob';
import './VCF.css';
import knobImg from './img/rsvcf_big_knob.png';
import {clamp} from '../../core/helper';

class VCF extends Component {
  constructor() {
    super();
    this.initialFreq = 0;
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleCVIn = this.handleCVIn.bind(this);
    this.cutoffMin = 0;
    this.cutoffMax = 3000;
    this.state = {
      filter:null,
      frequency:0,
      type:'lowpass',
      bigKnobActive:false,
      baseFrequency:0,
      cvLevel:0,
      cvInValue:0,
    };
  }
  
  componentDidMount() {
    var newFilter = this.props.ctx.createBiquadFilter();
    newFilter.type = this.state.type;
    newFilter.frequency.value = this.state.frequency;
    this.setState({filter:newFilter});
  }
  
  handleTypeChange(event) {
    this.state.filter.type = event.target.value;
    this.setState({
      type: event.target.value,
    });
  }

  handleFrequencyKnob(value) {
    this.setState({frequency:value});
    //this.state.filter.frequency.value = value;
  }

  handleCVKnobChange(value) {
    console.log("CVIN:",value);
    this.setState({cvLevel:value});
  }

  handleCVIn(newCV) {
    console.log("NEWCV1:",newCV);
    this.setState({cvInValue:newCV});
  }
  
  render() {

    var finalCutoffFrequency = this.state.frequency + (this.state.cvInValue*this.state.cvLevel);
    finalCutoffFrequency = clamp(finalCutoffFrequency,this.cutoffMin,this.cutoffMax);
    if(this.state.filter) {
      this.state.filter.frequency.value = finalCutoffFrequency;
    }

    return(

      <div className="module vcf">
        <div className="module-vcf-knob-holder">
          <StandardKnob img={"url("+knobImg+")"}  size={74} minValue={this.cutoffMin} maxValue={this.cutoffMax} sensitivity={10} dragRange={140} value={this.state.frequency} handleKnobChange={this.handleFrequencyKnob.bind(this)} />
        </div>
        <div className="module-vcf-cutoff-holder">cutoff
          <div className="module-vcf-cutoff-counter">{finalCutoffFrequency}</div>
        </div>
        <div className="module-vcf-type-set">
          <label className="module-vcf-radio">
            <input type="radio" value="lowpass" checked={this.state.type === 'lowpass'} onChange={this.handleTypeChange} />
            <span className="module-vcf-radio-checkmark"></span>
          </label>
          <label className="module-vcf-radio">
            <input type="radio" value="bandpass" checked={this.state.type === 'bandpass'} onChange={this.handleTypeChange} />
            <span className="module-vcf-radio-checkmark"></span>
          </label>
          <label className="module-vcf-radio">
            <input type="radio" value="highpass" checked={this.state.type === 'highpass'} onChange={this.handleTypeChange} />
            <span className="module-vcf-radio-checkmark"></span>
          </label>
        </div>
        <div className="module-vcf-cv-cutoff">
          <div className="module-vcf-cv-cutoff-port">
            <label>cv in</label>
            <Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleCVIn} />
          </div>
          <div className="module-vcf-cv-cutoff-knob">
            <label>level</label>
            <StandardKnob img={"url("+knobImg+")"}  size={34} minValue={0} maxValue={2000} sensitivity={10} dragRange={140} value={this.state.cvLevel} handleKnobChange={this.handleCVKnobChange.bind(this)} />
          </div>
        </div>
        <div className="module-vcf-ports">
          <label>in
            <Port type="input" contentType="audioNode" content={this.state.filter} handlePortConnect={this.props.handlePortConnect} />
          </label>
          <label>out
            <Port type="output" contentType="audioNode" content={this.state.filter} handlePortConnect={this.props.handlePortConnect} />
          </label>
        </div>
      </div>
    );
  };
}

export default VCF;