export interface ThesisResponse {
  title_th: string;
  title_en: string;
  advisor_id: number;
  year: number;
}

export interface ThesisCheckResponse {
  has_thesis: boolean;
  thesis?: ThesisResponse;
}


export class ThesisCheckConvert {
    public static fromJson_toThesis(json: string): ThesisResponse {
        return JSON.parse(json);
    }

}