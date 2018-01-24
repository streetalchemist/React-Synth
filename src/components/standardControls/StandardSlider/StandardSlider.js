import React, { Component } from 'react';
import './StandardSlider.css';

class StandardSlider extends Component {
  constructor() {
    super();
    this.state = {
      
    };
  }
  
  componentDidMount() {
    
  }

  handleSliderChange(event) {
    this.props.handleSliderChange(event.target.value);
  }
  
  render() {

    var holderStyle = {};
    var sliderStyle = {};

    if(this.props.orientation == "vertical") {
      holderStyle.height = this.props.length;
      sliderStyle.width = this.props.length;
    } else {
      holderStyle.width = this.props.length;
      //sliderStyle.width = this.props.length;
    }

    return(
      <div style={holderStyle} className={"standard-slider "+(this.props.orientation == 'vertical' ? ' standard-slider-vertical' : '')}>
        <input style={sliderStyle} className={""+(this.props.active == true ? ' active' : '')} type="range" min={this.props.minValue} max={this.props.maxValue} step={this.props.sensitivity} value={this.props.value} onChange={this.handleSliderChange.bind(this)} />
      </div>
    );
  };
}

export default StandardSlider;