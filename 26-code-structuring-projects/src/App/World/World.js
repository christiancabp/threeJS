import App from '../App';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  constructor() {
    /**
     * Setup
     */
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;

    /**
     * Resources ready?
     */
    this.resources.on('ready', () => {
      // this will know when all the resources are ready
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }
  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
