
import { openModal } from "./modals.js";
import {getRutas} from '../js/getRutas.js'
import searchFilter from "./filters.js";
import { agregarToast } from "./toast.js";


const d = document;
const $rol = d.querySelector(".rol-header");
let $token,
 total = d.querySelector('.span-total').textContent,
 abiertas = d.querySelector('.span-abiertas').textContent,
 cerradas = d.querySelector('.span-cerradas').textContent;

d.querySelector('.total').textContent = parseInt(total);
d.querySelector('.p-abiertas').textContent = parseInt(abiertas);
d.querySelector('.p-cerradas').textContent = parseInt(cerradas);
d.querySelector('.efecty').textContent = `${parseFloat(abiertas*100/total).toFixed(1)}%`;

d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
  getRutas(parseInt(total), parseInt(abiertas),parseInt(cerradas));
  searchFilter(".filter-data",".tr-filter");
});

async function validateToken() {
  $token = sessionStorage.getItem("tok");
  try {
    console.log("ingreso");
    let options = {
      method: "GET",
      headers: {
        Autorizathion: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };

    let res = await axios(`/solicitudes/veryfy`, options);
    console.log(res.data.rol)
    $rol.textContent = res.data.rol
    if (res.data.status === 403) {
      location.href = '/403'
     }
     
  } catch (error) {
    res.status(error?.status || 500);
    res.send({ status: "FAILED", data: { error: error?.message || error } });
  }

   validateDate('.fechaS')
    validateDate('.fechaC')
}



export async function updateSolicitud(id, estado,fecha_cierre) {
  try {
    let options = {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
      data: JSON.stringify({
        fecha_cierre,
        estado,
      }),
    };
    let res = await axios(`/solicitudes/${id}`, options),
      json = await res.data;

      agregarToast({tipo:'exito', titulo:'Excelente', descripcion:"Acualización exitosa", autocierre:false})
         setTimeout(() => {
            location.reload()
          },3000);

  } catch (err) {
    agregarToast({tipo:'error',titulo:'Error!', descripcion:"Ah ocurrido algun error ", autocierre:true})
  }
}




export async function deleteSolicitud(id) {
  let isDelete = confirm(` ¿Estás seguro de eliminar este registro?`);
  if (isDelete) {
    try {
      let options = {
        method: "DELETE",
        headers: { "Content-type": "application/json; charset=utf-8" },
      };
      let res = await axios(`/solicitudes/${id}`,options),
        json = await res.data;
        agregarToast({tipo:'info',titulo:'Muy bien!', descripcion:"Solicitud eliminada con exito", autocierre:true})
          setTimeout(() => {
            location.reload()
          }, 5000);
    } catch (err) {
      let message = err.statusText || "Ocurrio un error";
      agregarToast({tipo:'warning',titulo:'Algo ah salido mal!', descripcion:`Error ${err.status}: ${message}`, autocierre:true})
    }
  }
}


function validateDate(input){

  const $date = document.querySelectorAll(input);

  $date.forEach(element => {
    let date = element.textContent;
    const fecha = new Date(date)

    console.log(fecha)

    if(fecha == 'Invalid Date'){
      element.textContent =' N/A';
      return
    } 
    element.textContent = `${fecha.toLocaleDateString()}`;
  });

}


const date =  new Date();
const dateTime = `${date.getFullYear()}-${ date.getMonth()}-${date.getDay()}`


d.addEventListener('click', (e)=>{
  if(e.target.matches('.btn-cerrar')){
   
    updateSolicitud(e.target.dataset.id , 0, dateTime)
  }

  if(e.target.matches('.btn-abrir')){
    updateSolicitud(e.target.dataset.id, 1, dateTime)
  }

  if(e.target.matches('.delete')){
    deleteSolicitud(e.target.dataset.id)
  }
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    document.querySelector('.notification').classList.toggle('hidden-notification');
  }
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }

})