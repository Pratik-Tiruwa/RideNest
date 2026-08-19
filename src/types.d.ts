import User from '@/models/user.model';

declare module "next-auth" { 
    interface User { 
        role : string
    }
}

export {}