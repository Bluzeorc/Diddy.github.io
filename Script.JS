let scene, camera, renderer, controls;
let parts = {};
let progress = 0;

const progressBar = document.getElementById("progressBar");
const instructionText = document.getElementById("instructionText");

// Initialize scene
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
  camera.position.set(0, 3, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, 500);
  document.getElementById("builderContainer").appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  addLight();
  addObjects();
  animate();
}

function addLight() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.5);
  directional.position.set(5, 10, 7.5);
  scene.add(directional);
}

function addObjects() {
  const geometries = {
    motherboard: new THREE.BoxGeometry(5, 0.2, 4),
    cpu: new THREE.BoxGeometry(1, 0.3, 1),
    gpu: new THREE.BoxGeometry(2, 0.4, 1),
    ram: new THREE.BoxGeometry(0.3, 0.5, 2),
    psu: new THREE.BoxGeometry(1.5, 0.8, 1.5)
  };

  const materials = {
    motherboard: new THREE.MeshStandardMaterial({ color: 0x1f77b4 }),
    cpu: new THREE.MeshStandardMaterial({ color: 0xd62728 }),
    gpu: new THREE.MeshStandardMaterial({ color: 0x2ca02c }),
    ram: new THREE.MeshStandardMaterial({ color: 0xff7f0e }),
    psu: new THREE.MeshStandardMaterial({ color: 0x9467bd })
  };

  parts.motherboard = new THREE.Mesh(geometries.motherboard, materials.motherboard);
  parts.cpu = new THREE.Mesh(geometries.cpu, materials.cpu);
  parts.gpu = new THREE.Mesh(geometries.gpu, materials.gpu);
  parts.ram = new THREE.Mesh(geometries.ram, materials.ram);
  parts.psu = new THREE.Mesh(geometries.psu, materials.psu);

  parts.motherboard.position.set(0, 0, 0);
  parts.cpu.position.set(0, 1, 0);
  parts.gpu.position.set(3, 1, 0);
  parts.ram.position.set(-3, 1, 0);
  parts.psu.position.set(0, 1, 3);

  Object.values(parts).forEach(obj => scene.add(obj));
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Basic interactivity and progress
document.getElementById("nextStep").onclick = () => updateProgress(20);
document.getElementById("prevStep").onclick = () => updateProgress(-20);
document.getElementById("resetBuild").onclick = () => updateProgress(-progress);
document.getElementById("exitHome").onclick = () => {
  localStorage.removeItem("pcBuildProgress");
  alert("Progress cleared. Returning to main site...");
  window.location.href = "../index.html";
};

function updateProgress(amount) {
  progress = Math.min(100, Math.max(0, progress + amount));
  progressBar.style.width = `${progress}%`;
  localStorage.setItem("pcBuildProgress", progress);
  instructionText.textContent = progress < 100 
    ? `Step progress: ${progress}% complete.` 
    : "Build complete! Great job!";
}

document.getElementById("helpButton").onclick = () =>
  document.getElementById("helpPopup").classList.toggle("hidden");
document.getElementById("closeHelp").onclick = () =>
  document.getElementById("helpPopup").classList.add("hidden");

// Load saved progress
window.onload = () => {
  init();
  const saved = localStorage.getItem("pcBuildProgress");
  if (saved) {
    progress = parseInt(saved);
    progressBar.style.width = `${progress}%`;
    instructionText.textContent = `Resumed build: ${progress}% complete.`;
  }
};
