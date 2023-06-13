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
  var dataBody = {
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
    if(info == "contraseña incorrecta"){
      document.getElementById("incorrecta").style.display = "block"
      document.getElementById("usuarioNe").style.display = "none"
    }
    else if(info == "usuario no encontrado"){
      document.getElementById("usuarioNe").style.display = "block"
      document.getElementById("incorrecta").style.display = "nonr"
    }
    else{
      document.getElementById("staticBackdrop2").style.display = "none"
      $('.modal-backdrop').hide();
      document.getElementById("btn-registro").style.display = "none"
      document.getElementById("btn-login").style.display = "none"
      document.getElementById("btn-cs").style.display = "block"
    }
    console.log(info);
    })
  });
}

function cerrarSesion() {
  localStorage.clear()
  location.reload()
}


