import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import './CNCTKey.css';
import StandardSlider from '../../standardControls/StandardSlider/StandardSlider';
import ReactOutsideEvent from '../../vendor/react-outside-event';

class CNCTKey extends Component {
  constructor() {
    super();
    this.keys = {
      a:{pressed:false,noteNum:0,name:"C"},
      w:{pressed:false,noteNum:1,name:"C#"},
      s:{pressed:false,noteNum:2,name:"D"},
      e:{pressed:false,noteNum:3,name:"D#"},
      d:{pressed:false,noteNum:4,name:"E"},
      f:{pressed:false,noteNum:5,name:"F"},
      t:{pressed:false,noteNum:6,name:"F#"},
      g:{pressed:false,noteNum:7,name:"G"},
      y:{pressed:false,noteNum:8,name:"G#"},
      h:{pressed:false,noteNum:9,name:"A"},
      u:{pressed:false,noteNum:10,name:"A#"},
      j:{pressed:false,noteNum:11,name:"B"},
      k:{pressed:false,noteNum:12,name:"C"},
      o:{pressed:false,noteNum:13,name:"C#"},
      l:{pressed:false,noteNum:14,name:"D"},
      p:{pressed:false,noteNum:15,name:"D#"},
      ";":{pressed:false,noteNum:16,name:"E"},
      "'":{pressed:false,noteNum:17,name:"F"},
    }
    this.state = {
      isConnected:false,
      octave:5,
      outputFreq:0,
      outputGate:0,
      outputExpander:0,
      currentKey:"",
      currentNote:"-",
    }
  }

  componentDidMount() {
    
  }

  noteNumToFreq(num) {
    var normalizedNum = (parseInt(this.state.octave)+2)*12+parseInt(num); //MIDI octave numbers go from -2 to 8
    var freq = Math.pow(2,(normalizedNum-69)/12)*440; //MIDI note number to frequency conversion formula
    return freq;
  }

  keyPressed(event) {
    this.handleKeyDown(event);
  }

  keyReleased(event) {
    this.handleKeyUp(event);
  }

  handleConnect(event) {
    this.setState({isConnected:event.target.checked}, ()=>{
    });
  }
  
  handleOctaveSlider(value) {
    this.setState({octave:value});
  }

  handleKeyDown(event) {
    if(this.keys[event.key] && !this.keys[event.key].pressed) {
      this.keys[event.key].pressed = true;
      console.log("Now pressed:",this.keys[event.key].noteNum);
      var noteName = "";
      if(this.keys[event.key].noteNum > 11) {
        noteName = this.keys[event.key].name+(parseInt(this.state.octave)+1);
      } else {
        noteName = this.keys[event.key].name+this.state.octave;
      }

      this.setState({
        outputFreq:this.noteNumToFreq(this.keys[event.key].noteNum),
        outputGate:1,
        currentNote:noteName,
        currentKey:event.key,
      });
    }
  }

  handleKeyUp(event) {
    if(this.keys[event.key] && this.keys[event.key].pressed) {
      this.keys[event.key].pressed = false;
      if(event.key == this.state.currentKey) {
        this.setState({
          outputGate:0,
          //outputFreq:0,
          currentKey:null,
          currentNote:"-",
        });
      }
    }
  }

  onOutsideEvent = (event) => {
    if(this.state.isConnected) {
      if (event.type === 'keyup') {
        this.handleKeyUp(event);
      } else if (event.type === 'keydown') {
        this.handleKeyDown(event);
      }
    }
  }

  render() {


    return(
      <div className="module cnct-key" onKeyDown={this.keyPressed.bind(this)} onKeyUp={this.keyReleased.bind(this)}>
        <h4>CNCT Key</h4>
        <label>on/off
          <input
            name="isConnected"
            type="checkbox"
            checked={this.state.isConnected}
            onChange={this.handleConnect.bind(this)} />
          <span className="checkmark"></span>
        </label>
        octave 8
        <div className="module-cnct-key-slider-holder">
          <StandardSlider length={140} minValue={-2} maxValue={8} sensitivity={1} orientation={"vertical"} value={this.state.octave} handleSliderChange={this.handleOctaveSlider.bind(this)} />
        </div>
        octave -2
        <div className="module-cnct-key-activity">
          {this.state.currentNote}
        </div>
        <label>1v/oct out
          <Port type="output" contentType="value" content={this.state.outputFreq} handlePortConnect={this.props.handlePortConnect} />
        </label>
        <label>gate out
          <Port type="output" contentType="value" content={this.state.outputGate} handlePortConnect={this.props.handlePortConnect} />
        </label>
        <label>expander
          <Port type="output" contentType="value" content={this.state.outputExpander} handlePortConnect={this.props.handlePortConnect} />
        </label>
      </div>
    );
  };
}

export default ReactOutsideEvent(CNCTKey, ['keydown','keyup']);;