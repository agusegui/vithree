import "./style.css";

import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import {Pane} from "tweakpane";
import gsap from "gsap";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

import fox1 from "./img/fox0.png";
import fox2 from "./img/fox1.png";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor("#111111");

    this.container.appendChild(this.renderer.domElement);

    /*
    CAMERAS
    */

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );

    this.camera.position.set(0, 0, 1.3);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    /*
    THINGS
    */

    this.clock = new THREE.Clock();
    this.uMouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.settings();
    this.addObjects();

    this.resize();
    this.setupResize();
    this.mouseMovement();
    this.render();
  }

  settings() {
    const pane = new Pane();

    this.parameters = {
      uProgress: 0,
    };

    const f1 = pane.addFolder({title: "Basic"});
    f1.addInput(this.parameters, "uProgress", {min: 0, max: 1, step: 0.01});
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // ASPECTS
    // Here we define the aspect
    this.imageAspect = 853 / 1280;
    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.uResolution.value.x = this.width;
    this.material.uniforms.uResolution.value.y = this.height;
    this.material.uniforms.uResolution.value.z = a1;
    this.material.uniforms.uResolution.value.w = a2;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {value: 0},
        uMouse: {value: new THREE.Vector2(0, 0)},
        uProgress: {value: 0},
        uTexture1: {value: new THREE.TextureLoader().load(fox1)},
        uTexture2: {value: new THREE.TextureLoader().load(fox2)},
        uResolution: {value: new THREE.Vector4()},
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  mouseMovement() {
    window.addEventListener("mousemove", (event) => {
      this.uMouse.x = event.clientX / this.width;
      this.uMouse.y = 1 - event.clientY / this.height;

      this.material.uniforms.uMouse.value = this.uMouse;
    });

    window.addEventListener("mousedown", (e) => {
      gsap.to(this.parameters, {
        duration: 1,
        uProgress: 1,
        ease: "power3.out",
      });

      if (this.parameters.uProgress === 1) {
        gsap.to(this.parameters, {
          duration: 1,
          uProgress: 0,
          ease: "power3.out",
        });
      }
    });
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();

    this.material.uniforms.uTime.value = this.elapsedTime;
    this.material.uniforms.uProgress.value = this.parameters.uProgress;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
