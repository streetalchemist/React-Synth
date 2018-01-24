import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import StandardSlider from '../../standardControls/StandardSlider/StandardSlider';
import './MainOut.css';

class MainOut extends Component {
  constructor() {
    super();
    this.handlePower = this.handlePower.bind(this);
    this.state = {
      volume:0.3,
      gainNode:null,
      isPowered:true,
    };
  }
  
  componentDidMount() {
    var newGainNode = this.props.ctx.createGain();
    newGainNode.connect(this.props.ctx.destination);
    newGainNode.gain.value = this.state.volume;
    this.setState({gainNode:newGainNode});
  }

  handleVolumeSlider(value) {
    this.setState({volume:value});
  }

  handlePower(event) {
    this.setState({isPowered:event.target.checked}, ()=>{
      if(this.state.isPowered) {
        this.state.gainNode.connect(this.props.ctx.destination);
      } else {
        this.state.gainNode.disconnect(this.props.ctx.destination);
      }
    });
  }
  
  render() {
    if(this.state.gainNode) {
      this.state.gainNode.gain.value = this.state.volume;
    }

    return (
      <div className="module main-out">
        <h4>Main</h4>
        <label className="main-out-centered-label standard-checkbox main-out-power-label">power
          <input
            name="isPowered"
            type="checkbox"
            checked={this.state.isPowered}
            onChange={this.handlePower} />
          <span className="checkmark"></span>
        </label>
        <label className="main-out-centered-label main-out-gain-label">gain</label>
        <div className="module-main-out-slider-holder">
          <StandardSlider length={200} minValue={0} maxValue={1} sensitivity={.01} orientation={"vertical"} value={this.state.volume} handleSliderChange={this.handleVolumeSlider.bind(this)} />
        </div>
        <div className="main-out-ports">
          <label>input
            <Port type="input" contentType="audioNode" content={this.state.gainNode} handlePortConnect={this.props.handlePortConnect}  />
          </label>
        </div>
      </div>
    );
  }
}

export default MainOut;