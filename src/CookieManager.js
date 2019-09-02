class CookieManager {
    setCookie(name, value, days=365) {
        // construct date object - will be today's date by default
        let date = new Date();
        // set time to be today plus how many days specified
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        // concatenate the expires name/value pair with expiry date converted to GMT 
        let expires = "expires=" + date.toGMTString();
        // assemble cookie
        document.cookie = name + "=" + value + ";" + expires + ";";
    }
    
    getCookie(name) {
        // return undefined if no cookie stored
        if (document.cookie === "") return undefined;    
    
        // value to be returned is undefined by default
        let value;
        // put cookie name/value pairs into an array split on the ; delimiter (since there could be multiple cookies in the file)
        let cookieArray = document.cookie.split(";");
    
        // APPROACH III - find() with arrow function
        // shorthand for inner annonymous function and return
        let cookie = cookieArray.find(cookie => cookie.split("=")[0].trim() == name);
        if (cookie == undefined) return undefined;
        value = cookie.split("=")[1].trim();
    
        return value;
    }  
}

let cookieManager = new CookieManager();

export {cookieManager};

/*
    Changes made for not using Babel
    -- Declared a new CookieManager object in this file
*/
