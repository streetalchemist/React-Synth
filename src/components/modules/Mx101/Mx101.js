import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import ReactOutsideEvent from '../../vendor/react-outside-event';
import './Mx101.css';

class Mx101 extends Component {
  constructor() {
    super();
    this.initialVolume = 50;
    this.state = {
      gainNode_01:null,
      gainNode_02:null,
      gainNode_03:null,
      gainNode_04:null,
      outputNode:null,
    };
    // this.initialFreq = 400;
    // this.updateFineTuneFreq = this.updateFineTuneFreq.bind(this);
    // this.handleWaveformChange = this.handleWaveformChange.bind(this);
    // this.handleCVIn = this.handleCVIn.bind(this);
    // this.knobSensitivity = 5;
    // this.knobMin = -1000;
    // this.knobMax = 1000;
    // this.state = {
    //   oscillator:null,
    //   frequency:400,
    //   fineTuneFrequency:400,
    //   baseFrequency:0,
    //   waveForm:'sine',
    //   cvInValue:0,
    //   bigKnobActive:false,
    // }
  }

  onOutsideEvent = (event) => {
    // if(this.state.bigKnobActive) {
    //   if (event.type === 'mouseup') {
    //     this.deactivateKnob();
    //   } else if (event.type === 'mousemove') {
    //     this.moveKnob(event.clientX,event.clientY);
    //   }
    // }
  }

  componentDidMount() {
    var newOutputNode = this.props.ctx.createGain();
    var newGainNode_01 = this.props.ctx.createGain();
    newGainNode_01.connect(newOutputNode);
    newGainNode_01.gain.value = this.initialVolume/100;
    var newGainNode_02 = this.props.ctx.createGain();
    newGainNode_02.connect(newOutputNode);
    newGainNode_02.gain.value = this.initialVolume/100;
    var newGainNode_03 = this.props.ctx.createGain();
    newGainNode_03.connect(newOutputNode);
    newGainNode_03.gain.value = this.initialVolume/100;
    var newGainNode_04 = this.props.ctx.createGain();
    newGainNode_04.connect(newOutputNode);
    newGainNode_04.gain.value = this.initialVolume/100;
    this.setState({
      gainNode_01:newGainNode_01,
      gainNode_02:newGainNode_02,
      gainNode_03:newGainNode_03,
      gainNode_04:newGainNode_04,
      outputNode:newOutputNode,
    });
  }
  


  
  render() {

    return(
      <div className="module mx101">
        <h4>Mx-101</h4>
        <label>in 1
            <Port type="input" contentType="audioNode" content={this.state.gainNode_01} handlePortConnect={this.props.handlePortConnect}  />
        </label>
        <label>in 2
            <Port type="input" contentType="audioNode" content={this.state.gainNode_02} handlePortConnect={this.props.handlePortConnect}  />
        </label>
        <label>in 3
            <Port type="input" contentType="audioNode" content={this.state.gainNode_03} handlePortConnect={this.props.handlePortConnect}  />
        </label>
        <label>in 4
            <Port type="input" contentType="audioNode" content={this.state.gainNode_04} handlePortConnect={this.props.handlePortConnect}  />
        </label>
        <label>output
            <Port type="output" contentType="audioNode" content={this.state.outputNode} handlePortConnect={this.props.handlePortConnect}  />
        </label>
      </div>
    );
  };
}

export default ReactOutsideEvent(Mx101, ['mousemove','mouseup']);