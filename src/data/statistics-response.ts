import { EntryType } from "./statistics-enums";
import StatisticsRow from "./statistics.row";

export default interface StatisticsResponse {
    entriesCount: number;
    dateFromFilter?: Date;
    dateToFilter?: Date;
    entryTypeFilter?: EntryType;
    categoryFilter?: string[];
    tagFilter?: string[];
    rows: StatisticsRow[];
}