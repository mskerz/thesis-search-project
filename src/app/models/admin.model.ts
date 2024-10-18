export interface Admin{

    idx: number,
    user_id:number,
    fullname:string,
    email:string,
    access_role:number,
}

export class AdminListConvert {
    public static Json_ToAdmins(json: string): Admin[]{
        return JSON.parse(json);
    }

     
}