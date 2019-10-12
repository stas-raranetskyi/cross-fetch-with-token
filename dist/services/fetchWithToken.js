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
const token_1 = require("./token");
const tokenService = token_1.Token.getInstance();
const queueRequests = [];
let busy = false;
let tokenTry = 0;
function executeQueue() {
    queueRequests.map((req) => req());
}
function fetchWithToken(url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let fetchWithTokenResolve;
        let fetchWithTokenReject;
        const requestPromise = new Promise((resolve, reject) => {
            fetchWithTokenResolve = resolve;
            fetchWithTokenReject = reject;
        });
        const requestFn = () => {
            const token = tokenService.get();
            const opts = Object.assign(Object.assign({}, options), { 'Accept': 'application/vnd.api+json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/vnd.api+json' });
            cross_fetch_1.default(url, opts).then((response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    fetchWithTokenResolve(response);
                }
                catch (err) {
                    fetchWithTokenReject(err);
                }
            })).catch((err) => {
                fetchWithTokenReject(err);
            });
        };
        let token = tokenService.get();
        if (helpers_1.isTokenExpire(token)) {
            token = null;
        }
        if (!token || busy) {
            busy = true;
            queueRequests.push(requestFn);
            if (!token && !tokenTry) {
                tokenTry++;
                token = yield tokenService.update();
                busy = false;
                tokenTry = 0;
                executeQueue();
            }
        }
        else {
            requestFn();
        }
        return requestPromise;
    });
}
exports.default = fetchWithToken;
//# sourceMappingURL=fetchWithToken.js.map