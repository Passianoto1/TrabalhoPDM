
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { type: 'module' });
      console.log('Service worker registrado: ', reg);
    } catch (err) {
      console.log('O Service worker falhou: ', err);
    }
  });
}


const constraints = { video: { facingMode: "user" }, audio: false };

const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger");


      function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Ocorreu um erro: ", error);
    });
}


cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart);
