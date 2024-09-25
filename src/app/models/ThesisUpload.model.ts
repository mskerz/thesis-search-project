export interface ThesisUploadList{

    idx: number,
    doc_id:number,
    title_th:string,
    author_name:string,
    advisor_name:string,
    recheck_status:number,
    file_name:string,
}

export class ThesisUploadListConvert {
    public static json_ThesisUpload(json: string): ThesisUploadList[]{
        return JSON.parse(json);
    }

     
}