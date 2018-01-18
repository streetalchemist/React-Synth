import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import ReactOutsideEvent from '../../vendor/react-outside-event';
import './VCO.css';

class VCO extends Component {
  constructor() {
    super();
    this.initialFreq = 400;
    this.updateFineTuneFreq = this.updateFineTuneFreq.bind(this);
    this.handleWaveformChange = this.handleWaveformChange.bind(this);
    this.handleCVIn = this.handleCVIn.bind(this);
    this.knobSensitivity = 5;
    this.knobMin = -1000;
    this.knobMax = 1000;
    this.state = {
      oscillator:null,
      frequency:400,
      fineTuneFrequency:400,
      baseFrequency:0,
      waveForm:'sine',
      cvInValue:0,
      bigKnobActive:false,
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

  knobClick(e) {
    e.preventDefault();
    console.log("clicked");
    this.setState({
      bigKnobActive:true,
      baseFrequency:this.state.fineTuneFrequency,
      mouseX:e.clientX,
      mouseY:e.clientY,
    });
  }

  knobReleased(e) {
    if(this.state.bigKnobActive) {
      this.deactivateKnob();
    }
  }

  knobMoved(e) {
    if(this.state.bigKnobActive) {
      this.moveKnob(e.clientX,e.clientY);
    }
  }

  onOutsideEvent = (event) => {
    if(this.state.bigKnobActive) {
      if (event.type === 'mouseup') {
        this.deactivateKnob();
      } else if (event.type === 'mousemove') {
        this.moveKnob(event.clientX,event.clientY);
      }
    }
  }

  moveKnob(currentX,currentY) {
    var diffX = currentX - this.state.mouseX;
    var diffY = currentY - this.state.mouseY;

    var newFreq;
    if(Math.abs(diffX) >= Math.abs(diffY)) {
      newFreq = this.state.baseFrequency+(diffX*this.knobSensitivity);
    } else {
      newFreq = this.state.baseFrequency-(diffY*this.knobSensitivity);
    }
    if(newFreq > this.knobMax) {
      newFreq = this.knobMax;
    }

    if(newFreq < this.knobMin) {
      newFreq = this.knobMin;
    }

    this.setState({fineTuneFrequency:newFreq});
  }

  deactivateKnob() {
    console.log("KNOB RELEASED");
    this.setState({bigKnobActive:false});
  }


  
  render() {
    var finalFrequency = parseInt(this.state.fineTuneFrequency, 10) + parseInt(this.state.cvInValue, 10);
    if(this.state.oscillator) {
      this.state.oscillator.frequency.value = finalFrequency;
    }

    var knobAngle = ((this.state.fineTuneFrequency+1000)*280/2000)-140; //x to 140
    var knobRotate = "rotate("+knobAngle+"deg)";
    var knobStyle = {transform:knobRotate};

    return(
      <div className="module vco" onMouseUp={this.knobReleased.bind(this)} onMouseMove={this.knobMoved.bind(this)}>
        <div className="module-vco-waveform-set">
          <label className="module-vco-radio">
            <input type="radio" value="sine" checked={this.state.waveForm === 'sine'} onChange={this.handleWaveformChange} />
            <span className="module-vco-radio-checkmark"></span>
          </label>
          <label className="module-vco-radio">
            <input type="radio" value="triangle" checked={this.state.waveForm === 'triangle'} onChange={this.handleWaveformChange} />
            <span className="module-vco-radio-checkmark"></span>
          </label>
          <label className="module-vco-radio">
            <input type="radio" value="sawtooth" checked={this.state.waveForm === 'sawtooth'} onChange={this.handleWaveformChange} />
            <span className="module-vco-radio-checkmark"></span>
          </label>
          <label className="module-vco-radio">
            <input type="radio" value="square" checked={this.state.waveForm === 'square'} onChange={this.handleWaveformChange} />
            <span className="module-vco-radio-checkmark"></span>
          </label>
        </div>
        <div className="module-vco-frequency-holder">frequency
          <div className="module-vco-frequency-counter">{finalFrequency}</div>
        </div>
        <div className="module-vco-knob-holder">
          <div className="module-vco-frequency-knob" style={knobStyle} onMouseDown={this.knobClick.bind(this)}></div>
        </div>
         <div className="module-vco-ports">
           <label>1v/oct
           <Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleCVIn} />
           </label>
           <label>out
           <Port type="output" contentType="audioNode" content={this.state.oscillator} handlePortConnect={this.props.handlePortConnect} />
           </label>
          </div>
      </div>
    );
  };
}

export default ReactOutsideEvent(VCO, ['mousemove','mouseup']);