$(document).ready(function(){
    
    $("#btn_registro").on("click", function(){
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
            let exp = /^[0-9]{7,8}$/g;
            let expEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\w+\.[a-zA-Z]+/g;
            if(!exp.test(documento)){
                throw "El documento debe estar sin puntos ni guiones."
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
                    const nav = document.getElementById("nav");
                    nav.pushPage("t_info_medico");
                },
                error:function(respuesta_error, err, status){
                    console.log(err);
                    console.log(status);
                    ons.notification.toast(respuesta_error.responseJSON.error, {"timeout":3000});
                }
            });
        }
        catch(e){
            ons.notification.toast(e, {"timeout":3000});
        }
    });
});