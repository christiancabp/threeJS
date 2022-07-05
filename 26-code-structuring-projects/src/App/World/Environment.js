import * as THREE from 'three';

import App from '../App';

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;
    this.debug = this.app.debug;

    /**
     * Debug
     */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Environment');
    }

    this.setSunlight();
    this.setEnvironmentMap();
  }

  // Sunlight
  setSunlight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    /**
     * Debug
     */

    if (this.debug.active) {
      // Intensity
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('Sunlight intensity: ')
        .min(0)
        .max(10)
        .step(0.001);

      // X
      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('Sunlight X: ')
        .min(-5)
        .max(5)
        .step(0.001);

      // Y
      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('Sunlight Y: ')
        .min(-5)
        .max(5)
        .step(0.001);

      // Z
      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('Sunlight Z: ')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  // Environment map
  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        // Traverse through all meshes to add environmentMap
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.environmentMap.updateMaterials();

    /**
     * Debug
     */

    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('envMap Intensity: ')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => {
          this.environmentMap.updateMaterials();
        });
    }
  }
}
