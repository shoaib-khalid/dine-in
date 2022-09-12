export interface CustomerAuthenticate
{
    authorities: string[];
    role: string;
    session: {
        accessToken: string;
        created: string;
        expiry: string;
        ownerId: string;
        refreshToken: string;
        username: string;
    }
    sessionType: string;
}

export class ValidateOauthRequest{
    country     :	string;
    email       :   string;
    loginType	:   string;
    name	    ?:   string;
    token	    :   string;
    userId	    ?:   string;
    domain      ?: string;
} 