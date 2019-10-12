export declare class Token {
    static getInstance(): Token;
    private static instance;
    private document;
    private token;
    private constructor();
    get(): any;
    getTokenFromStorage(): any;
    setTokenToStorage(token: string): void;
    removeTokenFromStorage(): void;
    set(token: any): void;
    update(): Promise<unknown>;
}
