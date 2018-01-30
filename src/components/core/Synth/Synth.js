import React, { Component } from 'react';
import MainOut from '../MainOut/MainOut';
import VCO from '../../modules/VCO/VCO';
import VCF from '../../modules/VCF/VCF';
import TestModule from '../../modules/TestModule/TestModule';
import PatchCable from '../PatchCable/PatchCable';
import EightStepSeq from '../../modules/EightStepSeq/EightStepSeq';
import Mx101 from '../../modules/Mx101/Mx101';
import LFO from '../../modules/LFO/LFO';
import ADSRock from '../../modules/ADSRock/ADSRock';
import Vca202 from '../../modules/Vca202/Vca202';
import CNCTKey from '../../modules/CNCTKey/CNCTKey';
import './Synth.css';

class Synth extends Component {
  constructor() {
    super();
    this.audioCtx = new AudioContext();
    this.handlePortConnect = this.handlePortConnect.bind(this);
    this.removeCable = this.removeCable.bind(this);
    this.addModule = this.addModule.bind(this);
    this.updateModulePicker = this.updateModulePicker.bind(this);
    this.moduleItems = null;
    this.cables = [];
    this.cableStart = null;
    this.moduleTypes = [
      {name:"rsvco - (vco)",type:"vco"},
      {name:"rsvcf - (vcf)",type:"vcf"},
      {name:"rslfo - (lfo)",type:"lfo"},
      {name:"8 Step - (sequencer)",type:"eightStepSeq"},
      {name:"Mx-101 - (mixer)",type:"mx101"},
      {name:"Vca-202 - (vca)",type:"vca202"},
      {name:"ADSRock - (envelope generator)",type:"adsrock"},
      {name:"CNCTKey - (QWERTY keyboard control)",type:"cnctkey"},
      //{name:"testModule - (testModule)",type:"testModule"},
    ];
    this.state = {
      modules:[
        {
          type:'mainout',
        },
        {
          type:'vco',
        },
        {
          type:'lfo',
        },
        {
          type:'vcf',
        },
        {
          type:'mx101',
        }, 
        {
          type:'vca202',
        }, 
        {
          type:'eightStepSeq',
        },
        {
          type:'adsrock',
        },
        {
          type:'cnctkey',
        }
      ],
      modulePicker:this.moduleTypes[0].type,
      cables:[]
    };

    this.moduleList = this.moduleTypes.map((module, index) => {
      return (<option key={index} value={module.type}>{module.name}</option>);
    });

  }

  addModule(event) {
    this.setState({modules:this.state.modules.concat([{type:this.state.modulePicker}])});
  }

  updateModulePicker(event) {
    this.setState({modulePicker:event.target.value});
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
    var moduleItems = this.state.modules.map((module, index) => {
      switch(module.type) {
        case 'mainout':
          return <MainOut key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'vco':
          return <VCO key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'vcf':
          return <VCF key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'lfo':
          return <LFO key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'testModule':
          return <TestModule key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'eightStepSeq':
          return <EightStepSeq key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'mx101':
          return <Mx101 key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'vca202':
          return <Vca202 key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'adsrock':
          return <ADSRock key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        case 'cnctkey':
          return <CNCTKey key={index} ctx={this.audioCtx} handlePortConnect={this.handlePortConnect} />;
        default:
          return '';
      }
    });

    return (
      <div className="synth">
        <h4 className="component-label">REACT SYNTH <select onChange={this.updateModulePicker}>{this.moduleList}</select> <button onClick={this.addModule}>Add</button></h4>
        <div className="module-container">
         {moduleItems}
        </div>
        <div>
         {this.state.cables}
        </div>
      </div>
    );
  }
}

export default Synth;