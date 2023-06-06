const url = "http://localhost:3000";

function registrarse(nombre, correo, contraseña) {
  const data = {
    "nombre": nombre,
    "correo": correo,
    "contraseña": contraseña
  }
  const urlUsusarioRegistro = url + "/registrarse";
  const response = fetch(urlUsusarioRegistro, {
    url: urlUsusarioRegistro,
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    //mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}
function iniciarSesion(nombre, contraseña){
  const dataBody = {
    "nombre": nombre,
    "contraseña": contraseña
  }
  const urlUsusarioLogin = url + "/login";
  const response = fetch(urlUsusarioLogin, {
    url: urlUsusarioLogin,
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    //mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataBody), // body data type must match "Content-Type" header
  }).then(function(response){
    response.json().then(function(info){
    localStorage.setItem("data", JSON.stringify(info))
    console.log(JSON.stringify(info))
    })
  });
}

function test() {
  localStorage.clear()
  console.log(localStorage.getItem("data"))
}


