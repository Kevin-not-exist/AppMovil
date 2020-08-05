$(document).ready(function(){      
    $("#btn_enviar").click(function(){

        const usuario = $("#txt_usuario").val();
        const pass = $("#txt_pass").val();
        const email = $("#txt_email").val();
        const telefono = $("#txt_telefono").val();
        const direccion = $("#txt_direccion").val();
        const nombre = $("#txt_nombre").val();
        const apellido = $("#txt_apellido").val();
        const sexo = $("#select_sexo").val();

        try{
            /*Validar si estan vacios*/
            if(!usuario || !pass || !email || !telefono || !direccion || !nombre || !apellido || !sexo){
                throw "Debe completar todos los campos!";
            }
        const url = `http://api.marcelocaiafa.com/usuario`;
        $.ajax({
            data:JSON.stringify(
                {
                "nombre":nombre,
                "apellido":apellido,
                "email":email,
                "password":pass,
                "sexo":sexo,
               }),

            url:url,
            type:"POST",
            dataType:"jsonp",
            success:function(respuesta){
                ons.notification.toast("El usuario se registro correctamente", {"timeout":3000});
            },
            error:function(respuesta_error, status, error){
                ons.notification.toast(respuesta_error.responseJSON.descripcion, {"timeout":3000});
            }
        })
        }
        catch(e){
            ons.notification.toast(e, {"timeout":3000});
        }
    })
})