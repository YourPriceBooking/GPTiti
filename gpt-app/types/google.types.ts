
export interface BackendAuthResponse 
{ 
    accessToken: string; 
    refreshToken: string; 
    user: { 
        id: number; 
        email: string; 
        name: string; }; 
    }