export default interface TagFilter {
    sortBy: "name" | "entriesCount",
    sortDescending: boolean;
    searchValue: string | null;
}