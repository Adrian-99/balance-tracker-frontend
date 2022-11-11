import { TimePeriodUnit } from "./statistics-enums";

export default interface StatisticsGroupByTimePeriod {
    startDate: Date;
    intervalValue: number;
    intervalUnit: TimePeriodUnit;
}