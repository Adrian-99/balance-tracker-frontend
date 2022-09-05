export default interface EditEntry {
    date: Date;
    value: number;
    name: string;
    description?: string;
    categoryKeyword: string;
    tagNames: string[];
}