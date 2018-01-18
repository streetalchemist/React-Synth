import React, { Component } from 'react';
import Port from '../../core/Port/Port';
import './EightStepSeq.css';

class EightStepSeq extends Component {
  constructor() {
    super();
    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeNoteFreq = this.changeNoteFreq.bind(this);
    this.tick = this.tick.bind(this);
    this.handleSync = this.handleSync.bind(this);
    this.initialClockSpeed = 500;
    this.noteSliders = null;
    this.state = {
      millis:0,
      sendValue: this.initialSendValue,
      currentNote:0,
      clockElapsed:0,
      clockSpeed:500,
      notes:[
        {value:0},
        {value:0},
        {value:0},
        {value:0},
        {value:0},
        {value:0},
        {value:0},
        {value:0},
      ]
    }
  }
  
  componentDidMount() {
      this.setState({
         request: requestAnimationFrame(this.tick)
      });
  }

  changeSpeed(event) {
    this.setState({
      clockSpeed:2000-event.target.value
    });
  }

  changeNoteFreq(event) {
    let freqs = this.state.notes.slice();
    freqs[event.target.getAttribute("data-noteNum")].value = event.target.value;
    this.setState({
      notes:freqs
    });
  }

  tick(timestamp) {
    var elapsed = Date.now() - this.state.millis;
    //console.log(this.state.clockElapsed);
    var newElapsed = this.state.clockElapsed + elapsed;
    //console.log(newElapsed);
    if(newElapsed > this.state.clockSpeed) {
      var newNote = this.state.currentNote + 1;
      if(newNote >= this.state.notes.length) {
        newNote = 0;
      }
      this.setState({
        clockElapsed:0,
        currentNote:newNote
      });
    } else {
      //console.log(newElapsed);
      this.setState({
        clockElapsed:newElapsed
      });
    }
    this.setState({
       millis: Date.now(),
       request: requestAnimationFrame(this.tick)
    });
  }

  handleSync() {
    console.log("SYNCING");
    this.setState({
      clockElapsed:0,
      currentNote:0,
    });
  }
  
  
  render() {

    var currentNoteFreq = this.state.notes[this.state.currentNote].value;

    return(
      <div className="module eight-step-seq">
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 0 ? ' active' : '')} data-noteNum="0" type="range" name="noteFreq_0" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 1 ? ' active' : '')} data-noteNum="1" type="range" name="noteFreq_1" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 2 ? ' active' : '')} data-noteNum="2" type="range" name="noteFreq_2" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 3 ? ' active' : '')} data-noteNum="3" type="range" name="noteFreq_3" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 4 ? ' active' : '')} data-noteNum="4" type="range" name="noteFreq_4" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 5 ? ' active' : '')} data-noteNum="5" type="range" name="noteFreq_5" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 6 ? ' active' : '')} data-noteNum="6" type="range" name="noteFreq_6" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-slider"><input className={""+(this.state.currentNote == 7 ? ' active' : '')} data-noteNum="7" type="range" name="noteFreq_7" min="0" max="2000" step="1" defaultValue="0" onChange={this.changeNoteFreq} /></div>
        <div className="module-eight-step-seq-clock">
          <label>clock</label>
          <div className="module-eight-step-seq-slider module-eight-step-seq-clock-slider"><input type="range" name="clockValue" min="30" max="2000" step="1" defaultValue={2000-this.initialClockSpeed} onChange={this.changeSpeed} /></div>
        </div>
        <div className="module-eight-step-seq-sync">
          <label>sync</label>
          <div onClick={this.handleSync}></div>
        </div>
        <div className="module-eight-step-seq-ports">
          <label>
            <Port type="output" content={currentNoteFreq} contentType="value" handlePortConnect={this.props.handlePortConnect} />1v/oct out
          </label>
        </div>
      </div>
    );
  };
}

export default EightStepSeq;