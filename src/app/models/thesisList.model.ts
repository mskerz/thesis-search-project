

export interface ThesisList{
    doc_id:number;
    title_th:string;
    author_name:string;
    advisor_name:string;
    year:number;
    tf_idf_score?: number|undefined; // Optional field

}

export class ThesisListConvert {
    public static fromJson_toThesis(json: string): ThesisList[] {
        return JSON.parse(json);
    }


}