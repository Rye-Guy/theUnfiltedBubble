//little thing I like on the site is a greeting message with username displayed in the nav bar. Tacky but oh god do I ever love it.
const usernameContainer = document.getElementById('usernameNavDisplay');
//get the user name from our relevant route. This files is saved to our main layout so we will have access to this all across our application. 
fetch('/getUser').then(function (response) {
    return response.json();
}).then(function (username) {
    //set the text in our container to the username. 
    usernameContainer.innerText = username
    //crate a cookie with the username is stored. Used to attach various actions to users across our application. IE. comments and shares. 
    docCookies.setItem('username', username);
});
//Cookie Framework from MDN 
const docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    /*
                    Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                    version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                    the end parameter might not work as expected. A possible solution might be to convert the the
                    relative time to an absolute time. For instance, replacing the previous line with:
                    */
                    /*
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    */
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    }

}