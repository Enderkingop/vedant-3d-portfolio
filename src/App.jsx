// @ts-nocheck
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";

export default function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a192f");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const objects = [];

    // Dollar $
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const geometry = new TextGeometry("$", {
          font: font,
          size: 1,
          height: 0.3,
        });

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
        });

        const dollar = new THREE.Mesh(geometry, material);
        dollar.position.set(0, 1, 0);
        scene.add(dollar);
        objects.push(dollar);

        gsap.to(dollar.rotation, {
          y: Math.PI * 2,
          duration: 5,
          repeat: -1,
        });
      }
    );

    // Photo
    const texture = new THREE.TextureLoader().load("/photo.png");
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2.5),
      new THREE.MeshStandardMaterial({ map: texture })
    );
    photo.position.set(-2, 0, 0);
    scene.add(photo);
    objects.push(photo);

    // Cards
    ["About", "Projects", "Contact"].forEach((_, i) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.7, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      mesh.position.set(2, i - 1, 0);
      scene.add(mesh);
      objects.push(mesh);
    });

    // Drag
    const drag = new DragControls(objects, camera, renderer.domElement);

    // Mouse force
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.02;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.02;

      objects.forEach((obj) => {
        obj.position.x += x;
        obj.position.y += -y;
      });
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
      <h1
        style={{
          position: "absolute",
          top: 20,
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        Vedant Dhavale
      </h1>

      <p
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        Forex Trader | Anti-Gravity Portfolio
      </p>
    </div>
  );
}
