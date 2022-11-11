import StatisticsDateRangeFilter from "./statistics-date-range-filter";
import { EntryType, GroupBy, SelectValue } from "./statistics-enums";
import StatisticsGroupByTimePeriod from "./statistics-group-by-time-period";

export default interface StatisticsRequest {
    dateRangeFilter?: StatisticsDateRangeFilter;
    entryTypeFilter?: EntryType;
    categoryFilter?: string[];
    tagFilter?: string[];
    groupBy?: GroupBy[];
    groupByTimePeriodProperties?: StatisticsGroupByTimePeriod;
    selectValues: SelectValue[];
    selectOnAllLevels?: boolean;
}