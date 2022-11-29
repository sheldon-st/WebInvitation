import { gsap } from "gsap";
import { Item } from "./item";
import { Preview } from "./preview";
import * as THREE from "three";

// body element
const body = document.body;

// .content element
const contentEl = document.querySelector(".content");

// frame element
const frameEl = document.querySelector(".frame");

// top and bottom overlay overlay elements
const overlayRows = [...document.querySelectorAll(".overlay__row")];

// Preview instances array
const previews = [];
[...document.querySelectorAll(".preview")].forEach((preview) =>
  previews.push(new Preview(preview))
);

// Item instances array
const items = [];
[...document.querySelectorAll(".item")].forEach((item, pos) =>
  items.push(new Item(item, previews[pos]))
);

const openItem = (item) => {
  gsap
    .timeline({
      defaults: {
        duration: 1,
        ease: "power3.inOut",
      },
    })
    .add(() => {
      // pointer events none to the content
      contentEl.classList.add("content--hidden");
    }, "start")

    .addLabel("start", 0)
    .set(
      [item.preview.DOM.innerElements, item.preview.DOM.backCtrl],
      {
        opacity: 0,
      },
      "start"
    )
    .to(
      overlayRows,
      {
        scaleY: 1,
      },
      "start"
    )

    .addLabel("content", "start+=0.6")

    .add(() => {
      body.classList.add("preview-visible");

      gsap.set(
        frameEl,
        {
          opacity: 0,
        },
        "start"
      );
      item.preview.DOM.el.classList.add("preview--current");
    }, "content")
    // Image animation (reveal animation)
    .to(
      [item.preview.DOM.image, item.preview.DOM.imageInner],
      {
        //startAt: { y: (pos) => (pos ? "0%" : "0%") },
        startAt: { opacity: 0 },
        opacity: 1,

        y: "0%",
      },
      "content"
    )

    .add(() => {
      for (const line of item.preview.multiLines) {
        line.in();
      }
      gsap.set(item.preview.DOM.multiLineWrap, {
        opacity: 1,
        delay: 0.1,
      });
    }, "content")
    // animate frame element
    .to(
      frameEl,
      {
        ease: "expo",
        startAt: { y: "-100%", opacity: 0 },
        opacity: 1,
        y: "0%",
      },
      "content+=0.3"
    )
    .to(
      item.preview.DOM.innerElements,
      {
        ease: "expo",
        startAt: { yPercent: 101 },
        yPercent: 0,
        opacity: 1,
      },
      "content+=0.3"
    )
    .to(
      item.preview.DOM.backCtrl,
      {
        opacity: 1,
      },
      "content"
    );
};

const closeItem = (item) => {
  gsap
    .timeline({
      defaults: {
        duration: 1,
        ease: "power3.inOut",
      },
    })
    .addLabel("start", 0)
    .to(
      item.preview.DOM.innerElements,
      {
        yPercent: -101,
        opacity: 0,
      },
      "start"
    )
    .add(() => {
      for (const line of item.preview.multiLines) {
        line.out();
      }
    }, "start")

    .to(
      item.preview.DOM.backCtrl,
      {
        opacity: 0,
      },
      "start"
    )

    .to(
      item.preview.DOM.image,
      {
        // y: "0%",
        opacity: 0,
      },
      "start"
    )
    .to(
      item.preview.DOM.imageInner,
      {
        // y: "0%",
        opacity: 0,
      },
      "start"
    )

    // animate frame element
    .to(
      frameEl,
      {
        opacity: 0,
        y: "-100%",
        onComplete: () => {
          body.classList.remove("preview-visible");
          gsap.set(frameEl, {
            opacity: 1,
            y: "0%",
          });
        },
      },
      "start"
    )

    .addLabel("grid", "start+=0.6")

    .to(
      overlayRows,
      {
        //ease: 'expo',
        scaleY: 0,
        onComplete: () => {
          item.preview.DOM.el.classList.remove("preview--current");
          contentEl.classList.remove("content--hidden");
        },
      },
      "grid"
    );
};

for (const item of items) {
  // Opens the item preview
  item.DOM.link.addEventListener("click", () => openItem(item));
  // Closes the item preview
  item.preview.DOM.backCtrl.addEventListener("click", () => closeItem(item));
}

// Once all elements with classes: s, o, c, i, a, l, a2, n, x, i2, a, l have been hovered, we will call openItem(items[0])
const socials = [...document.querySelectorAll(".initHidden")];
let socialsHovered = 0;
for (const social of socials) {
  social.addEventListener(
    "mouseenter",
    () => {
      socialsHovered++;
      console.log(socialsHovered);
      if (socialsHovered === socials.length) {
        // wait 1 second and then open the first item
        setTimeout(() => openItem(items[0]), 1000);
        socialsHovered = 0;
        //openItem(items[0]);
      }
    },
    { once: true }
  );
}

/* var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const div = document.getElementById("js-image");
console.log(div);
div.appendChild(renderer.domElement);

let TEXTURE = new THREE.TextureLoader().load("img/1_big.jpg");
let mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshBasicMaterial({ map: TEXTURE })
);

camera.position.z = 5;

var animate = function () {
  // set up post processing
  let composer = new THREE.EffectComposer(renderer);
  let renderPass = new THREE.RenderPass(scene, camera);
  // rendering our scene with an image
  composer.addPass(renderPass);

  // our custom shader pass for the whole screen, to displace previous render
  let customPass = new ShaderPass({ vertexShader, fragmentShader });
  // making sure we are rendering it.
  customPass.renderToScreen = true;
  composer.addPass(customPass);

  // actually render scene with our shader pass
  composer.render();
  // instead of previous
  // renderer.render(scene, camera);
};

animate();
 */