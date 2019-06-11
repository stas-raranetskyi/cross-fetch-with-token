import { makeURIParams } from '../helpers';
import { getCookie, setCookie, deleteCookie } from '../helpers/cookie';
import settings from '../settings';
import fetch from 'cross-fetch';

let doc = {
    cookie: ''
};

if(typeof document !== 'undefined'){
    doc = document;
}

class Token{
    constructor(document){
        if(this.__proto__.instance) {
            return this.__proto__.instance;
        }
        this.document = document;
        this.storageKey = `${settings.localStorePrefix}.token`;
        this.token = this.getTokenFromStorage();
        this.__proto__.instance = this;
    }

    getTokenFromStorage(){
        try{
            return getCookie(this.storageKey, this.document);
        }
        catch{
            return null;
        }
    }

    setTokenToStorage(token){
        try{
            this.set(token);
            const expires = settings.expiresToken;
            setCookie(this.storageKey, token, this.document, {
                expires,
                path: '/'
            });
        }
        catch(err){
            console.log(err);
        }
    }

    removeTokenFromStorage(){
        try{
            this.token = null;
            deleteCookie(this.storageKey, this.document);
        }
        catch(err){
            console.log(err);
        }
    }

    get(){
        return this.token;
    }

    set(token){
        this.token = token;
    }

    async update(){
        const queryURI = makeURIParams(settings.clientData);
        const urlToken = settings.urlToken + `${queryURI.length ? '?' : ''}${queryURI}`
        return new Promise((resolve, reject) => {
            fetch(urlToken).then(async response => {
                try {
                    const data = await response.text();
                    const dataJSON = JSON.parse(data);
                    const {access_token} = dataJSON;
                    this.setTokenToStorage(access_token)
                    resolve(access_token);
                } catch (error) {
                    reject(null);
                }
            });
        });
    }
}

export default new Token(doc);
