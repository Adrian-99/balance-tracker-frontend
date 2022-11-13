import { EntryType, SelectValue } from "./statistics-enums";

export default interface StatisticsRow {
    dateFrom?: Date;
    dateTo?: Date;
    entryType?: EntryType;
    categoryKeyword?: string;
    tagName?: string;
    values?: {
        [type in SelectValue]: number
    };
    subRows?: StatisticsRow[];
}