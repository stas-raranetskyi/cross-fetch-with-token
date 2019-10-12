import fetch from 'cross-fetch';
import { makeURIParams } from '../helpers';
import { deleteCookie, getCookie, setCookie  } from '../helpers/cookie';
import settings from '../settings';

let doc = {
    cookie: '',
};

if (typeof document !== 'undefined') {
    doc = document;
}

export class Token {

    public static getInstance() {
        if (!Token.instance) {
            Token.instance = new Token(doc);
        }
        return Token.instance;
    }

    private static instance: Token;
    private document: any;
    private token: any;

    private constructor(docum: any) {
        this.document = docum;
        this.token = this.getTokenFromStorage();
    }

    public get() {
        return this.token;
    }

    public getTokenFromStorage() {
        try {
            return getCookie(settings.storeKeyToken, this.document);
        } catch {
            return null;
        }
    }

    public setTokenToStorage(token: string) {
        try {
            this.set(token);
            const expires = settings.expiresToken;
            setCookie(settings.storeKeyToken, token, this.document, {
                expires,
                path: '/',
            });
        } catch (err) {
            console.log(err);
        }
    }

    public removeTokenFromStorage() {
        try {
            this.token = null;
            deleteCookie(settings.storeKeyToken, this.document);
        } catch (err) {
            console.log(err);
        }
    }

    public set(token) {
        this.token = token;
    }

    public async update() {
        const queryURI = makeURIParams(settings.clientData);
        const urlToken = settings.urlToken + `${queryURI.length ? '?' : ''}${queryURI}`;
        return new Promise((resolve, reject) => {
            fetch(urlToken).then(async (response) => {
                try {
                    const data = await response.text();
                    const dataJSON = JSON.parse(data);
                    const {access_token} = dataJSON;
                    this.setTokenToStorage(access_token);
                    resolve(access_token);
                } catch (error) {
                    reject(null);
                }
            });
        });
    }
}
