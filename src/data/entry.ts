import Tag from "./tag";

export default interface Entry {
    date: Date;
    value: number;
    name: string;
    description?: string;
    categoryKeyword: string;
    tags: Tag[];
}