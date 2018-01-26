import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import StandardKnob from '../../standardControls/StandardKnob/StandardKnob';
import './ADSRock.css';
import knobImg from './img/adsrock_knob.png';
import {clamp} from '../../core/helper';

class ADSRock extends Component {
  constructor() {
    super();
    this.initialFreq = 0;
    this.lowTimeMultiplier = 1000;
    this.medTimeMultiplier = 10000;
    this.highTimeMultiplier = 100000;
    this.startAmp = 0;
    this.peakAmp = 1;
    this.sustainAmp = 0.8;
    this.endAmp = 0;
    this.state = {
      valueAttack:0,
      valueDecay:0,
      valueSustain:0,
      valueRelease:0,
      valueGate:0,
      valueOutput:0,
      totalTime:0,
      trigger:false,
      triggeredTime:new Date(),
      active:false,
      gateThreshold:0.8,
      currentTimeSetting:'low',
    }
  }

  componentDidMount() {
    this.calcCurves();
    requestAnimationFrame(this.computeOutput.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if(
      prevState.valueAttack != this.state.valueAttack ||
      prevState.valueDecay != this.state.valueDecay ||
      prevState.valueSustain != this.state.valueSustain ||
      prevState.valueRelease != this.state.valueRelease ||
      prevState.currentTimeSetting != this.state.currentTimeSetting
    ) {
      this.calcCurves();
    }
  }

  handleTimeChange(event) {
    this.setState({
      currentTimeSetting: event.target.value,
    });
  }

  handleKnobChangeAttack(value) {
    //console.log("Attack:",value);
    this.setState({valueAttack:value});
  }

  handleKnobChangeDecay(value) {
    //console.log("Decay:",value);
    this.setState({valueDecay:value});
  }

  handleKnobChangeSustain(value) {
    //console.log("Sustain:",value);
    this.setState({valueSustain:value});
  }

  handleKnobChangeRelease(value) {
    //console.log("Release:",value);
    this.setState({valueRelease:value});
  }

  handleGateIn(value) {
    //console.log(value);
    if(value > this.state.gateThreshold) {
      if(this.state.valueGate == 0) {
        this.setState({
          active:true,
          triggeredTime:new Date()
        });
      }
      this.setState({valueGate:1});
    } else {
      this.setState({valueGate:0});
    }
  }

  calcCurves() {
    //Get times for each stage
    var attackTime = this.state.valueAttack*this[this.state.currentTimeSetting+"TimeMultiplier"];
    var decayTime = this.state.valueDecay*this[this.state.currentTimeSetting+"TimeMultiplier"];
    var sustainTime = this.state.valueSustain*this[this.state.currentTimeSetting+"TimeMultiplier"];
    var releaseTime = this.state.valueRelease*this[this.state.currentTimeSetting+"TimeMultiplier"];
    var totalTime = attackTime + decayTime + sustainTime + releaseTime;

    var decayThreshold = attackTime;
    var sustainThreshold = decayThreshold + decayTime;
    var releaseThreshold = sustainThreshold + sustainTime;

    //Calculate linear slopes
    var aAttack = (this.peakAmp - this.startAmp) / attackTime;
    var aDecay = (this.sustainAmp - this.peakAmp) / decayTime;
    var aSustain = 0;
    var aRelease = (this.endAmp - this.sustainAmp) / releaseTime;

    if(isNaN(aAttack)) {
      aAttack = 0;
    }

    if(isNaN(aAttack)) {
      aDecay = 0;
    }

    if(isNaN(aAttack)) {
      aSustain = 0;
    }

    if(isNaN(aAttack)) {
      aRelease = 0;
    }

    //TODO render the graph for the current values

    this.setState({
      attackTime:attackTime,
      decayTime:decayTime,
      sustainTime:sustainTime,
      releaseTime:releaseTime,
      totalTime:totalTime,
      decayThreshold:decayThreshold,
      sustainThreshold:sustainThreshold,
      releaseThreshold:releaseThreshold,
      linSlopeAttack:aAttack,
      linSlopeDecay:aDecay,
      linSlopeSustain:aSustain,
      linSlopeRelease:aRelease,
    });

    //Draw the shape
    const ctx = this.refs.adsrCanvas.getContext('2d');
    ctx.fillStyle="#e5f5b6";
    ctx.fillRect(0,0, 190, 130);
    var width = 160;
    var height = 90;
    var graphHeight = 80;
    var offset = {
      x:10,
      y:height-10,
      total:10
    }

    var attackAmt = attackTime/totalTime*(width-offset.x);
    var decayAmt = decayTime/totalTime*(width-offset.x);
    var sustainAmt = sustainTime/totalTime*(width-offset.x);
    var releaseAmt = releaseTime/totalTime*(width-offset.x);

    //Draw Graph
    ctx.strokeStyle="#9fb461";
    ctx.beginPath();
    ctx.moveTo(offset.x+offset.total,10);
    ctx.lineTo(offset.x+offset.total,offset.y+offset.total);
    ctx.lineTo(offset.x+width,offset.y+offset.total);

    for(var i = 0; i < 11; i++) {
      ctx.moveTo(offset.x+offset.total,offset.total+(i/10)*graphHeight);
      ctx.lineTo(offset.x+offset.total-3,offset.total+(i/10)*graphHeight);
    }

    for(var i = 0; i < 15; i++) {
      ctx.moveTo(offset.x+(i/15)*width+offset.total,offset.total+graphHeight);
      ctx.lineTo(offset.x+(i/15)*width+offset.total,offset.total+graphHeight+3);
    }

    ctx.stroke();

    //Draw Paths
    ctx.strokeStyle="#364210";

    //Attack Path
    ctx.beginPath();
    ctx.moveTo(offset.x+offset.total,offset.y+offset.total);
    ctx.lineTo(offset.x+attackAmt+offset.total,(offset.y-this.peakAmp*offset.y)+offset.total);
    ctx.stroke();

    //DecayPath
    ctx.beginPath();
    ctx.moveTo(offset.x+attackAmt+offset.total,(offset.y-this.peakAmp*offset.y)+offset.total);
    ctx.lineTo(offset.x+attackAmt+decayAmt+offset.total,(offset.y-this.sustainAmp*offset.y)+offset.total);
    ctx.stroke();

    //SustainPath
    ctx.beginPath();
    ctx.moveTo(offset.x+attackAmt+decayAmt+offset.total,(offset.y-this.sustainAmp*offset.y)+offset.total);
    ctx.lineTo(offset.x+attackAmt+decayAmt+sustainAmt+offset.total,(offset.y-this.sustainAmp*offset.y)+offset.total);
    ctx.stroke();

    //ReleasePath
    ctx.beginPath();
    ctx.moveTo(offset.x+attackAmt+decayAmt+sustainAmt+offset.total,(offset.y-this.sustainAmp*offset.y)+offset.total);
    ctx.lineTo(offset.x+attackAmt+decayAmt+sustainAmt+releaseAmt+offset.total,offset.y+offset.total);
    ctx.stroke();
  }

  computeOutput() {

    if(this.state.active) {

      //Calculate state
      var currentEnvelopeState = "";
      var currentTime = new Date().getTime() - this.state.triggeredTime.getTime();
      if(currentTime < this.state.decayThreshold) {
        currentEnvelopeState = "attack";
      } else if (currentTime < this.state.sustainThreshold) {
        currentEnvelopeState = "decay";
      } else if (currentTime < this.state.releaseThreshold) {
        currentEnvelopeState = "sustain";
      } else {
        currentEnvelopeState = "release";
      }

      //Calculate output from ADSR values
      var outputValue = 0;

      switch(currentEnvelopeState) {
        case "attack":
          outputValue = this.state.linSlopeAttack*currentTime + this.startAmp;
          break;
        case "decay":
          outputValue = this.state.linSlopeDecay*(currentTime-this.state.decayThreshold) + this.peakAmp;
          break;
        case "sustain":
          outputValue = this.sustainAmp;
          break;
        case "release":
          outputValue = this.state.linSlopeRelease*(currentTime-this.state.releaseThreshold) + this.sustainAmp;
          break;
      }

      if(isNaN(outputValue)) {
        outputValue = 0;
      }

      outputValue = clamp(outputValue,0,1);

      if(outputValue == 0) {
        this.setState({active:false});
      }



      //Set output
      if(this.state.valueOutput != outputValue) {
        this.setState({
          valueOutput:outputValue
        });
      }
    }

    requestAnimationFrame(this.computeOutput.bind(this));
  }
  
  render() {

    var simpleTime = (this.state.totalTime/1000).toFixed(2);

    return(
      <div className="module adsrock">
        <div className="module-adsrock-screen">
          <canvas ref="adsrCanvas" width="190" height="130" />
          <p>time: {simpleTime}s</p>
        </div>
        <div className="module-adsrock-time-set">
          <label className="module-adsrock-time-radio">
            <input type="radio" value="low" checked={this.state.currentTimeSetting === 'low'} onChange={this.handleTimeChange.bind(this)} />
            <span className="module-adsrock-time-radio-checkmark"></span>
          </label>
          <label className="module-adsrock-time-radio">
            <input type="radio" value="med" checked={this.state.currentTimeSetting === 'med'} onChange={this.handleTimeChange.bind(this)} />
            <span className="module-adsrock-time-radio-checkmark"></span>
          </label>
          <label className="module-adsrock-time-radio">
            <input type="radio" value="high" checked={this.state.currentTimeSetting === 'high'} onChange={this.handleTimeChange.bind(this)} />
            <span className="module-adsrock-time-radio-checkmark"></span>
          </label>
        </div>
        <div className="module-adsrock-knobs">
            <div className="module-adsrock-knob module-adsrock-knob-attack"><StandardKnob img={"url("+knobImg+")"} size={44} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.valueAttack} handleKnobChange={this.handleKnobChangeAttack.bind(this)} /></div>
            <div className="module-adsrock-knob module-adsrock-knob-decay"><StandardKnob img={"url("+knobImg+")"} size={44} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.valueDecay} handleKnobChange={this.handleKnobChangeDecay.bind(this)} /></div>
            <div className="module-adsrock-knob module-adsrock-knob-sustain"><StandardKnob img={"url("+knobImg+")"} size={44} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.valueSustain} handleKnobChange={this.handleKnobChangeSustain.bind(this)} /></div>
            <div className="module-adsrock-knob module-adsrock-knob-release"><StandardKnob img={"url("+knobImg+")"} size={44} minValue={0} maxValue={1} sensitivity={0.01} dragRange={140} value={this.state.valueRelease} handleKnobChange={this.handleKnobChangeRelease.bind(this)} /></div>
        </div>
        <div className="module-adsrock-ports">
          <label>
            <Port type="input" contentType="value" handlePortConnect={this.props.handlePortConnect} handleDataChange={this.handleGateIn.bind(this)} />
          </label>
          <label>
            <Port type="output" contentType="value" content={this.state.valueOutput} handlePortConnect={this.props.handlePortConnect} />
          </label>
        </div>
      </div>
    );
  };
}

export default ADSRock;