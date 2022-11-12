import { KeyboardArrowDown as ArrowDownIcon, KeyboardArrowUp as ArrowUpIcon, MoreVert as MoreIcon } from "@mui/icons-material";
import { Box, Button, Collapse, createTheme, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip, Typography, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import moment from "moment";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ApplicationContext } from "../components/application-context.provider";
import CategorySelectComponent from "../components/autocomplete/category-select.component";
import StringSelectComponent from "../components/autocomplete/string-select.component";
import CategoryComponent from "../components/category.component";
import DateTimePickerComponent from "../components/date-time-picker.component";
import FiltersComponent from "../components/filters.component";
import PageCardComponent from "../components/page-card.component";
import SearchFieldComponent from "../components/search-field.component";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import TableHeaderComponent from "../components/table-header.component";
import TagsComponent from "../components/tags.component";
import Category from "../data/category";
import Entry from "../data/entry";
import EntryFilter from "../data/entry-filter";
import Page from "../data/page";
import Pageable from "../data/pageable";
import { useCategoryService } from "../hooks/category-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useEntryService } from "../hooks/entry-service.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { useUtils } from "../hooks/utils.hook";
import { ConfirmationModalCloseReason } from "../modals/confirmation.modal";
import { CustomFormModalCloseReason } from "../modals/custom-form.modal";
import { DeleteEntryModal } from "../modals/delete-entry.modal";
import EditEntryModal from "../modals/edit-entry.modal";

const HistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const { register, control, handleSubmit, setValue, getValues, reset } = useForm<EntryFilter>();
    const { user } = useContext(ApplicationContext);
    const { getAllCategories } = useCategoryService();
    const { getTagNames } = useTagService();
    const { getEntriesPaged } = useEntryService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { isSmallScreen, isExtraSmallScreen, relativeDateString, currencyValueString } = useUtils();

    const THEME = createTheme(useTheme(), plPL);

    const DATE_FORMAT = "YYYY-MM-DD";

    const PAGE_NUMBER = "pageNumber";
    const PAGE_SIZE = "pageSize";
    const SORT_BY = "sortBy";
    const SEARCH_VALUE = "searchValue";
    const DATE_FROM = "dateFrom";
    const DATE_TO = "dateTo";
    const CATEGORIES_KEYWORDS = "categoriesKeywords";
    const TAG_NAMES = "tagNames";

    const ACTIONS = user?.isEmailVerified ? 
        [ { name: t("pages.history.addEntry"), action: () => openAddEntryModal() } ] :
        [];
    
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
    const [tagNames, setTagNames] = useState<string[]>([]);
    const [entriesPage, setEntriesPage] = useState<Page<Entry> | undefined>(undefined);
    const [expandedRows, setExapndedRows] = useState<boolean[]>([]);
    const [editEntryModalOpen, setEditEntryModalOpen] = useState(false);
    const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Entry>();
    const [entryOptionsAnchor, setEntryOptionsAnchor] = useState<null | HTMLElement>(null);
    const entryOptionsOpen = Boolean(entryOptionsAnchor);

    useEffect(() => {
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            });
        
        getTagNames()
            .then(response => {
                setTagNames(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
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
            tagsNames: searchParams.get(TAG_NAMES)?.split(',') || []
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
            getEntries(params);
        } else {
            updateQueryParams(params);
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const getEntries = (params?: Pageable & EntryFilter) => {
        setAwaitingResponse(true);
        getEntriesPaged(params || entryParams)
            .then(response => {
                setEntriesPage(response);
                setExapndedRows(new Array<boolean>(response.data.length));
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    const onSortChange = (sortColumn: string) => {
        if (sortColumn === entryParams.sortBy) {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortDescending: !entryParams.sortDescending });
        } else if (sortColumn === "date" || sortColumn === "value" || sortColumn === "name") {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortBy: sortColumn, sortDescending: false });
        } else {
            updateQueryParams({ ...entryParams, pageNumber: 1, sortBy: "date", sortDescending: true });
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

    const clearFilters = () => {
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
            ...(newParams.tagsNames.length && { [TAG_NAMES]: newParams.tagsNames.join(',') })
        });
    }

    const openEntryOptions = (event: React.MouseEvent<HTMLButtonElement>, entry: Entry) => {
        setEntryOptionsAnchor(event.currentTarget);
        setSelectedEntry(entry);
    }

    const closeEntryOptions = () => {
        setEntryOptionsAnchor(null);
    }

    const openAddEntryModal = () => {
        if (!editEntryModalOpen && !deleteEntryModalOpen) {
            setSelectedEntry(undefined);
            setEditEntryModalOpen(true);
        }
    }

    const openEditEntryModal = () => {
        if (!editEntryModalOpen && !deleteEntryModalOpen) {
            setEditEntryModalOpen(true);
            closeEntryOptions();
        }
    }

    const openDeleteEntryModal = () => {
        if (!editEntryModalOpen && !deleteEntryModalOpen) {
            setDeleteEntryModalOpen(true);
            closeEntryOptions();
        }
    }

    const onModalClose = (reason: CustomFormModalCloseReason | ConfirmationModalCloseReason) => {
        setSelectedEntry(undefined);
        setEditEntryModalOpen(false);
        setDeleteEntryModalOpen(false);
        if (reason === "save" || reason === "yes") {
            getEntries();
        }
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
            return <CategoryComponent category={category} />;
        } else {
            return <Box>—</Box>;
        }
    }

    const renderFiltersForm = (horizontally: boolean): JSX.Element => {
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
                    <DateTimePickerComponent
                        type="date"
                        formFieldName="dateFrom"
                        control={control}
                        label={t("general.date.from")}
                        dateTimeFormat={DATE_FORMAT.replaceAll('-', '.')}
                        maxDate={getValues("dateTo") || undefined}
                        autoSubmit
                        submitFunction={handleSubmit(onFilterSubmit)}
                        size="small"
                        fullWidth={!horizontally}
                        sx={{ ...(horizontally && { width: "200px" }) }}
                    />
                    <DateTimePickerComponent
                        type="date"
                        formFieldName="dateTo"
                        control={control}
                        label={t("general.date.to")}
                        dateTimeFormat={DATE_FORMAT.replaceAll('-', '.')}
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
                    { tagNames.length > 0 &&
                        <StringSelectComponent
                            formFieldName="tagsNames"
                            control={control}
                            label={t("general.entry.tags")}
                            options={tagNames}
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
        <PageCardComponent title={t("pages.history.title")} width={12} actions={ACTIONS}>
            <FiltersComponent
                renderFiltersForm={renderFiltersForm}
                isFilterSet={isFilterSet}
                clearFilters={clearFilters}
            />
            <TableContainer>
                <Table style={{ tableLayout: "fixed" }} size={isExtraSmallScreen ? "small" : "medium"}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderComponent
                                columnKey="date"
                                columnLabel={t("general.entry.date")}
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableHeaderComponent
                                columnKey="name"
                                columnLabel={t("general.entry.name")}
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            { !isExtraSmallScreen &&
                                <TableHeaderComponent
                                    columnKey="category"
                                    columnLabel={t("general.entry.category")}
                                />
                            }
                            { !isSmallScreen &&
                                <TableHeaderComponent
                                    columnKey="tags"
                                    columnLabel={t("general.entry.tags")}
                                />
                            }
                            <TableHeaderComponent
                                columnKey="value"
                                columnLabel={t("general.entry.value")}
                                align="right"
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableCell key="actionButtons" style={isSmallScreen || !user?.isEmailVerified ? { width: "34px" } : { width: "68px" }} />
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
                                                <TableCell>
                                                    <TagsComponent tagNames={entry.tags.map(t => t.name)} />
                                                </TableCell>
                                            }
                                            <TableCell align="right">{ currencyValueString(entry.value) }</TableCell>
                                            <TableCell style={isSmallScreen || !user?.isEmailVerified ? { width: "34px" } : { width: "68px" }}>
                                                <IconButton size="small" onClick={() => expandRow(index)}>
                                                    { expandedRows[index] ? <ArrowUpIcon /> : <ArrowDownIcon /> }
                                                </IconButton>
                                                { !isSmallScreen && user?.isEmailVerified &&
                                                    <IconButton size="small" onClick={event => openEntryOptions(event, entry)}>
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
                                                                        { t("general.entry.category") }
                                                                    </Typography>
                                                                    <Box style={{ paddingBottom: isExtraSmallScreen ? "6px" : "16px" }}>
                                                                        { showCategory(entry.categoryKeyword) }
                                                                    </Box>
                                                                </>
                                                            }
                                                            { isSmallScreen &&
                                                                <>
                                                                    <Typography variant="subtitle2">
                                                                        { t("general.entry.tags") }
                                                                    </Typography>
                                                                    <Box style={{ paddingBottom: isExtraSmallScreen ? "6px" : "16px" }}>
                                                                        <TagsComponent tagNames={entry.tags.map(t => t.name)} />
                                                                    </Box>
                                                                </>
                                                            }
                                                            <Typography variant="subtitle2">
                                                                { t("general.entry.description") }
                                                            </Typography>
                                                            <Typography variant="body2" style={{
                                                                    whiteSpace: "pre-line",
                                                                    overflowWrap: "anywhere",
                                                                    paddingBottom: isExtraSmallScreen ? "6px" : "16px" 
                                                                }}>
                                                                { entry.description || '—' }
                                                            </Typography>
                                                        </Box>
                                                        { isSmallScreen && user?.isEmailVerified &&
                                                            <IconButton size="small" onClick={event => openEntryOptions(event, entry)}>
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
                        <Menu anchorEl={entryOptionsAnchor}
                            open={entryOptionsOpen}
                            onClose={closeEntryOptions}
                        >
                            <MenuItem onClick={openEditEntryModal}>{t("pages.history.editEntry")}</MenuItem>
                            <MenuItem onClick={openDeleteEntryModal}>{t("pages.history.deleteEntry")}</MenuItem>
                        </Menu>
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

            <EditEntryModal
                open={editEntryModalOpen}
                onClose={onModalClose}
                categories={categories}
                tagNames={tagNames}
                entry={selectedEntry}
            />

            <DeleteEntryModal
                open={deleteEntryModalOpen}
                onClose={onModalClose}
                entry={selectedEntry}
            />
        </PageCardComponent>
    );
}
export default HistoryPage;