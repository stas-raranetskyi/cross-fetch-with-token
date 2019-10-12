import { Token } from './services/token';
export { default as settings } from './settings';
export { default } from './services/fetchWithToken';
export const tokenService = Token.getInstance();
