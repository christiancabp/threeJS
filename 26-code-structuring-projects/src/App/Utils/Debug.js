import * as dat from 'lil-gui';

export default class Debug {
  constructor() {
    this.active = window.location.hash === '#debug'; //checks for /#debug route

    if (this.active) {
      this.ui = new dat.GUI();
    }
    // console.log('Debug has started');
  }
}
