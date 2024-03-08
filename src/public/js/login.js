import { openModal } from "./modals.js";

const d = document;
const $form = document.querySelector(".form-user");
let $token = ''

 async function createFile(e) {
  try {
    console.log('ingreso');
    let options = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
         data: JSON.stringify({
          userName: e.target.userName.value,
          password: e.target.password.value
      }),
    };

    let res = await axios("https://aerodatos-v10-production.up.railway.app/login", options);
    sessionStorage.setItem('tok',res.data.data.token)
    openModal('pop-up','hidden')
  
  } catch (err) {
 
    let message =err || "Ocurrio un error";
   
  alert(`Error: ${message}`);
  }
}


 
 async function validateToken(e) {
  $token = sessionStorage.getItem('tok');
  try {
    console.log('ingreso');
    let options = {
      method: "GET",
      headers: 
      { "Autorizathion":$token,
        "Content-type": "application/json;charset=utf-8",
       },
    };
    let res = await axios("https://aerodatos-v10-production.up.railway.app/token", options);
    console.log(res.data.data)
  if(res.data.data == 'Administrador' ||res.data.data == 'administrador' ){
    location.href = "admin/index"
  }else if(res.data.data == 'Usuario' || res.data.data == 'Usuario'){
    location.href = "user/index"
  }
    
  
  } catch (err) {
 
    let message =err || "Ocurrio un error";
   
  alert(`Error: ${message}`);
  }
} 


d.addEventListener("submit", async  (e) => {
 
 if(e.target === $form )
  e.preventDefault();
   createFile(e);
});


 d.addEventListener("click", (e) => {

  if(e.target.matches('.login')){
    validateToken()
 }
}); 