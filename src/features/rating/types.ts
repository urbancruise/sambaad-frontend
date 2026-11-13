export interface RatingField {
    key: string;
    label: string;
    isNumeric?: boolean;
}

export interface RatingFieldConfig {
    sales: RatingField[]; // Performance
    conduct: RatingField[]; // Conduct & Behaviour
    contribution: RatingField[]; // Contribution to Org.
}

export interface FieldEntry {
    rating: number | null;
    remarks: string;
    value?: number | null; // only used by numeric fields (e.g. Achievement %)
}

export interface RatingRow {
    salesScore: number | null; // sum of the module's field ratings
    conductScore: number | null;
    contributionScore: number | null;
    achievementPercent: number | null;
    fieldEntries: Record<string, FieldEntry>;
    total: number;
    percent: number;
    updatedAt: string;
    raterId: number;
}

export interface RatingBandInfo {
    key: string;
    label: string;
    min: number; // lowest percentage in the band
    color: string;
}

export interface RatingOverall {
    total: number;
    max: number;
    percent: number;
    band: RatingBandInfo;
    isFinal: boolean;
    levelsRated: number;
}

export interface BandSummaryEntry extends RatingBandInfo {
    count: number;
}

export interface RatingMaxScores {
    sales: number;
    conduct: number;
    contribution: number;
    total: number;
}

export type RowType = "self" | "senior" | "superSenior"; // senior = L-1, superSenior = L-2

export interface EmployeeRating {
    id: number;
    fullName: string;
    role: string;
    departmentId: number | null;
    departmentName: string | null;
    subDepartmentId: number | null;
    subDepartmentName: string | null;
    fields: RatingFieldConfig;
    maxScores: RatingMaxScores;
    self: RatingRow | null;
    senior: RatingRow | null; // L-1
    superSenior: RatingRow | null; // L-2
    overall: RatingOverall;
    canEditL1: boolean;
    canEditL2: boolean;
    canEditFields: boolean;
}

export type EmployeeRatingDetail = EmployeeRating & { period: string; canEditSelf: boolean };

export interface TeamRating {
    employees: EmployeeRating[];
    teamAveragePercent: number;
    period: string;
    bandSummary: BandSummaryEntry[];
}

export interface Department {
    id: number;
    department_name: string;
}

export interface SubDepartment {
    id: number;
    name: string | null;
    departmentId: number | null;
}

export interface RatingUser {
    id: number;
    name: string;
    role: string;
}

export interface RatingFilterOptions {
    showDepartmentFilter: boolean;
    showSubDepartmentFilter: boolean;
    // false for employees with no team: they only see their own history.
    isTeamViewer: boolean;
    departments: Department[];
    subDepartments: SubDepartment[];
    users: RatingUser[];
}

// One person's result for one month (a collapsible card on the page).
export type RatingCard = EmployeeRating & { period: string };

export interface RatingHistory {
    cards: RatingCard[];
    periods: string[];
    averagePercent: number;
    ratedCount: number;
    bandSummary: BandSummaryEntry[];
}

// Only the changed fields need to be sent - the server merges per field.
export interface RatingSubmission {
    period: string;
    fieldEntries: Record<string, Partial<FieldEntry>>;
}

/* ---- Customize fields ---- */

export interface FieldDraft {
    key: string;
    label: string;
    isNumeric?: boolean;
}

export type ModuleMap<T> = { sales: T; conduct: T; contribution: T };

// Per-user "Customize fields": tick fields from the central list.
export interface FieldSetup {
    employee: { id: number; fullName: string };
    subDepartment: { id: number; name: string | null };
    period: string;
    pool: ModuleMap<FieldDraft[]>;
    selected: ModuleMap<string[]>;
    caps: ModuleMap<number>;
    isDefaultPool: boolean;
}

export interface FieldSetupInput {
    period: string;
    selected: ModuleMap<string[]>;
}

// "Manage fields": the central list of one sub-department.
export interface ManageableSubDepartment {
    id: number;
    name: string | null;
    departmentId: number | null;
    departmentName: string | null;
}

export interface FieldPool {
    subDepartment: { id: number; name: string | null };
    period: string;
    pool: ModuleMap<FieldDraft[]>;
    isDefaultPool: boolean;
    caps: ModuleMap<number>;
}

export interface FieldPoolInput {
    period: string;
    pool: ModuleMap<FieldDraft[]>;
}
