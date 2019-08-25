const jwtDecode = require('jwt-decode');
module.exports.makeURIParams = (query) => {
    return Object.keys(query).map(key => key + '=' + query[key]).join('&');
}

module.exports.isTokenExpire = (token) => {
    if(!token) return true;
    try{
        const jwtDecoded = jwtDecode(token);
        const now = Date.now();
        const expire = jwtDecoded.exp * 1000;
        if(now - expire > 0){
            return true;
        }
        return false;
    }
    catch(err){
        return true;
    }
};
