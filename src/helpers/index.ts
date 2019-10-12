import jwtDecode from 'jwt-decode';
export const makeURIParams = (query) => {
    return Object.keys(query).map((key) => key + '=' + query[key]).join('&');
};

export const isTokenExpire = (token) => {
    if (!token) { return true; }
    try {
        const jwtDecoded = jwtDecode(token);
        const now = Date.now();
        const expire = jwtDecoded.exp * 1000;
        if (now - expire > 0) {
            return true;
        }
        return false;
    } catch (err) {
        return true;
    }
};
