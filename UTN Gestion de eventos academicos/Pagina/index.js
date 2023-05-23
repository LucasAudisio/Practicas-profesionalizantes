const url = "http://localhost:3000";

function registrarse(nombre, correo, contraseña) {
  const data = {
    "nombre": nombre,
    "correo": correo,
    "contraseña": contraseña
  }
  const urlUsusario = url + "/registrarse";
  const response = fetch(urlUsusario, {
    url: urlUsusario,
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    //mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}

function test() {
  const urlTest = url + "/usuarios";
  fetch(urlTest).then(function (response) {
    response.json().then(function (data) {
      console.log("entra al fetch");
      console.log(data);
    });
  });
}


