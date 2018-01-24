# React Synth

React Synth is a React based modular synthesizer using the WebAudio API.

View the current version of the live synth at [https://streetalchemist.github.io/React-Synth/](https://streetalchemist.github.io/React-Synth/)

Initially created as a personal project to learn React, I decided to turn this into an open source project as I'm really enthusiastic about modular synths in the physical world and would love to see lots of web-based modules built to see how we can push the limits of WebAudio.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). For all major deployment instructions check the guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Version
0.0.4

## Getting Started

To get the project running run `npm install` and `npm start` which will serve the project in development mode at [http://localhost:3000](http://localhost:3000)

To build the project, run `npm run build` which builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

See the Create React App [guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for more information.

## Current Modules

Below are the modules currently available, and below that is the roadmap for the future!

- rsvco - basic vco
- rsvcf - basic filter
- rslfo - basic lfo
- 8Step - 8 step sequencer to control a vco
- mx-101 - basic 4 line mixer with gain control for each line

## Roadmap

This project is in its very early stages. Right now it's little more than a tone generator but eventually I hope for it to be a fun piece of software to create new sounds, learn the basics of synthesis, and even create some pretty killer tracks. That all being said I have a few ideas for the next steps and where my intention to take the project is.

- More modules, some of which are under development currently and some of which are just hopes for future dev
	- ADSR Enveloper Generation
	- VCA
	- Keyboard to CV/Gate
	- Drum Sequencer
	- Quantizer

- Some standard controls like knobs/sliders/etc. for people to begin building their own modules with (as well as some deep instruction in the structure and creation of these modules).


## Changelog

- 0.0.4 rslfo module added, standard knob moved to standardControls, standard slider created, rsvcf VC in and level added along with start of VC standard in the project
- 0.0.3 mx-101 module added, standard knob built, but not yet in the right place or documented
- 0.0.2 Ability to add modules, and fully designed initial modules
- 0.0.1 First version with set 4 modules in place.

## Acknoledgements

- Carbon fiber tiling background for synth case from [Cobaidh](https://community.coreldraw.com/show/community_galleries_abc_/m/cobaidh/143125)

- Github user gajus for the [react-outside-event](https://github.com/gajus/react-outside-event) component in order to handle mouseups when not released on the component.