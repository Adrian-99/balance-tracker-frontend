import { Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AutocompleteComponent from "../components/autocomplete/autocomplete.component";
import CategorySelectComponent from "../components/autocomplete/category-select.component";
import StringSelectComponent from "../components/autocomplete/string-select.component";
import DateTimePickerComponent from "../components/date-time-picker.component";
import Category from "../data/category";
import { ENTRY_TYPES, GROUP_BY_VALUES, SELECT_VALUES, TIME_PERIOD_UNITS } from "../data/statistics-enums";
import StatisticsRequest from "../data/statistics-request";
import StatisticsResponse from "../data/statistics-response";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useStatisticsService } from "../hooks/statistics-service.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { CustomFormModal } from "./custom-form.modal";

interface IProps {
    open: boolean;
    onClose: (statisticsResponse?: StatisticsResponse) => void;
    categories: Category[];
}

const GenerateNewStatisticsModal: React.FC<IProps> = ({ open, onClose, categories }) => {
    const FILTER_BY_VALUES = ["dateRange", "entryType", "category", "tag"] as const;
    type FilterBy = typeof FILTER_BY_VALUES[number];
    
    const { t } = useTranslation();
    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<StatisticsRequest>();
    const { getTagNames } = useTagService();
    const { generateStatistics } = useStatisticsService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<FilterBy[]>([]);

    const DATE_FORMAT = "YYYY.MM.DD";
    const dateRangeFilterWatch = watch("dateRangeFilter");
    const entryTypeFilterWatch = watch("entryTypeFilter");
    const groupByWatch = watch("groupBy");

    useEffect(() => {
        getTagNames()
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCategoriesFilterOptions = (): Category[] => {
        if (entryTypeFilterWatch) {
            return categories.filter(c => entryTypeFilterWatch === "income" ? c.isIncome : !c.isIncome);
        } else {
            return categories;
        }
    };

    const clearFormAndClose = (statisticsResponse?: StatisticsResponse) => {
        reset();
        setSelectedFilters([]);
        onClose(statisticsResponse);
    };

    const onSubmit: SubmitHandler<StatisticsRequest> = data => {
        setAwaitingResponse(true);
        generateStatistics(data)
            .then(response => {
                clearFormAndClose(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            })
            .finally(() => {
                setAwaitingResponse(false);
            })
    };

    return (
        <CustomFormModal title={t("pages.statistics.generateNewStatistics")}
            showSubmitButtonSpinner={awaitingResponse}
            onClose={() => clearFormAndClose(undefined)}
            submitButtonText={t("modals.generateNewStatistics.submitButton")}
            onSubmit={handleSubmit(onSubmit)}
            open={open}
        >
            <Typography variant="h5" mb="16px">{ t("modals.generateNewStatistics.filtering") }</Typography>
            <Grid container spacing={2} alignItems="top" justifyContent="center">
                <Grid item xs={12}>
                    <AutocompleteComponent
                        label={t("modals.generateNewStatistics.filterBy")}
                        options={tags.length > 0 ? Array.from(FILTER_BY_VALUES) : FILTER_BY_VALUES.filter(f => f !== "tag")}
                        multiple
                        limitTags={3}
                        fullWidth
                        value={selectedFilters}
                        onChange={(_, value) => {
                            if (value) {
                                if (Array.isArray(value)) {
                                    setSelectedFilters(value);
                                } else {
                                    setSelectedFilters([ value ]);
                                }
                            } else {
                                setSelectedFilters([]);
                            }
                        }}
                        renderOption={option => <span>{ t("modals.generateNewStatistics.filterByValue." + option) }</span>}
                        getOptionLabel={option => t("modals.generateNewStatistics.filterByValue." + option)}
                    />
                </Grid>
                { selectedFilters.includes("dateRange") &&
                    <>
                        <Grid item xs={12} sm={6}>
                            <DateTimePickerComponent
                                type="date"
                                formFieldName="dateRangeFilter.dateFrom"
                                control={control}
                                label={t("general.date.from")}
                                dateTimeFormat={DATE_FORMAT}
                                required
                                maxDate={dateRangeFilterWatch?.dateTo || undefined}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DateTimePickerComponent
                                type="date"
                                formFieldName="dateRangeFilter.dateTo"
                                control={control}
                                label={t("general.date.to")}
                                dateTimeFormat={DATE_FORMAT}
                                required
                                minDate={dateRangeFilterWatch?.dateFrom || undefined}
                                fullWidth
                            />
                        </Grid>
                    </>
                }
                { selectedFilters.includes("entryType") &&
                    <Grid item xs={12}>
                        <StringSelectComponent
                            formFieldName="entryTypeFilter"
                            control={control}
                            label={t("general.statistics.entryType")}
                            options={Array.from(ENTRY_TYPES)}
                            required
                            fullWidth
                            translateLabel
                            translateKeyPrefix="general.statistics.entryTypeValue"
                        />
                    </Grid>
                }
                { selectedFilters.includes("category") &&
                    <Grid item xs={12}>
                        <CategorySelectComponent
                            formFieldName="categoryFilter"
                            control={control}
                            label={t("general.categories")}
                            options={getCategoriesFilterOptions()}
                            required
                            multiple
                            fullWidth
                        />
                    </Grid>
                }
                { selectedFilters.includes("tag") &&
                    <Grid item xs={12}>
                        <StringSelectComponent
                            formFieldName="tagFilter"
                            control={control}
                            label={t("general.entry.tags")}
                            options={tags}
                            required
                            multiple
                            fullWidth
                        />
                    </Grid>
                }
            </Grid>

            <Typography variant="h5" my="16px">{ t("modals.generateNewStatistics.grouping") }</Typography>
            <Grid container spacing={2} alignItems="top" justifyContent="center">
                <Grid item xs={12}>
                    <StringSelectComponent
                        formFieldName="groupBy"
                        control={control}
                        label={t("general.statistics.groupBy")}
                        options={tags.length ? Array.from(GROUP_BY_VALUES) : GROUP_BY_VALUES.filter(v => v !== "tag")}
                        multiple
                        limitTags={3}
                        keepSelectOrder
                        fullWidth
                        translateLabel
                        translateKeyPrefix="general.statistics.groupByValue"
                    />
                </Grid>
                { groupByWatch !== undefined && groupByWatch.includes("timePeriod") &&
                    <>
                        <Grid item xs={12} md={5}>
                            <DateTimePickerComponent
                                type="date"
                                formFieldName="groupByTimePeriodProperties.startDate"
                                control={control}
                                label={t("modals.generateNewStatistics.startDate")}
                                dateTimeFormat={DATE_FORMAT}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label={t("modals.generateNewStatistics.intervalValue") + " *"}
                                variant="outlined"
                                fullWidth
                                {...register("groupByTimePeriodProperties.intervalValue", {
                                    required: t("validation.required") as string,
                                    pattern: { value: /^\d+$/, message: t("validation.valuePattern")}
                                })}
                                error={errors.groupByTimePeriodProperties?.intervalValue !== undefined}
                                helperText={errors.groupByTimePeriodProperties?.intervalValue?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StringSelectComponent
                                formFieldName="groupByTimePeriodProperties.intervalUnit"
                                control={control}
                                label={t("modals.generateNewStatistics.intervalUnit")}
                                options={Array.from(TIME_PERIOD_UNITS)}
                                required
                                fullWidth
                                translateLabel
                                translateKeyPrefix="modals.generateNewStatistics.intervalUnitValue"
                            />
                        </Grid>
                    </>
                }
            </Grid>

            <Typography variant="h5" my="16px">{ t("modals.generateNewStatistics.selecting") }</Typography>
            <Grid container spacing={2} alignItems="top" justifyContent="center">
                <Grid item xs={12}>
                    <StringSelectComponent
                        formFieldName="selectValues"
                        control={control}
                        label={t("general.statistics.selectValue")}
                        options={Array.from(SELECT_VALUES)}
                        required
                        multiple
                        limitTags={3}
                        keepSelectOrder
                        fullWidth
                        translateLabel
                        translateKeyPrefix="general.statistics.selectValueValue"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        label={t("modals.generateNewStatistics.selectOnAllLevels")}
                        control={
                            <Checkbox
                                {...register("selectOnAllLevels")}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </CustomFormModal>
    );
}

export default GenerateNewStatisticsModal;