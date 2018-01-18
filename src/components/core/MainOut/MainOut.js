import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import './MainOut.css';

class MainOut extends Component {
  constructor() {
    super();
    this.changeVolume = this.changeVolume.bind(this);
    this.handlePower = this.handlePower.bind(this);
    this.initialVolume = 30;
    this.state = {
      gainNode:null,
      isPowered:true,
    };
  }
  
  componentDidMount() {
    var newGainNode = this.props.ctx.createGain();
    newGainNode.connect(this.props.ctx.destination);
    newGainNode.gain.value = this.initialVolume/100;
    this.setState({gainNode:newGainNode});
  }
  
  changeVolume(event) {
    this.state.gainNode.gain.value = event.target.value/100;
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
        <div className="standard-slider standard-slider-vertical main-out-slider-gain">
          <input type="range" name="volume" min="0" max="100" step="1" defaultValue={this.initialVolume} onChange={this.changeVolume} />
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