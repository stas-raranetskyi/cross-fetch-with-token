const fetch = require('cross-fetch');
const tokenService = require('./token');
const { isTokenExpire } = require('../helpers');
const queueRequests = [];
var busy = false;
var tokenTry = 0;

module.exports = async function fetchWithToken(url, options = {}){
    let fetchWithTokenResolve, fetchWithTokenReject;
    const requestPromise = new Promise((resolve, reject) => {
        fetchWithTokenResolve = resolve;
        fetchWithTokenReject = reject;
    });

    const requestFn = () => {
        let token = tokenService.get();
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
        };

        fetch(url, options).then(async response => {
            try {
                fetchWithTokenResolve(response);
            }
            catch (err) {
                fetchWithTokenReject(err);
            }
        }).catch((err) => {
            fetchWithTokenReject(err);
        });
    };

    let token = tokenService.get();

    if(isTokenExpire(token)) {
        token = null;
    }

    if(!token || busy){
        busy = true;
        queueRequests.push(requestFn);
        if(!token && !tokenTry) {
            tokenTry++;
            token = await tokenService.update();
            busy = false;
            tokenTry = 0;
            executeQueue();
        }
    }
    else{
        requestFn();
    }

    return requestPromise;
}
