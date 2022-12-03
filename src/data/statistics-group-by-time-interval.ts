import { TimePeriodUnit } from "./statistics-enums";

export default interface StatisticsGroupByTimeInterval {
    referenceDate: Date;
    intervalLength: number;
    intervalUnit: TimePeriodUnit;
}