import React, { Component } from 'react';
import './port.css';

class Port extends Component {
  constructor() {
    super();
    this.handlePortConnect = this.handlePortConnect.bind(this);
    this.state = {
      io:'', //input or output
      contentType:'', //"audionode" or "value"
      content:null, //AudioNode object or value itself
      cable:null, //PatchCable object that's plugged in to the port
    }
  }

  componentDidMount() {
    this.setState({
      io:this.props.type,
      contentType:this.props.contentType,
    });
  }

  handlePortConnect() {
    if(!this.state.cable) {
      this.props.handlePortConnect(this);
    } else {
      this.state.cable.disconnect();
    }
  }

  handleValueInput(newContent) {
    this.props.handleDataChange(newContent);
  }

  handleValueOutput(newContent) {
    if(this.state.cable) {
      this.state.cable.handleValueInput(newContent);
    }
  }

  updateCable(newCable) {
   this.setState({cable:newCable});
   if(this.state.io === "output" && this.state.contentType === "value") {
    this.handleValueOutput(this.props.content);
   }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.content !== nextProps.content) {
      if(this.state.io === "output") {
        this.handleValueOutput(nextProps.content);
      }
    }
  }
  
  render() {

    let renderedContent = null;
    if(this.state.contentType === "value" && this.state.io === "output") {
      renderedContent = <p className="port-value">--> {this.props.content}</p>;
    }

    return(
      <div className={"port" + (this.state.cable ? ' port-connected port-outer_'+this.state.cable.state.outerColor : '')} onClick={this.handlePortConnect} ref={(ele) => this.myDiv = ele}>
        <div className={"port-inner"+ (this.state.cable ? ' port-connected port-inner_'+this.state.cable.state.innerColor : '')}></div>
      </div>
    );
  };
}

export default Port;