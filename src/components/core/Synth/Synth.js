import React, { Component } from 'react';
import MainOut from '../MainOut/MainOut';
import VCO from '../../modules/VCO/VCO';
import VCF from '../../modules/VCF/VCF';
import TestModule from '../../modules/TestModule/TestModule';
import PatchCable from '../PatchCable/PatchCable';
import EightStepSeq from '../../modules/EightStepSeq/EightStepSeq';
import './Synth.css';

class Synth extends Component {
  constructor() {
    super();
    this.audioCtx = new AudioContext();
    this.handlePortConnect = this.handlePortConnect.bind(this);
    this.removeCable = this.removeCable.bind(this);
    this.moduleItems = null;
    this.cables = [];
    this.cableStart = null;
    this.state = {
      modules:[
        {
          type:'mainout',
        },
        {
          type:'vco',
        },
        {
          type:'vcf',
        },
        {
          type:'eightStepSeq',
        }
      ],
      cables:[]
    };

    this.moduleItems = this.state.modules.map((module, index) => {
      switch(module.type) {
        case 'mainout':
          return <MainOut key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'vco':
          return <VCO key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'vcf':
          return <VCF key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'testModule':
          return <TestModule key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'eightStepSeq':
          return <EightStepSeq key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        default:
          return '';
      }
    });

  }

  removeCable(cable) {
    var array = this.state.cables;
    var index = array.indexOf(cable);
    array.splice(index, 1);
    this.setState({cable: array });
    this.cableStart = null;
  }

  handlePortConnect(port) {
    if(!this.cableStart) {
      this.cableStart = port;
    } else {
      if(this.cableStart === port) {
      } else {
        var newCable = <PatchCable key={"cable-"+new Date().getTime()} name={"cable-"+new Date().getTime()} portA={this.cableStart} portB={port} unmountMe={this.removeCable} />;
        this.setState({cables:this.state.cables.concat([newCable])});
      }
      this.cableStart = null;
    }
  }
  
  render() {
    return (
      <div className="synth">
        <h4 className="component-label">Synth</h4>
        <div className="module-container">
         {this.moduleItems}
        </div>
        <div>
         {this.state.cables}
        </div>
      </div>
    );
  }
}

export default Synth;