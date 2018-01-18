import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import ReactOutsideEvent from '../../vendor/react-outside-event';
import './VCF.css';

class VCF extends Component {
  constructor() {
    super();
    this.initialFreq = 0;
    this.handleFrequenceyChange = this.handleFrequenceyChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.knobSensitivity = 5;
    this.knobMin = 0;
    this.knobMax = 2000;
    this.state = {
      filter:null,
      frequency:0,
      type:'lowpass',
      bigKnobActive:false,
      baseFrequency:0,
    };
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
    });
  }
  
  handleTypeChange(event) {
    this.state.filter.type = event.target.value;
    this.setState({
      type: event.target.value,
    });
  }

  knobClick(e) {
    e.preventDefault();
    console.log("clicked");
    this.setState({
      bigKnobActive:true,
      baseFrequency:this.state.frequency,
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
    console.log(newFreq);
    this.setState({frequency:newFreq});
    this.state.filter.frequency.value = newFreq;
  }

  deactivateKnob() {
    console.log("KNOB RELEASED");
    this.setState({bigKnobActive:false});
  }
  
  render() {

    var knobAngle = ((this.state.frequency)*280/2000)-140; //x to 140
    var knobRotate = "rotate("+knobAngle+"deg)";
    var knobStyle = {transform:knobRotate};

    return(

      <div className="module vcf" onMouseUp={this.knobReleased.bind(this)} onMouseMove={this.knobMoved.bind(this)}>
        <div className="module-vcf-knob-holder">
          <div className="module-vcf-frequency-knob" style={knobStyle} onMouseDown={this.knobClick.bind(this)}></div>
        </div>
        <div className="module-vcf-cutoff-holder">cutoff
          <div className="module-vcf-cutoff-counter">{this.state.frequency}</div>
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

export default ReactOutsideEvent(VCF, ['mousemove','mouseup']);