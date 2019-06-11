import TokenBase from './src/services/token';
import fetchWithToken from './src/services/fetchWithToken';
import set from './src/settings';

export const Token = TokenBase;
export const settings = set;

export default fetchWithToken;
