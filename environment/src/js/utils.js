import $ from 'jquery';
import 'jquery-validation';

window.jQuery = $;
require("@fancyapps/fancybox");

const getScrollVisibility = (element, delta) => {
    let position = element.offset(),
        scroll = $(window).scrollTop(),
        height = $(window).height();
    return (position.top + delta < scroll + height) ? true : false;
};

const scrollToAnchor = (query, speed = 500) => {
    $(query).click(function () {
        const anchor = $(this).attr("href").split("#")[1];
        if (anchor) {
            const tmp = $("#" + anchor).position();
            $("html, body").animate({ scrollTop: tmp.top - 100 }, speed);
        }
    });
};

const openPopup = query => {
    $(query).click(function () {
        var target = "#" + $(this).attr("data-popup");
        $.fancybox.open([
            {
                src: target,
                type: "inline",
                closeExisting: true,
                smallBtn: false,
                toolbar: false,

                afterClose: function () {
                    lockScroll();
                }
            }
        ]);
        lockScroll();
    });
};

const setCookie = (name, value, expY, expM, expD, expH, expMin, domain, secure = false, path = false) => {
    let cookieString = `${name}=${escape(value)}`;

    if (expY) {
        const expires = new Date(expY, expM, expD, expH, expMin);
        cookieString += `; expires=${expires.toGMTString()}`;
    }

    if (domain)
        cookieString += `; domain=${escape(domain)}`;

    if (secure) {
        cookieString += '; secure';
    }

    if (path) cookieString += `; path=${escape(path)}`;

    document.cookie = cookieString;
};

const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

const deleteCookie = name => {
    if (!getCookie(name)) return;

    setCookie(name, "", 1970, 1, 1, 0, 0);
};

const processAjaxForm = (formId, action, refresh = true) => {

    const rules = {
        rules: {
            user_name: {
                minlength: 3
            },
            user_tel: {
                number: true
            }
        },
        messages: {
            user_name: {
                minlength: "Name should be longer than {0}"
            }
        }
    };

    $(`#${formId}`).validate(rules);

    $(`#${formId}`).submit(function (e) {
        e.preventDefault();
        if (!$(`#${formId}`).valid()) return;

        let formdata = $(`#${formId}`).serialize();
        formdata += `&action=${action}&nonce_code=${myajax.nonce}`;
        $.ajax({
            url: myajax.url,
            data: formdata,
            type: "POST",
            success: function (response) {
                console.log('response', response);
                const data = $.parseJSON(response);
                if (data.status == 1) {
                    $(`#${formId} .error-message .subtitle-s1`).text('');
                    if (refresh) window.location.reload();
                    successAction(formId);
                } else {
                    const errorMessage = getErrorMessage(data.error);
                    $(`#${formId} .error-message .subtitle-s1`).text(errorMessage);
                }
            }
        });
    });
};


const processAjaxBuy = data => {
    $.ajax({
        url: myajax.url,
        data: data,
        type: "POST",
        success: function (response) {
            console.log('response', response);
            const data = $.parseJSON(response);
            if (data.status) {
                if (data.type == 'devs') {
                    window.location.href = data.url;
                }
                else
                    window.location.href = data.url;
            }
            else {
                console.log(getErrorMessage(data.error));
            }
        }
    });
};

function successAction(form) {
    switch (form) {
        case 'reset-pwd-form':
            $('.profile-content .message-wraper .message').text('You have successfully changed your password');
            $('.profile-content .two-columns-form, .profile-content .title').hide(200);
            $('.profile-content .message-wraper').show(200);
            break;
        case 'lostpasswordform':
            const $descr = 'If you don’t see this e-mail in your inbox within 15 minutes, look for it in your spam mail folder. If you find it there, please mark it as “Not Spam”.';
            $('.lostpassword .success-message .message').html('Password recovery<br>e-mail sent to');
            $('.lostpassword .success-message').append(`<p>${$descr}</p>`);
            $('.lostpassword .success-message .subtitle-s1').text($('#user_email').val());
            $('#recover').hide(200);
            $('.lostpassword .success-message').show(200);
            break;
        case 'newpasswordform':
            $('.newpassword .success-message .message').text('Your password has been reset.');
            $('#newpassword').hide(200);
            $('.newpassword .success-message').show(200);
            break;
        default: return false;
    }
}

const getErrorMessage = errorCode => {
    switch (errorCode) {
        case 1: return 'Terms are not confirmed';
        case 2: return 'Fill all necessary fields';
        case 3: return 'Invalid E-mail or password';
        case 4: return 'Registration error';
        case 5: return 'Update profile error';
        case 6: return 'New passwords are not equal';
        case 7: return 'Wrong password';
        case 8: return 'No user with that email found';
        case 9: return 'Validation Error';
        case 10: return 'No products found in cart';
        case 11: return 'Incorrect data';
        case 12: return 'Already subscribed';
        case 13: return 'Unsubscribe failed';
    }
};

function lockScroll() {
    if ($("html").hasClass("lock")) $("html").removeClass("lock");
    else $("html").addClass("lock");
}

export {
    getScrollVisibility,
    scrollToAnchor,
    openPopup,
    getErrorMessage,
    processAjaxForm,
    processAjaxBuy,
    setCookie,
    getCookie,
    deleteCookie
};