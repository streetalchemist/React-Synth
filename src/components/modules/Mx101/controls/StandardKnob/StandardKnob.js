import React, { Component } from 'react';
import ReactOutsideEvent from '../../../../vendor/react-outside-event';
import './StandardKnob.css';

class StandardKnob extends Component {
  constructor() {
    super();
    this.state = {
      active:false,
      baseValue:0,
    };
  }
  
  componentDidMount() {
    
  }

  knobClick(e) {
    e.preventDefault();
    console.log(this.props.value);
    this.setState({
      active:true,
      baseValue:this.props.value,
      mouseX:e.clientX,
      mouseY:e.clientY,
    });
  }

  knobReleased(e) {
    if(this.state.active) {
      this.deactivateKnob();
    }
  }

  knobMoved(e) {
    if(this.state.active) {
      this.moveKnob(e.clientX,e.clientY);
    }
  }

  onOutsideEvent = (event) => {
    if(this.state.active) {
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
    var newValue;
    
    //Get drag direction right
    if(Math.abs(diffX) >= Math.abs(diffY)) {
      newValue = this.state.baseValue+(diffX*this.props.sensitivity);
    } else {
      newValue = this.state.baseValue-(diffY*this.props.sensitivity);
    }

    //Clamp value within bounds
    if(newValue > this.props.maxValue) {
      newValue = this.props.maxValue;
    }
    if(newValue < this.props.minValue) {
      newValue = this.props.minValue;
    }

    //console.log(newValue);
    this.props.handleKnobChange(newValue);
    // this.setState({frequency:newFreq});
    // this.state.filter.frequency.value = newFreq;
  }

  deactivateKnob() {
    this.setState({active:false});
  }
  
  render() {

    var knobAngle = ((this.props.value)*(this.props.dragRange*2)/(this.props.maxValue - this.props.minValue))-this.props.dragRange; //x to 140
    console.log("angle",knobAngle);
    var knobRotate = "rotate("+knobAngle+"deg)";
    var knobHolderStyle = {
    }
    var knobStyle = {
      transform:knobRotate,
      width:this.props.size,
      height:this.props.size,
      backgroundImage:this.props.img,
    };

    return(
        <div className="standard-knob-holder" onMouseUp={this.knobReleased.bind(this)} onMouseMove={this.knobMoved.bind(this)}>
          <div className="standard-knob" style={knobStyle} onMouseDown={this.knobClick.bind(this)}></div>
        </div>
    );
  };
}

export default ReactOutsideEvent(StandardKnob, ['mousemove','mouseup']);