$(document).ready(function(){      
    $("#btn_registro").click(function(){

        const documento = $("#txt_documento").val();
        const pass = $("#txt_pass").val();
        const passRepeat = $("#txt_pass_repeat").val();
        const email = $("#txt_email").val();
        const telefono = $("#txt_telefono").val();
        const direccion = $("#txt_direccion").val();
        const nombre = $("#txt_nombre").val();
        const apellido = $("#txt_apellido").val();
        const genero = $("#select_genero").val();

        try{
            /*Validar si estan vacios*/
            if(!documento || !pass || !email || !telefono || !direccion || !nombre || !apellido || !genero || !passRepeat){
                throw "Debe completar todos los campos!";
            }
            if(pass != passRepeat){
                throw "Las contraseñas no coinciden.";
            }
            if(isNaN(documento)){
                throw "Formato documento incorrecto.";
            }
            let exp = /(-)*(\.)*/;
            let expEmail = /[@]*(com)*/;
            if(exp.test(documento)){
                throw "El documento debe estar sin puntos ni guiones."
            }
            if(expEmail.test(email)){
                throw "Formato E-mail incorrecto."
            }
            const url = `https://ort-api.herokuapp.com/usuarios/registro`;
            $.ajax({
                data:JSON.stringify(
                    {
                    "telefono": telefono,
                    "email":email,
                    "contrasenia":pass,
                    "genero":genero,
                    "apellido":apellido,
                    "nombre":nombre,
                    "documento":documento
                }),

                url:url,
                type:"POST",
                dataType:"json",
                success:function(respuesta){
                    $.ajaxSetup({
                        headers:{
                            token:respuesta.token
                        }
                    })
                    let usuario = respuesta.descripcion;
                    usuario = JSON.stringify(usuario);
                    sessionStorage.setItem("usuario", usuario);
                    ons.notification.toast("El usuario se registro correctamente", {"timeout":30000});
                    const nav = document.getElementById("nav");
                    nav.pushPage("t_info_medico");
                },
                error:function(respuesta_error, error, status){
                    ons.notification.toast(respuesta_error.responseJSON.descripcion, {"timeout":30000});
                }
            });
        }
        catch(e){
            ons.notification.toast(e, {"timeout":30000});
        }
    })

    /*
    $("#btn_no_registrado").click(function(){
        const nav = document.getElementById("nav");
        nav.pushPage("t_registro");
    })

    $("#btn_login").click(function(){
        const email = $("#txt_email_login").val();
        const pass = $("#txt_pass_login").val();
        const tipo = $("#select_personal").val();

        const nav = document.getElementById("nav");
        nav.pushPage("t_info_medico");
    })*/

})