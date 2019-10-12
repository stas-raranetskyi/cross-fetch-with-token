import fetch from 'cross-fetch';
import { isTokenExpire } from '../helpers';
import { Token } from './token';
const tokenService = Token.getInstance();
const queueRequests = [];
let busy = false;
let tokenTry = 0;

function executeQueue() {
    queueRequests.map((req) => req());
}

export default async function fetchWithToken(url: string, options: object = {}) {
    let fetchWithTokenResolve: any;
    let fetchWithTokenReject: any;
    const requestPromise = new Promise((resolve, reject) => {
        fetchWithTokenResolve = resolve;
        fetchWithTokenReject = reject;
    });

    const requestFn = () => {
        const token: string = tokenService.get();
        const opts: any = {
            ...options,
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/vnd.api+json',
        };

        fetch(url, opts).then(async (response) => {
            try {
                fetchWithTokenResolve(response);
            } catch (err) {
                fetchWithTokenReject(err);
            }
        }).catch((err) => {
            fetchWithTokenReject(err);
        });
    };

    let token = tokenService.get();

    if (isTokenExpire(token)) {
        token = null;
    }

    if (!token || busy) {
        busy = true;
        queueRequests.push(requestFn);
        if (!token && !tokenTry) {
            tokenTry++;
            token = await tokenService.update();
            busy = false;
            tokenTry = 0;
            executeQueue();
        }
    } else {
        requestFn();
    }
    return requestPromise;
}
