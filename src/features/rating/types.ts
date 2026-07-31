export interface RatingField {
    key: string;
    label: string;
    isNumeric?: boolean;
}

export interface RatingFieldConfig {
    sales: RatingField[];
    conduct: RatingField[];
    contribution: RatingField[];
}

export interface RatingRow {
    salesScore: number | null;
    conductScore: number | null;
    contributionScore: number | null;
    achievementPercent: number | null;
    extraFields: Record<string, string>;
    total: number;
    updatedAt: string;
    raterId: number;
}

export interface RatingBandInfo {
    key: string;
    label: string;
    min: number;
    color: string;
}

export interface RatingOverall {
    total: number;
    band: RatingBandInfo;
    isFinal: boolean;
}

export interface BandSummaryEntry extends RatingBandInfo {
    count: number;
}

export interface EmployeeRating {
    id: number;
    fullName: string;
    role: string;
    departmentId: number | null;
    departmentName: string | null;
    fields: RatingFieldConfig;
    self: RatingRow | null;
    senior: RatingRow | null;
    overall: RatingOverall;
    canEditSenior: boolean;
}

export interface EmployeeRatingDetail {
    employee: {
        id: number;
        fullName: string;
        role: string;
        departmentId: number | null;
        departmentName: string | null;
    };
    period: string;
    fields: RatingFieldConfig;
    self: RatingRow | null;
    senior: RatingRow | null;
    overall: RatingOverall;
    canEditSelf: boolean;
    canEditSenior: boolean;
}

export interface TeamRating {
    employees: EmployeeRating[];
    teamAverage: number;
    period: string;
    bandSummary: BandSummaryEntry[];
}

export interface Department {
    id: number;
    department_name: string;
}

export interface RatingSubmission {
    period: string;
    salesScore: number | null;
    conductScore: number | null;
    contributionScore: number | null;
    achievementPercent?: number | null;
    extraFields: Record<string, string>;
}