export interface Student{

    idx: number,
    user_id:number,
    author_name:string,
    email:string,
    access_role:number,
}

export class StudentListConvert {
    public static json_ThesisUpload(json: string): Student[]{
        return JSON.parse(json);
    }

     
}