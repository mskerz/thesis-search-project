

export interface Advisor{
    advisor_id:number;
    advisor_name:string;
}

export class ThesisConvert {
    public static fromJson_toAdvisor(json: string): Advisor[] {
        return JSON.parse(json);
    }

    public static fromAdvisor_ToJson(value: Advisor[]): string {
        return JSON.stringify(value);
    }
}