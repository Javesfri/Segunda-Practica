const socket = io()
const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");

let user;
let mail;
const val = document.getElementById("chatBox");


Swal.fire({
    title: 'Login Form',
    html: `<input type="text" id="login" class="swal2-input" placeholder="Nombre">
    <input type="email" id="password" class="swal2-input" placeholder="Mail">`,
    confirmButtonText: 'Ingresar',
    focusConfirm: false,
    preConfirm: () => {
      const nombre = Swal.getPopup().querySelector('#login').value
      const mail = Swal.getPopup().querySelector('#password').value
      if (!nombre || !mail) {
        Swal.showValidationMessage(`Ingrese un Nombre o Email correctos`)
      }
      return { nombre: nombre, mail: mail }
    }
  }).then((result) => {
    user= result.value.nombre
    mail= result.value.mail
    console.log(`${result.value.nombre} está en linea`)
  })
  


botonChat.addEventListener("click", () => {
  if(val.value.trim().length >0){
    console.log(val.value)
    socket.emit("message",{nombre:user,email:mail,message:val.value})
    val.value=""
  }
});

socket.on("allMessages",arrayMensajes =>{
    parrafosMensajes.innerHTML ="" //Limpio los parrafos
    arrayMensajes.forEach(mensaje =>{
        parrafosMensajes.innerHTML +=`<p><strong>${mensaje.nombre}</strong> dice: ${mensaje.message} </p>`
    })
})