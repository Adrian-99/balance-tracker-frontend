export const ENTRY_TYPES = ["income", "cost"] as const;
export type EntryType = typeof ENTRY_TYPES[number];

export const GROUP_BY_VALUES = ["timePeriod", "entryType", "category", "tag"] as const;
export type GroupBy = typeof GROUP_BY_VALUES[number];

export const TIME_PERIOD_UNITS = ["day", "month", "year"] as const; 
export type TimePeriodUnit = typeof TIME_PERIOD_UNITS[number];

export const SELECT_VALUES = ["count", "min", "max", "sum", "average", "median"] as const;
export type SelectValue = typeof SELECT_VALUES[number];