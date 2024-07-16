

export interface Thesis{
    doc_id:number;
    title_th:string;
    title_en:string;
    author_name:string;
    advisor_name:string;
    year:number;
    abstract:string;
}

export class ThesisConvert {
    public static fromJson_toThesis(json: string): Thesis {
        return JSON.parse(json);
    }

}