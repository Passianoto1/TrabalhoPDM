import { salvarRegistro, listarRegistros } from "./db.js";

/* ----- Service Worker ----- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { type: "module" });
  });
}

/* ----- Câmera ----- */
const constraints = { video: { facingMode: "user" }, audio: false };

const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");

function cameraStart() {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => cameraView.srcObject = stream)
    .catch(err => console.error(err));
}

cameraTrigger.onclick = () => {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart);

/* ----- Inputs + salvar no IndexedDB ----- */
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");
const saveBtn = document.querySelector("#save-btn");
const savedList = document.querySelector("#saved-list");

async function atualizarLista() {
  const dados = await listarRegistros();
  savedList.innerHTML = "";

  dados.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-salvo";
    div.innerHTML = `
      <img src="${item.foto}" width="120">
      <p>${item.texto1}</p>
      <p>${item.texto2}</p>
      <hr>
    `;
    savedList.appendChild(div);
  });
}

saveBtn.onclick = async () => {
  if (!cameraOutput.src.startsWith("data:")) {
    alert("Tire uma foto antes!");
    return;
  }

  await salvarRegistro({
    foto: cameraOutput.src,
    texto1: input1.value,
    texto2: input2.value,
    data: Date.now()
  });

  input1.value = "";
  input2.value = "";

  atualizarLista();
};

atualizarLista();
