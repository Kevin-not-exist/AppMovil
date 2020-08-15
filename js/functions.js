$.ajaxSetup({
    "headers":{
        "Content-Type": "application/json"
    },
});

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
                "headers":{
                    "Authorization":`Bearer ${respuesta.token}`
                }
             });

            let usuario = respuesta.usuario;
            usuario     = JSON.stringify(usuario);
            sessionStorage.setItem("usuario", usuario);
            ons.notification.toast("El usuario ingreso correctamente", {"timeout":3000});
            //redireccionar si es usuario
            if(tipo == "U"){
                fn.load("t_especialidades_disponibles", "p_especialidades_disponibles");
            }
            //redireccionar si es médico
            if(tipo == "M"){
                fn.load("t_historial_consultas", "p_historial_consultas");
            }
        },
        error:function(respuesta_error, err, status){
            console.log(err);
            console.log(status);
            ons.notification.toast(respuesta_error.responseText, {"timeout":3000});
        }
    });
}

$(document).ready(function(){

    $(document).on("click","#btn_logout",function(e){
        e.stopImmediatePropagation();
        // eliminar sesion
        sessionStorage.clear();
        // eliminar local storage
        localStorage.clear();
        ons.notification.toast('Sesi&oacute;n ha finalizado correctamente', {timeout:3000});
        fn.load('t_login','p_login');
    });

    //Lista medicos favoritos
    let lista_medico_fav = new Array();
    
    //Registro
    $(document).on("click", "#btn_registro", function(e){
        e.stopImmediatePropagation();
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
                        "headers":{
                            "Authorization":`Bearer ${respuesta.token}`
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

     $(document).on("click", "#btn_salir_reserva_medica", function(e){
        e.stopImmediatePropagation();
        document
        .getElementById('my-alert-dialog')
        .hide();
    });


    //Reserva médica
    $(document).on("click", "#btn_enviar_reserva_medica", function(e){
        e.stopImmediatePropagation();
        const fecha   = $("#fecha_reserva_medica").val();
        const hora    = $("#hora_reserva_medica").val();
        const medico  = $("#id_medico_reserva").val();
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
                //contentType: 'application/json; charset=utf-8',
                success:function(respuesta){
                    $.ajaxSetup({
                        "headers":{
                            "Authorization":`Bearer ${respuesta.token}`
                        }
                     });
                    ons.notification.toast("Reserva médica enviada!", {"timeout":3000});
                    document
                    .getElementById('my-alert-dialog')
                    .hide();
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

    //Médico favorito
    $(document).on("click", "#btn_agregar_medico_fav", function(e){
        e.stopImmediatePropagation();
        const id_medico = $("#id_medico_reserva").val();
        const url = `https://ort-api.herokuapp.com/medicos/${id_medico}`;

        $.ajax({
            url: url,
            data: "GET",
            dataType: "json",
            success:function(medico){
                let medico_fav = medico._id;
                lista_medico_fav.push(medico_fav);
                localStorage.setItem('lista_medicos_fav', JSON.stringify(lista_medico_fav));
                ons.notification.toast("Médico agregado correctamente!", {"timeout":3000});
            },
            error:function (xml_request, err, status) {
                ons.notification.toast(xml_request.responseJSON.descripcion, {"timeout": 3000});
            }

        })
    });

    $(document).on("click", "#btn_ventana_comentario", function(e){
        e.stopImmediatePropagation();
        fn.load("t_punt_usuario","p_punt_usuario");
    });

    $(document).on("click", "#btn_enviar_comentario", function(e){
        e.stopImmediatePropagation();
        const id_medico  = $("#id_medico_reserva").val();
        const comentario = $("#txt_comentario_medico").val();
        const puntaje    = $("#selec_puntuacion_medico").val();
        const url        = `https://ort-api.herokuapp.com/medicos/${id_medico}/comentarios`;

        try{
            if(!comentario){
                throw "Completar comentario para continuar."
            }
            if(!puntaje){
                throw "Completar puntaje para continuar."
            }
            $.ajax({
                url:url,
                type:"POST",
                dataType:"json",
                data:JSON.stringify(
                    {
                        "comentario":comentario,
                        "puntuacion":puntaje
                    }
                ),
                success:function(respuesta){
                    $("#txt_comentario_medico").val("");
                    $("#selec_puntuacion_medico").val("");
                    ons.notification.toast("Comentario enviado correctamente!", {"timeout":3000});
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