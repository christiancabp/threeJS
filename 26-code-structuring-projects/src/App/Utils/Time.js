import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16; // cannot set it too 0
    window.requestAnimationFrame(() => {
      this.tick();
    });

    // console.log('Time class creation');
  }

  tick() {
    // console.log('tick');
    const currentTime = Date.now();
    this.delta = currentTime - this.current; //delta is about 16ms
    this.current = currentTime; // current time update
    this.elapsed = this.current - this.start; // total elapsed time

    this.trigger('tick');

    window.requestAnimationFrame(() => {
      // callback func for the next animation frame
      this.tick();
    });
  }
}
