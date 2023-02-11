import React, {ReactComponent} from 'react';
import '../css/Icons.css'

// icons

import {ReactComponent as Icon1} from '../assets/angles-left-solid.svg';
export class PrevPageIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon1
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon2} from '../assets/angles-right-solid.svg';
export class NextPageIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon2
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon3} from '../assets/arrows-rotate-solid.svg';
export class RefreshIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon3
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon4} from '../assets/magnifying-glass-solid.svg';
export class SearchIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon4
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon5} from '../assets/right-from-bracket-solid.svg';
export class LogoutIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon5
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon6} from '../assets/trash-solid.svg';
export class DeleteIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon6
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon7} from '../assets/x-solid.svg';
export class ClearIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon7
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

import {ReactComponent as Icon8} from '../assets/clock-regular.svg';
export class ClockIcon extends React.Component {
  constructor() {
    super()
  }
  render(){
    return (
      <Icon8
        className="icons"
        fill="white"
        width="1rem"
      />
    );
  }
}

