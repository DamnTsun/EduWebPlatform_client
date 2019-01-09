export class AuthObject {
    public idToken: string;             // JWT for authorization.
    public expiresAt: number;           // When token expires. (in unix time (1 per second since 1970/01/01...))
}