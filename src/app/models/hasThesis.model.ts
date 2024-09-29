export interface ThesisResponse {
  title_th: string;
  title_en: string;
  author_name: string;
  advisor_name: number;
  recheck_status: number;
  year: number;
  abstract:string;
}

export interface ThesisCheckResponse {
  has_deleted: boolean;
  thesis?: ThesisResponse;
}


export class ThesisCheckConvert {
    public static fromJson_toThesis(json: string): ThesisResponse {
        return JSON.parse(json);
    }

}