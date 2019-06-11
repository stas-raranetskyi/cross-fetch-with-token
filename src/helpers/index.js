
export const makeURIParams = (query) => {
    return Object.keys(query).map(key => key + '=' + query[key]).join('&');
}
