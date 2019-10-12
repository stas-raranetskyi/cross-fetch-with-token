"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const helpers_1 = require("../helpers");
const cookie_1 = require("../helpers/cookie");
const settings_1 = __importDefault(require("../settings"));
let doc = {
    cookie: '',
};
if (typeof document !== 'undefined') {
    doc = document;
}
class Token {
    constructor(docum) {
        this.document = docum;
        this.token = this.getTokenFromStorage();
    }
    static getInstance() {
        if (!Token.instance) {
            Token.instance = new Token(doc);
        }
        return Token.instance;
    }
    get() {
        return this.token;
    }
    getTokenFromStorage() {
        try {
            return cookie_1.getCookie(settings_1.default.storeKeyToken, this.document);
        }
        catch (_a) {
            return null;
        }
    }
    setTokenToStorage(token) {
        try {
            this.set(token);
            const expires = settings_1.default.expiresToken;
            cookie_1.setCookie(settings_1.default.storeKeyToken, token, this.document, {
                expires,
                path: '/',
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    removeTokenFromStorage() {
        try {
            this.token = null;
            cookie_1.deleteCookie(settings_1.default.storeKeyToken, this.document);
        }
        catch (err) {
            console.log(err);
        }
    }
    set(token) {
        this.token = token;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryURI = helpers_1.makeURIParams(settings_1.default.clientData);
            const urlToken = settings_1.default.urlToken + `${queryURI.length ? '?' : ''}${queryURI}`;
            return new Promise((resolve, reject) => {
                cross_fetch_1.default(urlToken).then((response) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const data = yield response.text();
                        const dataJSON = JSON.parse(data);
                        const { access_token } = dataJSON;
                        this.setTokenToStorage(access_token);
                        resolve(access_token);
                    }
                    catch (error) {
                        reject(null);
                    }
                }));
            });
        });
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map