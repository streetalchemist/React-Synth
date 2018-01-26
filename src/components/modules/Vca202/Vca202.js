import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import './Vca202.css';
import StandardKnob from '../../standardControls/StandardKnob/StandardKnob';
import knobImg from './img/vca202_knob.png';
import {clamp} from '../../core/helper';

class Vca202 extends Component {
  constructor() {
    super();
    this.initialVolume = 50;
    this.state = {
      gainNode_A:null,
      gainValue_A:0.5,
      levelValue_A:0,
      cvIn_A:0,
      gainNode_B:null,
      gainValue_B:0.5,
      levelValue_B:0,
      cvIn_B:0,
    };
  }

  componentDidMount() {
    var newGainNode_A = this.props.ctx.createGain();
    newGainNode_A.gain.value = this.initialVolume/100;
    var newGainNode_B = this.props.ctx.createGain();
    newGainNode_B.gain.value = this.initialVolume/100;

    this.setState({
      gainNode_A:newGainNode_A,
      gainNode_B:newGainNode_B,
    });
  }

  handleGainAChange(value) {
    this.setState({gainValue_A:value});
  }

  handleLevelAChange(value) {
    this.setState({levelValue_A:value});
  }

  handleGainBChange(value) {
    this.setState({gainValue_B:value});
  }

  handleLevelBChange(value) {
    this.setState({levelValue_B:value});
  }


  handleCVIn_A(newCV) {
    this.setState({cvIn_A:newCV});
  }

  handleCVIn_B(newCV) {
    this.setState({cvIn_B:newCV});
  }
  
  render() {

    var finalGainA = this.state.gainValue_A + (this.state.cvIn_A*this.state.levelValue_A);
    finalGainA = clamp(finalGainA,0,1);
    if(this.state.gainNode_A) {
      this.state.gainNode_A.gain.value = finalGainA;
    }

    var finalGainB = this.state.gainValue_B + (this.state.cvIn_B*this.state.levelValue_B);
    finalGainB = clamp(finalGainB,0,1);
    if(this.state.gainNode_B) {
      this.state.gainNode_B.gain.value = finalGainB;
    }


    return(
      <div className="module vca202">
        <div className="module-vca202-cluster module-vca202-cluster-a">
          <div className="module-vca202-cluster-knob-level"><StandardKnob img={"url("+knobImg+")"} size={30} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.levelValue_A} handleKnobChange={this.handleLevelAChange.bind(this)} /></div>
          <div className="module-vca202-cluster-knob-gain"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={this.state.gainValue_A} handleKnobChange={this.handleGainAChange.bind(this)} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-in"><Port type="input" contentType="audioNode" content={this.state.gainNode_A} handlePortConnect={this.props.handlePortConnect} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-cvin"><Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleCVIn_A.bind(this)} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-out"><Port type="output" contentType="audioNode" content={this.state.gainNode_A} handlePortConnect={this.props.handlePortConnect} /></div>
        </div>
        <div className="module-vca202-cluster module-vca202-cluster-b">
          <div className="module-vca202-cluster-knob-level"><StandardKnob img={"url("+knobImg+")"} size={30} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.levelValue_B} handleKnobChange={this.handleLevelBChange.bind(this)} /></div>
          <div className="module-vca202-cluster-knob-gain"><StandardKnob img={"url("+knobImg+")"} size={42} minValue={0} maxValue={1} sensitivity={0.01} dragRange={100} value={this.state.gainValue_B} handleKnobChange={this.handleGainBChange.bind(this)} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-in"><Port type="input" contentType="audioNode" content={this.state.gainNode_B} handlePortConnect={this.props.handlePortConnect} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-cvin"><Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleCVIn_B.bind(this)} /></div>
          <div className="module-vca202-cluster-port module-vca202-cluster-port-out"><Port type="output" contentType="audioNode" content={this.state.gainNode_B} handlePortConnect={this.props.handlePortConnect} /></div>
        </div>
      </div>
    );
  };
}

export default Vca202;