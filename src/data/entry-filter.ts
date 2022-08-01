export default interface EntryFilter {
    sortBy: "date" | "value" | "name";
    sortDescending: boolean;
    searchValue?: string;
    dateFrom?: Date;
    dateTo?: Date;
    categoriesKeywords?: string[];
    tagNames?: string[];
}