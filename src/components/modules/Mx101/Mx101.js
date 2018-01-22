import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import ReactOutsideEvent from '../../vendor/react-outside-event';
import './Mx101.css';
import StandardKnob from '../../standardControls/StandardKnob/StandardKnob';
import knobImg from './img/custom_knob_bg.png';

class Mx101 extends Component {
  constructor() {
    super();
    this.initialVolume = 50;
    this.state = {
      gainNode_01:{},
      gainNode_02:{},
      gainNode_03:{},
      gainNode_04:{},
      outputNode:{},
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

  handleKnob1Change(value) {
    this.state.gainNode_01.gain.value = value;
    this.forceUpdate();
  }
  handleKnob2Change(value) {
    this.state.gainNode_02.gain.value = value;
    this.forceUpdate();
  }
  handleKnob3Change(value) {
    this.state.gainNode_03.gain.value = value;
    this.forceUpdate();
  }
  handleKnob4Change(value) {
    this.state.gainNode_04.gain.value = value;
    this.forceUpdate();
  }

  
  render() {

    var value1 = this.state.gainNode_01.gain? this.state.gainNode_01.gain.value: 0;
    var value2 = this.state.gainNode_02.gain? this.state.gainNode_02.gain.value: 0;
    var value3 = this.state.gainNode_03.gain? this.state.gainNode_03.gain.value: 0;
    var value4 = this.state.gainNode_04.gain? this.state.gainNode_04.gain.value: 0;

    return(
      <div className="module mx101">
        <div className="module-mx101-cluster">
          <div className="module-mx101-cluster-port"><Port type="input" contentType="audioNode" content={this.state.gainNode_01} handlePortConnect={this.props.handlePortConnect}  /></div>
          <div className="module-mx101-cluster-knob"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={value1} handleKnobChange={this.handleKnob1Change.bind(this)} /></div>
        </div>
        <div className="module-mx101-cluster">
          <div className="module-mx101-cluster-port"><Port type="input" contentType="audioNode" content={this.state.gainNode_02} handlePortConnect={this.props.handlePortConnect}  /></div>
          <div className="module-mx101-cluster-knob"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={value2} handleKnobChange={this.handleKnob2Change.bind(this)} /></div>
        </div>
        <div className="module-mx101-cluster">
          <div className="module-mx101-cluster-port"><Port type="input" contentType="audioNode" content={this.state.gainNode_03} handlePortConnect={this.props.handlePortConnect}  /></div>
          <div className="module-mx101-cluster-knob"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={value3} handleKnobChange={this.handleKnob3Change.bind(this)} /></div>
        </div>
        <div className="module-mx101-cluster">
          <div className="module-mx101-cluster-port"><Port type="input" contentType="audioNode" content={this.state.gainNode_04} handlePortConnect={this.props.handlePortConnect}  /></div>
          <div className="module-mx101-cluster-knob"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={value4} handleKnobChange={this.handleKnob4Change.bind(this)} /></div>
        </div>
        <div className="module-mx101-cluster-output">
            <Port type="output" contentType="audioNode" content={this.state.outputNode} handlePortConnect={this.props.handlePortConnect}  />
        </div>
      </div>
    );
  };
}

export default ReactOutsideEvent(Mx101, ['mousemove','mouseup']);