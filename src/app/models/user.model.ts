export interface User{
    email:string;
    firstname:string;
    lastname:string;
    access_role:number;
}

export class UserConvert {
    public static json_toUser(json: string): User{
        return JSON.parse(json);
    }

    public static User_toJson(value: User): string {
        return JSON.stringify(value);
    }
}