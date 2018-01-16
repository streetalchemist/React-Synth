import React, { Component } from 'react';
import Port from '../../core/Port/Port';

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
        <h4>Main Output</h4>
        <label>
          Power
          <input
            name="isPowered"
            type="checkbox"
            checked={this.state.isPowered}
            onChange={this.handlePower} />
        </label>
        <label>Volume:
          0<input type="range" name="volume" min="0" max="100" step="1" defaultValue={this.initialVolume} onChange={this.changeVolume} />11
         </label>
         <label>Input:
          <Port type="input" contentType="audioNode" content={this.state.gainNode} handlePortConnect={this.props.handlePortConnect}  />
         </label>
      </div>
    );
  }
}

export default MainOut;