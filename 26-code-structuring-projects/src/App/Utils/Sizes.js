import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    // console.log('new size class instance');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRation = Math.min(window.devicePixelRatio, 2);

    //Resize event
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRation = Math.min(window.devicePixelRatio, 2);
      this.trigger('resize'); // listen to resize
    });
  }
}
