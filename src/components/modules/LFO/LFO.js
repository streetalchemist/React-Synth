import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import StandardSlider from '../../standardControls/StandardSlider/StandardSlider';
import './LFO.css';

class LFO extends Component {
  constructor() {
    super();
    this.initialFreq = 0;
    this.state = {
      sineOscillator:null,
      sineAnalyser:null,
      triangleOscillator:null,
      triangleAnalyser:null,
      sawtoothOscillator:null,
      sawtoothAnalyser:null,
      squareOscillator:null,
      squareAnalyser:null,
      frequency:0,
      sineData:0,
      triangleData:0,
      sawtoothData:0,
      squareData:0,
    }
  }

  handleSpeedSlider(value) {
    this.setState({
      frequency:value
    })
  }
  
  componentDidMount() {
    var newSineOscillator = this.props.ctx.createOscillator();
    newSineOscillator.type = 'sine';
    newSineOscillator.frequency.value = this.state.frequency;
    newSineOscillator.start();

    var newSineAnalyser = this.props.ctx.createAnalyser();
    newSineAnalyser.fftSize = 32;
    newSineOscillator.connect(newSineAnalyser);

    var newTriangleOscillator = this.props.ctx.createOscillator();
    newTriangleOscillator.type = 'triangle';
    newTriangleOscillator.frequency.value = this.state.frequency;
    newTriangleOscillator.start();

    var newTriangleAnalyser = this.props.ctx.createAnalyser();
    newTriangleAnalyser.fftSize = 32;
    newTriangleOscillator.connect(newTriangleAnalyser);

    var newSawtoothOscillator = this.props.ctx.createOscillator();
    newSawtoothOscillator.type = 'sawtooth';
    newSawtoothOscillator.frequency.value = this.state.frequency;
    newSawtoothOscillator.start();

    var newSawtoothAnalyser = this.props.ctx.createAnalyser();
    newSawtoothAnalyser.fftSize = 32;
    newSawtoothOscillator.connect(newSawtoothAnalyser);

    var newSquareOscillator = this.props.ctx.createOscillator();
    newSquareOscillator.type = 'square';
    newSquareOscillator.frequency.value = this.state.frequency;
    newSquareOscillator.start();

    var newSquareAnalyser = this.props.ctx.createAnalyser();
    newSquareAnalyser.fftSize = 32;
    newSquareOscillator.connect(newSquareAnalyser);

    requestAnimationFrame(this.analyze.bind(this));


    this.setState({
      sineOscillator:newSineOscillator,
      sineAnalyser:newSineAnalyser,
      triangleOscillator:newTriangleOscillator,
      triangleAnalyser:newTriangleAnalyser,
      sawtoothOscillator:newSawtoothOscillator,
      sawtoothAnalyser:newSawtoothAnalyser,
      squareOscillator:newSquareOscillator,
      squareAnalyser:newSquareAnalyser,
    });
  }

  analyze() {

    var bufferLength;
    var dataArray;
    if(this.state.sineAnalyser) {
      bufferLength = this.state.sineAnalyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.state.sineAnalyser.getByteTimeDomainData(dataArray);
      var sineData = (dataArray[0] - 128) / 256 * 2;
      this.setState({sineData:sineData});
    }

    if(this.state.triangleAnalyser) {
      bufferLength = this.state.triangleAnalyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.state.triangleAnalyser.getByteTimeDomainData(dataArray);
      var triangleData = (dataArray[0] - 128) / 256 * 2;
      this.setState({triangleData:triangleData});
    }

    if(this.state.sawtoothAnalyser) {
      bufferLength = this.state.sawtoothAnalyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.state.sawtoothAnalyser.getByteTimeDomainData(dataArray);
      var sawtoothData = (dataArray[0] - 128) / 256 * 2;
      this.setState({sawtoothData:sawtoothData});
    }

    if(this.state.squareAnalyser) {
      bufferLength = this.state.squareAnalyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.state.squareAnalyser.getByteTimeDomainData(dataArray);
      var squareData = (dataArray[0] - 128) / 256 * 2;
      this.setState({squareData:squareData});
    }

    requestAnimationFrame(this.analyze.bind(this));
  }
  
  render() {
    if(this.state.sineOscillator) {
      this.state.sineOscillator.frequency.value = this.state.frequency;
    }

    if(this.state.triangleOscillator) {
      this.state.triangleOscillator.frequency.value = this.state.frequency;
    }

    if(this.state.sawtoothOscillator) {
      this.state.sawtoothOscillator.frequency.value = this.state.frequency;
    }

    if(this.state.squareOscillator) {
      this.state.squareOscillator.frequency.value = this.state.frequency;
    }

    var isActive = false;
    if(this.state.squareData > .8) {
      isActive = true;
    }

    return(
      <div className="module lfo">
        <div className="module-lfo-slider-holder">
          <StandardSlider active={isActive} length={140} minValue={0} maxValue={10} sensitivity={0.01} orientation={"vertical"} value={this.state.frequency} handleSliderChange={this.handleSpeedSlider.bind(this)} />
        </div>
        <div className="module-lfo-ports-holder">
          <Port type="output" contentType="value" content={this.state.sineData} handlePortConnect={this.props.handlePortConnect} />
          <Port type="output" contentType="value" content={this.state.triangleData} handlePortConnect={this.props.handlePortConnect} />
          <Port type="output" contentType="value" content={this.state.sawtoothData} handlePortConnect={this.props.handlePortConnect} />
          <Port type="output" contentType="value" content={this.state.squareData} handlePortConnect={this.props.handlePortConnect} />
        </div>
      </div>
    );
  };
}

export default LFO;