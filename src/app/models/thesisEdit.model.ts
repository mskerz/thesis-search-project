

export interface ThesisEdit{
    doc_id:number;
    title_th:string;
    title_en:string;
    advisor_id:number;
    advisor_name :string;
    year:number;


}

export class ThesisEditConvert {
    public static fromJson_toThesis(json: string): ThesisEdit {
        return JSON.parse(json);
    }


}