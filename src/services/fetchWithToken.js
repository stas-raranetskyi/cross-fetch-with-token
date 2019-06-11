import fetch from 'cross-fetch';
import tokenService from './token';
var counterRequest = 0;
const rejectNotAuthorizedRequestText = 'Available number of requests exceeded';

export default async function fetchWithToken(url, options = {}){
    let token = tokenService.get();

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
    }

    return new Promise((resolve, reject) => {
        fetch(url, options).then(async response => {
            try{
                if(response.status === 401){
                    await tokenService.update();
                    if(counterRequest < 2){
                        counterRequest++;
                        resolve(fetchWithToken(url, options));
                    }
                    else{
                        counterRequest = 0;
                        throw rejectNotAuthorizedRequestText;
                    }
                }
                else{
                    counterRequest = 0;
                    resolve(response);
                }
            }
            catch(err){
                reject(err);
            }
        });
    });
}
