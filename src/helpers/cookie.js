export function getCookie(name, document) {
    /*eslint-disable no-useless-escape*/
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
}

export function setCookie(name, value, document, options = {}) {
    let expires = options.expires;

    if (typeof expires === 'number' && expires) {
        const d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (const propName in options) {
        updatedCookie += '; ' + propName;
        const propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }

    if(typeof document !== 'undefined' && document){
        document.cookie = updatedCookie;
    }
    else{
        return updatedCookie;
    }
}

export function deleteCookie(name) {
    setCookie(name, '', {
        expires: -1
    });
}
