import React, { Component } from 'react';
import './PatchCable.css';

class PatchCable extends Component {
  constructor() {
    super();

    this.state = {
      outputPort:null,
      portATop:0,
      portALeft:0,
      portBTop:0,
      portBLeft:0,
      innerColor:Math.floor(Math.random()*14),
      outerColor:Math.floor(Math.random()*14)
    }
  }

  componentDidMount() {
    //Kill cable if port types aren't compatible
    if(this.props.portA.props.contentType !== this.props.portB.props.contentType) {
      this.props.unmountMe(this);
      return;
    }

    //Kill cable if not input/output pair
    if(!((this.props.portA.props.type === "input" && this.props.portB.props.type === "output") || (this.props.portB.props.type === "input" && this.props.portA.props.type === "output"))) {
      this.props.unmountMe(this);
      return;
    }



    this.props.portA.updateCable(this);
    this.props.portB.updateCable(this);
    if(this.props.portA.props.type === "input") {
      if(this.props.portB.props.contentType === "value") {
        this.props.portA.handleValueInput(this.props.portB.props.content);
      }
      this.setState({outputPort:this.props.portA});
    } else {
      if(this.props.portA.props.contentType === "value") {
        this.props.portB.handleValueInput(this.props.portA.props.content);
      }
      this.setState({outputPort:this.props.portB});
    }

    //Set offsets for patch cable drawing TODO
    this.setState({
      portATop:this.props.portA.myDiv.offsetTop,
      portALeft:this.props.portA.myDiv.offsetLeft,
      portBTop:this.props.portB.myDiv.offsetTop,
      portBLeft:this.props.portB.myDiv.offsetLeft
    });

    //Connect audioNodes from output to input
    if(this.props.portA.props.type === "output" && this.props.portA.props.contentType === "audioNode") {
      if(this.props.portB.props.type === "input" && this.props.portB.props.contentType=== "audioNode") {
        this.props.portA.props.content.connect(this.props.portB.props.content);
      }
    }

    if(this.props.portB.props.type === "output" && this.props.portB.props.contentType === "audioNode") {
      if(this.props.portA.props.type === "input" && this.props.portA.props.contentType === "audioNode") {
        this.props.portB.props.content.connect(this.props.portA.props.content);
      }
    }

  }

  handleValueInput(newContent) {
    this.state.outputPort.handleValueInput(newContent);
  }

  disconnect() {
    if(this.props.portA.props.type === "output" && this.props.portA.props.contentType === "audioNode") {
      if(this.props.portB.props.type === "input" && this.props.portB.props.contentType === "audioNode") {
        this.props.portA.props.content.disconnect(this.props.portB.props.content);
      }
    }

    if(this.props.portB.props.type === "output" && this.props.portB.props.contentType === "audioNode") {
      if(this.props.portA.props.type === "input" && this.props.portA.props.contentType === "audioNode") {
        this.props.portB.props.content.disconnect(this.props.portA.props.content);
      }
    }

    this.props.portA.updateCable(null);
    this.props.portB.updateCable(null);
    this.props.unmountMe(this);

  }

  
  render() {
    return(<div className="patchcable" />);
    /*return(
      <div className="patchcable">
        Patch Cable - End1:{this.props.portA.props.type} End2:{this.props.portB.props.type} - {this.props.name}
      </div>
    );*/
  };
}

export default PatchCable;