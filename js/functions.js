window.fn = {};

window.fn.open = function(){
    const menu = document.getElementById("menu");
    menu.open();
}

window.fn.load = function(template, page, params) {
    const menu = document.getElementById("menu");
    menu.close();
    const nav = document.getElementById("nav");
    for(i=0; i<nav.pages.length; i++){
        if(nav.pages[i]["id"] == page){
            nav.bringPageTop(i,params);
            return;
        }
    }
    nav.pushPage(template, params);
};

function login(email, pwd, tipo){
    $.ajax({
        url: "https://ort-api.herokuapp.com/usuarios/login",
        type:"POST",
        dataType:"json",
        data:JSON.stringify(
            {
                "email": email,
                "contrasenia": pwd,
                "tipo": tipo
            }
        ),
        contentType: 'application/json; charset=utf-8',
        success:function(respuesta){
            $.ajaxSetup({
                headers:{
                    token:respuesta.token
                }
             });
            let usuario = respuesta.usuario;
            usuario     = JSON.stringify(usuario);
            sessionStorage.setItem("usuario", usuario);
            ons.notification.toast("El usuario se registro correctamente", {"timeout":3000});
            //redireccionar a listado de locales.
            fn.load("t_especialidades_disponibles", "p_especialidades_disponibles");
        },
        error:function(respuesta_error, err, status){
            console.log(err);
            console.log(status);
            ons.notification.toast(respuesta_error.responseText, {"timeout":3000});
        }
    });
}

$(document).ready(function(){

    $(document).on("click","#btn_logout",function(){
        // eliminar sesion
        sessionStorage.clear();
        // eliminar local storage
        localStorage.clear();
        ons.notification.toast('Sesi&oacute;n ha finalizado correctamente', {timeout:3000});
        fn.load('t_login','p_login');
    });
    
    //Registro
    $(document).on("click", "#btn_registro", function(){
        const nombre    = $("#nombre").val();
        const apellido  = $("#apellido").val();
        const email     = $("#email").val();
        const pwd       = $("#pwd").val();
        const repwd     = $("#repwd").val();
        const genero    = $("#genero").val();
        const documento = $("#documento").val();
        const telefono  = $("#telefono").val();
        const url       = "https://ort-api.herokuapp.com/usuarios/registro";

        try{
            if(!email || !nombre || !apellido || !pwd || !repwd || !genero || !documento || !telefono){
                throw "Debe completar todos los campos para continuar."
            }
            if(pwd != repwd){
                throw "Las contraseñas no coinciden."
            }
            let exp = /\d+/g;
            let expEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\w+\.[a-zA-Z]+/g;
            if(!exp.test(documento)){
                throw "El documento debe estar sin puntos ni guiones (7-8 digitos)."
            }
            if(!expEmail.test(email)){
                throw "Formato E-mail incorrecto."
            }
            $.ajax({
                url:url,
                type:"POST",
                dataType:"json",
                data:JSON.stringify(
                    {
                        "telefono": telefono,
                        "email": email,
                        "contrasenia": pwd,
                        "genero": genero,
                        "apellido": apellido,
                        "nombre": nombre,
                        "documento": documento
                    }
                ),
                contentType: 'application/json; charset=utf-8',
                success:function(respuesta){
                    $.ajaxSetup({
                        headers:{
                            token:respuesta.token
                        }
                     });
                    let usuario = respuesta.usuario;
                    usuario     = JSON.stringify(usuario);
                    sessionStorage.setItem("usuario", usuario);
                    ons.notification.toast("El usuario se registro correctamente", {"timeout":3000});
                    fn.load("t_especialidades_disponibles","p_especialidades_disponibles");
                },
                error:function(respuesta_error, err, status){
                    console.log(err);
                    console.log(status);
                    ons.notification.toast(respuesta_error.responseText, {"timeout":3000});
                }
            });
        }
        catch(e){
            ons.notification.toast(e, {"timeout":3000});
        }
    });

    function createAlertDialog(){
        var dialog = document.getElementById('my-alert-dialog');

        if (dialog) {
            dialog.show();
          } else {
            ons.createElement('alert-dialog.html', { append: true })
              .then(function(dialog) {
                dialog.show();
              });
          }
    }

    //Reserva médica
    $(document).on("click", "#btn_enviar_reserva_medica", function(){
        const fecha   = $("#fecha_reserva_medica").val();
        const hora    = $("#hora_reserva_medica").val();
        const medico  = $("#medico_reserva_medica").val();
        const fechaReserva = fecha+" "+hora;
        const url     = "https://ort-api.herokuapp.com/reservas/";

        try{
            if(!fecha){
                throw "Completar fecha para continuar."
            }
            if(!hora){
                throw "Completar hora para continuar."
            }
            if(!medico){
                throw "Completar médico para continuar."
            }
            $.ajax({
                url:url,
                type:"POST",
                dataType:"json",
                data:JSON.stringify(
                    {
                        "fecha": fechaReserva,
                        "medico": medico,
                    }
                ),
                contentType: 'application/json; charset=utf-8',
                success:function(respuesta){
                    $.ajaxSetup({
                        headers:{
                            token:respuesta.token
                        }
                     });
                    ons.notification.toast("Reserva médica enviada!", {"timeout":3000});
                },
                error:function(respuesta_error, err, status){
                    console.log(err);
                    console.log(status);
                    ons.notification.toast(respuesta_error.responseText, {"timeout":3000});
                }
            });
        }
        catch(e){
            ons.notification.toast(e, {"timeout":3000});
        }
    });
});