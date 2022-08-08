export default interface EntryFilter {
    sortBy: "date" | "value" | "name";
    sortDescending: boolean;
    searchValue: string | null;
    dateFrom: Date | null;
    dateTo: Date | null;
    categoriesKeywords: string[];
    tagNames: string[];
}