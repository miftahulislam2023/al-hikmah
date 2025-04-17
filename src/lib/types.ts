export interface Course {
    id: number;
    semester: string;
    title: string;
    fee: number;
    isActive: boolean;
    createdAt: string; // or Date, if you're not serializing to JSON
    updatedAt: string; // or Date
}
