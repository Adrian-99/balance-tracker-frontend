import StatisticsDateRangeFilter from "./statistics-date-range-filter";
import { EntryType, GroupBy, SelectValue } from "./statistics-enums";
import StatisticsGroupByTimeInterval from "./statistics-group-by-time-interval";

export default interface StatisticsRequest {
    dateRangeFilter?: StatisticsDateRangeFilter;
    entryTypeFilter?: EntryType;
    categoryFilter?: string[];
    tagFilter?: string[];
    groupBy?: GroupBy[];
    groupByTimeIntervalProperties?: StatisticsGroupByTimeInterval;
    selectValues: SelectValue[];
    selectOnAllLevels?: boolean;
}