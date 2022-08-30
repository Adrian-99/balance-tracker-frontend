import { ExpandMore as ExpandMoreIcon, KeyboardArrowDown as ArrowDownIcon, KeyboardArrowUp as ArrowUpIcon, MoreVert as MoreIcon } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Collapse, createTheme, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip, Typography, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CategorySelectComponent from "../components/autocomplete/category-select.component";
import TagSelectComponent from "../components/autocomplete/tag-select.component";
import DatePickerComponent from "../components/date-picker.component";
import PageCardComponent from "../components/page-card.component";
import SearchFieldComponent from "../components/search-field.component";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import TableHeaderComponent from "../components/table-header.component";
import Category from "../data/category";
import Entry from "../data/entry";
import EntryFilter from "../data/entry-filter";
import Page from "../data/page";
import Pageable from "../data/pageable";
import Tag from "../data/tag";
import { useCategoryService } from "../hooks/category-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useEntryService } from "../hooks/entry-service.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { useUtils } from "../hooks/utils.hook";

const HistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const { register, control, handleSubmit, setValue, getValues, reset } = useForm<EntryFilter>();
    const { getAllCategories } = useCategoryService();
    const { getAllTags } = useTagService();
    const { getEntriesPaged } = useEntryService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { isSmallScreen, isExtraSmallScreen, relativeDateString, currencyValueString, renderCategory } = useUtils();

    const THEME = createTheme(useTheme(), plPL);

    const DATE_FORMAT = "YYYY-MM-DD";

    const PAGE_NUMBER = "pageNumber";
    const PAGE_SIZE = "pageSize";
    const SORT_BY = "sortBy";
    const SEARCH_VALUE = "searchValue";
    const DATE_FROM = "dateFrom";
    const DATE_TO = "dateTo";
    const CATEGORIES_KEYWORDS = "categoriesKeywords";
    const TAGS_NAMES = "tagsNames";
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);
    const [isFilterSet, setIsFilterSet] = useState<boolean>(false);
    const [entryParams, setEntryParams] = useState<Pageable & EntryFilter>({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "date",
        sortDescending: true,
        searchValue: null,
        dateFrom: null,
        dateTo: null,
        categoriesKeywords: [],
        tagsNames: []
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [entriesPage, setEntriesPage] = useState<Page<Entry> | undefined>(undefined);
    const [expandedRows, setExapndedRows] = useState<boolean[]>([]);

    useEffect(() => {
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
            });
        
        getAllTags()
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let sortBy = searchParams.get(SORT_BY) || "date";
        if (sortBy.startsWith('-')) {
            sortBy = sortBy.substring(1);
        }
        let sortByTyped: "date" | "value" | "name";
        let sortByCorrect: boolean;
        if (sortBy === "date" || sortBy === "value" || sortBy === "name") {
            sortByTyped = sortBy;
            sortByCorrect = true;
        } else {
            sortByTyped = "date";
            sortByCorrect = false;
        }
        let dateFromString = searchParams.get(DATE_FROM);
        let dateToString = searchParams.get(DATE_TO);

        const params = {
            pageNumber: Number.parseInt(searchParams.get(PAGE_NUMBER) || '1'),
            pageSize: Number.parseInt(searchParams.get(PAGE_SIZE) || '10'),
            sortBy: sortByTyped,
            sortDescending: (!searchParams.get(SORT_BY) || (searchParams.get(SORT_BY)?.startsWith('-') && sortByCorrect)) || false,
            searchValue: searchParams.get(SEARCH_VALUE) || null,
            dateFrom: dateFromString ? moment(dateFromString, DATE_FORMAT).toDate() : null,
            dateTo: dateToString ? moment(dateToString, DATE_FORMAT).toDate() : null,
            categoriesKeywords: searchParams.get(CATEGORIES_KEYWORDS)?.split(',') || [],
            tagsNames: searchParams.get(TAGS_NAMES)?.split(',') || []
        };

        setValue("searchValue", params.searchValue);
        setValue("dateFrom", params.dateFrom);
        setValue("dateTo", params.dateTo);
        setValue("categoriesKeywords", params.categoriesKeywords);
        setValue("tagsNames", params.tagsNames);

        setIsFilterSet(
            params.searchValue !== null ||
            params.dateFrom !== null ||
            params.dateTo !== null ||
            params.categoriesKeywords.length > 0 ||
            params.tagsNames.length > 0
        );

        if (sortByCorrect) {
            setEntryParams(params);
            setAwaitingResponse(true);
            getEntriesPaged(params)
                .then(response => {
                    setEntriesPage(response);
                    setExapndedRows(new Array<boolean>(response.data.length));
                    setAwaitingResponse(false);
                })
                .catch(error => {
                    errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
                    setAwaitingResponse(false);
                });
        } else {
            updateQueryParams(params);
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSortChange = (sortColumn: string) => {
        if (sortColumn === entryParams.sortBy) {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortDescending: !entryParams.sortDescending });
        } else if (sortColumn === "date" || sortColumn === "value" || sortColumn === "name") {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortBy: sortColumn, sortDescending: false });
        } else {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortBy: "date", sortDescending: false });
        }
    }

    const onPageChange = (page: number) => {
        updateQueryParams({ ...entryParams, pageNumber: page + 1 });
    }

    const onRowsPerPageChange = (rowsPerPage: number) => {
        updateQueryParams({ ...entryParams, pageNumber: 1, pageSize: rowsPerPage });
    }

    const onFilterSubmit: SubmitHandler<EntryFilter> = data => {
        const { sortBy, sortDescending, ...otherData } = data;
        updateQueryParams({ ...entryParams, pageNumber: 1, ...otherData });
    }

    const clearFilter = () => {
        reset();
        updateQueryParams({
            pageNumber: 1,
            pageSize: entryParams.pageSize,
            sortBy: entryParams.sortBy,
            sortDescending: entryParams.sortDescending,
            searchValue: null,
            dateFrom: null,
            dateTo: null,
            categoriesKeywords: [],
            tagsNames: []
        });
    }

    const updateQueryParams = (newParams: Pageable & EntryFilter) => {
        setSearchParams({
            ...(newParams.pageNumber !== 1 && { [PAGE_NUMBER]: newParams.pageNumber.toString() }),
            ...(newParams.pageSize !== 10 && { [PAGE_SIZE]: newParams.pageSize.toString() }),
            ...((newParams.sortBy !== "date" || !newParams.sortDescending) && { [SORT_BY]: (newParams.sortDescending ? '-' : '') + newParams.sortBy }),
            ...(newParams.searchValue && { [SEARCH_VALUE]: newParams.searchValue }),
            ...(newParams.dateFrom && { [DATE_FROM]: moment(newParams.dateFrom).format(DATE_FORMAT) }),
            ...(newParams.dateTo && { [DATE_TO]: moment(newParams.dateTo).format(DATE_FORMAT) }),
            ...(newParams.categoriesKeywords.length && { [CATEGORIES_KEYWORDS]: newParams.categoriesKeywords.join(',') }),
            ...(newParams.tagsNames.length && { [TAGS_NAMES]: newParams.tagsNames.join(',') }),
        });
    }

    const expandRow = (rowIndex: number) => {
        let expandedRowsCopy = new Array(...expandedRows);
        expandedRowsCopy[rowIndex] = !expandedRowsCopy[rowIndex];
        setExapndedRows(expandedRowsCopy);
    }

    const tableWidthColspan = (): number => {
        if (isExtraSmallScreen) {
            return 4;
        } else if (isSmallScreen) {
            return 5;
        } else {
            return 6;
        }
    }

    const showCategory = (categoryKeyword: string): JSX.Element => {
        let category = categories.find(c => c.keyword === categoryKeyword);
        if (category) {
            return renderCategory(category);
        } else {
            return <Box>—</Box>;
        }
    }

    const showTags = (tags: Tag[]): JSX.Element[] => {
        if (tags.length) {
            return tags.map(tag => 
                <Chip key={tag.name} size="small" label={tag.name}/>
            );
        } else {
            return [ <span>—</span> ];
        }
    }

    const showFiltersForm = (horizontally: boolean): JSX.Element => {
        return (
            <form onSubmit={handleSubmit(onFilterSubmit)} autoComplete="off">
                <Box display="flex" flexWrap="wrap" gap="8px" alignItems="flex-start">
                    <SearchFieldComponent
                        label={t("general.search")}
                        useFormRegister={register("searchValue")}
                        onSubmit={handleSubmit(onFilterSubmit)}
                        size="small"
                        fullWidth={!horizontally}
                        sx={{ ...(horizontally && { width: "200px" }) }}
                    />
                    <DatePickerComponent
                        formFieldName="dateFrom"
                        control={control}
                        label={t("general.date.from")}
                        dateFormat={DATE_FORMAT.replaceAll('-', '.')}
                        maxDate={getValues("dateTo") || undefined}
                        autoSubmit
                        submitFunction={handleSubmit(onFilterSubmit)}
                        size="small"
                        fullWidth={!horizontally}
                        sx={{ ...(horizontally && { width: "200px" }) }}
                    />
                    <DatePickerComponent
                        formFieldName="dateTo"
                        control={control}
                        label={t("general.date.to")}
                        dateFormat={DATE_FORMAT.replaceAll('-', '.')}
                        minDate={getValues("dateFrom") || undefined}
                        autoSubmit
                        submitFunction={handleSubmit(onFilterSubmit)}
                        size="small"
                        fullWidth={!horizontally}
                        sx={{ ...(horizontally && { width: "200px" }) }}
                    />
                    <CategorySelectComponent
                        formFieldName="categoriesKeywords"
                        control={control}
                        label={t("general.categories")}
                        options={categories}
                        multiple
                        autoSubmit
                        submitFunction={handleSubmit(onFilterSubmit)}
                        size="small"
                        fullWidth={!horizontally}
                        sx={{ ...(horizontally && { minWidth: "250px", maxWidth: "400px" }) }}
                    />
                    { tags.length > 0 &&
                        <TagSelectComponent
                            formFieldName="tagsNames"
                            control={control}
                            label={t("general.tags")}
                            options={tags}
                            multiple
                            autoSubmit
                            submitFunction={handleSubmit(onFilterSubmit)}
                            size="small"
                            fullWidth={!horizontally}
                            sx={{ ...(horizontally && { minWidth: "250px", maxWidth: "400px" }) }}
                        />
                    }
                    <Button type="submit" sx={{ display: "none" }}></Button>
                </Box>
            </form>
        );
    }

    return (
        <PageCardComponent title={t("pages.history.title")} width={12}>
            <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} gap="8px" alignItems="center">
                { isSmallScreen ?
                    <Accordion elevation={0} sx={{ border: "solid 1px", borderColor: "grey.300" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={1}>
                                <Typography>
                                    { t("general.filters") }
                                </Typography>
                                {/* <Typography color="text.secondary">
                                    Active filters here
                                </Typography> */}
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            { showFiltersForm(false) }
                        </AccordionDetails>
                    </Accordion>
                    :
                    showFiltersForm(true)
                }
                { isFilterSet &&
                    <Button variant="text" onClick={clearFilter}>
                        { t("general.clearFilters") }
                    </Button>
                }
            </Box>
            <TableContainer>
                <Table style={{ tableLayout: "fixed" }} size={isExtraSmallScreen ? "small" : "medium"}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderComponent
                                columnKey="date"
                                columnLabel={t("pages.history.header.date")}
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableHeaderComponent
                                columnKey="name"
                                columnLabel={t("pages.history.header.name")}
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            { !isExtraSmallScreen &&
                                <TableHeaderComponent
                                    columnKey="category"
                                    columnLabel={t("pages.history.header.category")}
                                />
                            }
                            { !isSmallScreen &&
                                <TableHeaderComponent
                                    columnKey="tags"
                                    columnLabel={t("pages.history.header.tags")}
                                />
                            }
                            <TableHeaderComponent
                                columnKey="value"
                                columnLabel={t("pages.history.header.value")}
                                align="right"
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableCell key="actionButtons" style={isSmallScreen ? { width: "34px" } : { width: "68px" }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { !awaitingResponse && entriesPage?.data.length ?
                            React.Children.toArray(
                                entriesPage.data.map((entry, index) =>
                                    <>
                                        <TableRow sx={{ '& > *': { borderBottom: 'none !important' } }}>
                                            <TableCell>
                                                <Tooltip
                                                    title={moment(entry.date).format("YYYY.MM.DD HH:mm:ss")}
                                                    placement="top"
                                                    arrow={true}
                                                    enterDelay={500}
                                                >
                                                    <span>
                                                        { relativeDateString(entry.date) }
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{entry.name}</TableCell>
                                            { !isExtraSmallScreen &&
                                                <TableCell>{ showCategory(entry.categoryKeyword) }</TableCell>
                                            }
                                            { !isSmallScreen &&
                                                <TableCell>{ showTags(entry.tags) }</TableCell>
                                            }
                                            <TableCell align="right">{ currencyValueString(entry.value) }</TableCell>
                                            <TableCell style={isSmallScreen ? { width: "34px" } : { width: "68px" }}>
                                                <IconButton size="small" onClick={() => expandRow(index)}>
                                                    { expandedRows[index] ? <ArrowUpIcon /> : <ArrowDownIcon /> }
                                                </IconButton>
                                                { !isSmallScreen &&
                                                    <IconButton size="small">
                                                        <MoreIcon />
                                                    </IconButton>
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={tableWidthColspan()} style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            { isExtraSmallScreen &&
                                                                <>
                                                                    <Typography variant="subtitle2">
                                                                        { t("pages.history.header.category") }
                                                                    </Typography>
                                                                    <Typography variant="body2" style={{ paddingBottom: isExtraSmallScreen ? "6px" : "16px" }}>
                                                                        { showCategory(entry.categoryKeyword) }
                                                                    </Typography>
                                                                </>
                                                            }
                                                            { isSmallScreen &&
                                                                <>
                                                                    <Typography variant="subtitle2">
                                                                        { t("pages.history.header.tags") }
                                                                    </Typography>
                                                                    <Typography variant="body2" style={{ paddingBottom: isExtraSmallScreen ? "6px" : "16px" }}>
                                                                        { showTags(entry.tags) }
                                                                    </Typography>
                                                                </>
                                                            }
                                                            <Typography variant="subtitle2">
                                                                { t("pages.history.header.description") }
                                                            </Typography>
                                                            <Typography variant="body2" style={{ paddingBottom: isExtraSmallScreen ? "6px" : "16px" }}>
                                                                { entry.description || '—' }
                                                            </Typography>
                                                        </Box>
                                                        { isSmallScreen &&
                                                            <IconButton size="small">
                                                                <MoreIcon />
                                                            </IconButton>
                                                        }
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )
                            )
                            :
                            <TableRow>
                                <TableCell colSpan={tableWidthColspan()}>
                                    <SpinnerOrNoDataComponent showSpinner={awaitingResponse} showNoData={!entriesPage?.data.length} />
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
                <ThemeProvider theme={THEME}>
                    <TablePagination
                        component="div"
                        count={entriesPage?.totalCount || 0}
                        page={entryParams.pageNumber - 1}
                        rowsPerPage={entryParams.pageSize}
                        showFirstButton={!isExtraSmallScreen}
                        showLastButton={!isExtraSmallScreen}
                        onPageChange={(_event, page) => onPageChange(page)}
                        onRowsPerPageChange={(event) => onRowsPerPageChange(Number.parseInt(event.target.value))}
                    />
                </ThemeProvider>
            </TableContainer>
        </PageCardComponent>
    );
}
export default HistoryPage;