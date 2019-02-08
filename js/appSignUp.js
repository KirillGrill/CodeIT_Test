jQuery(function($) {
    var form = $('#register');
    form.on('submit', function(event) {
        event.preventDefault();
        if ( validateForm() ) {
            return false;
        }

        $.ajax({
            url: form.attr('action'),
            method: form.attr('method'),
            data: form.serialize(),
            success: function (data) {

                if(data.status === "Error") {
                    if(data.message === "Creating user error. Email already exists.") {
                        const email = $("#email");
                        email.after('<span class="text-error for-email">E-mail already exists</span>');
                        $(".for-email").css({top: 143 + 72 + 72, left: 50});
                        email.addClass('error');
                    }
                    if(data.message === "Wrong route") {
                        alert('Sorry :( Site Error. We are working on it.');
                    }
                }

                if(data.status === "OK") {
                    window.location.replace("companiesPage.html");
                }

                var str = JSON.stringify(data);
                console.log(data);

            }

        });
    });



    function validateForm() {
        $(".text-error").remove();

        // Проверка имени
        var reg0 = /^[a-zA-Z]+$/;
        const name = $("#name");
        var v_name = true;
        if ( name.val().length < 4 || name.val().length > 60 ) {
            v_name = true;
            name.after('<span class="text-error for-name">Field name should contain from 3 to 60 letters</span>');
           $(".for-name").css({top: 143, left: 50});
            name.addClass('error');
        } else {
            v_name = false;
            name.removeClass('error');
        }

        if(!v_name && !reg0.test( name.val() )){
            v_name = true;
            name.after('<span class="text-error for-name">Field name should contain only Roman alphabet</span>');
            $(".for-name").css({top: 143, left: 50});
            name.addClass('error');
        }

        //проверка фамилии
        const secondname = $("#secondname");
        var v_secondname = true;
        if ( secondname.val().length < 4 || secondname.val().length > 60 ) {
            v_secondname = true;
            secondname.after('<span class="text-error for-secondname">Field secondname should contain from 3 to 60 letters</span>');
            $(".for-secondname").css({top: 143 + 72, left: 50});
            secondname.addClass('error');
        } else {
            v_secondname = false;
            secondname.removeClass('error');
        }

        if(!v_secondname && !reg0.test( secondname.val() )){
            v_secondname = true;
            secondname.after('<span class="text-error for-secondname">Field secondname should contain only Roman alphabet</span>');
            $(".for-secondname").css({top: 143 + 72, left: 50});
            secondname.addClass('error');
        }

        //проверка email
        const reg = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i;
        const email = $("#email");
        var v_email = true;
        if(!email.val()){
            v_email = true;
            email.after('<span class="text-error for-email">Field E-mail is required</span>');
            $(".for-email").css({top: 143 + 72 + 72, left: 50});
            email.addClass('error');
        }else{
            v_email = false;
            email.removeClass('error');
        }

        if (!v_email && !reg.test( email.val() ) ) {
            v_email = true;
            email.after('<span class="text-error for-email">E-mail is not valid</span>');
            $(".for-email").css({top: 143 + 72 + 72, left: 50});
            email.addClass('error');
        }

        //проверка пола
        const gender = $("#gender");
        var v_gender = true;
        if(!gender.val()) {
            v_gender = true;
            gender.after('<span class="text-error for-gender">Field gender is required</span>');
            $(".for-gender").css({top: 143 + 72 + 72 + 72, left: 50});
            gender.addClass('error');
        } else {
            v_gender = false;
            gender.removeClass('error');
        }

        //проверка пароля
        const password = $("#password");
        var v_password = true;
        if(!password.val() ) {
            v_password = true;
            password.after('<span class="text-error for-password">Field password is required</span>');
            $(".for-password").css({top: 143 + 72 + 72 + 72 + 72, left: 50});
            password.addClass('error');
        } else {
            v_password = false;
            password.removeClass('error');
        }

        if(!v_password && password.val().length < 6 || password.val().length > 60 ) {
            v_password = true;
            password.after('<span class="text-error for-password">Field password should contain from 6 to 60 characters</span>');
            $(".for-password").css({top: 143 + 72 + 72 + 72 + 72, left: 50});
            password.addClass('error');
        }

        //проверка соглашения
        const agreement = $("#agreement");
        var v_agreement = true;
        if(!agreement.is(':checked')) {
            v_agreement = true;
            $("#agreement-text").addClass('error');
        } else {
            v_agreement = false;
            $("#agreement-text").removeClass('error');
        }

        return ( v_name || v_secondname || v_email || v_gender || v_password) || v_agreement;
    }

});
