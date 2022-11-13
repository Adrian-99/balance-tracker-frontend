import { EntryType, SelectValue } from "./statistics-enums";
import StatisticsRow from "./statistics.row";

export default interface StatisticsResponse {
    entriesCount: number;
    selectValues: SelectValue[];
    dateFromFilter?: Date;
    dateToFilter?: Date;
    entryTypeFilter?: EntryType;
    categoryFilter?: string[];
    tagFilter?: string[];
    rows: StatisticsRow[];
}