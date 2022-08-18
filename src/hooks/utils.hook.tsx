import { Box, SvgIcon, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Category from "../data/category";

export const useUtils = () => {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("md"));

    const isWithinTimeframe = (from: Date, timeframeDays: number): boolean => {
        var duration = moment.duration(moment(Date.now()).diff(from));
        return duration.asMilliseconds() > 0 && duration.asDays() < timeframeDays;
    };

    const addDays = (date: Date, days: number): Date => {
        return moment(date).add(days, "days").toDate();
    };

    const durationUntilString = (to: Date): string => {
        var duration = moment(to).diff(Date.now());
        if (duration > 0) {
            var durationMoment = moment.duration(duration);
            if (durationMoment.years() > 0) {
                return `${durationMoment.years()} ${t("general.duration.year" + ((durationMoment.years() > 1) ? "s" : ""))}`;
            } else if (durationMoment.months() > 0) {
                return `${durationMoment.months()} ${t("general.duration.month" + ((durationMoment.months() > 1) ? "s" : ""))}`;
            } else if (durationMoment.days() > 0) {
                return `${durationMoment.days()} ${t("general.duration.day" + ((durationMoment.days() > 1) ? "s" : ""))}`;
            } else if (durationMoment.hours() > 0) {
                return `${durationMoment.hours()} ${t("general.duration.hour" + ((durationMoment.hours() > 1) ? "s" : ""))}`;
            } else if (durationMoment.minutes() > 0) {
                return `${durationMoment.minutes()} ${t("general.duration.minute" + ((durationMoment.minutes() > 1) ? "s" : ""))}`;
            } else if (durationMoment.seconds() > 0) {
                return `${durationMoment.seconds()} ${t("general.duration.second" + ((durationMoment.seconds() > 1) ? "s" : ""))}`;
            } else {
                return `<1 ${t("general.duration.second")}`;
            }
        }
        return `0 ${t("general.duration.seconds")}`;
    };

    const relativeDateString = (date: Date): string => {
        let todayDate = moment(Date.now()).startOf("day");
        let dateMoment = moment(date);
        let dateDate = moment(date).startOf("day");
        if (todayDate.isSame(dateDate)) {
            return `${t("general.date.today")}, ${dateMoment.format("HH:mm")}`;
        } else if (moment.duration(todayDate.diff(dateDate)).asDays() === 1) {
            return `${t("general.date.yesterday")}, ${dateMoment.format("HH:mm")}`;
        } else if (todayDate.year() === dateDate.year()) {
            return `${dateMoment.date()} ${t(`general.date.months.${dateMoment.month() + 1}`)}, ${dateMoment.format("HH:mm")}`;
        } else {
            return `${dateMoment.date()} ${t(`general.date.months.${dateMoment.month() + 1}`)} ${dateMoment.format("YYYY, HH:mm")}`;
        }
    };

    const currencyValueString = (value: number): string => {
        return t("general.currencyValue", { value: Number(value).toFixed(2).replace('.', ',') });
    };

    const renderCategory = (category: Category): JSX.Element => {
        return (
            <Box display="flex" flexWrap="wrap" columnGap="4px" alignItems="center">
                <SvgIcon sx={{ color: category.iconColor }}>
                    <path d={category.icon}></path>
                </SvgIcon>
                <span>
                    { t("categories." + category.keyword) }
                </span>
            </Box>
        );
    }

    return { isSmallScreen, isWithinTimeframe, addDays, durationUntilString, relativeDateString, currencyValueString, renderCategory };
}