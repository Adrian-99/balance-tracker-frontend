import { KeyboardArrowDown as ArrowDownIcon, KeyboardArrowUp as ArrowUpIcon, MoreVert as MoreIcon } from "@mui/icons-material";
import { Chip, Collapse, createTheme, IconButton, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip, Typography, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import { Box } from "@mui/system";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import PageCardComponent from "../components/page-card.component";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import TableHeaderComponent from "../components/table-header.component";
import Category from "../data/category";
import Entry from "../data/entry";
import EntryFilter from "../data/entry-filter";
import Page from "../data/page";
import Pageable from "../data/pageable";
import { useCategoryService } from "../hooks/category-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useEntryService } from "../hooks/entry-service.hook";
import { useUtils } from "../hooks/utils.hook";

const HistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const { getAllCategories } = useCategoryService();
    const { getEntriesPaged } = useEntryService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { relativeDateString, currencyValueString } = useUtils();

    const THEME = createTheme(useTheme(), plPL);

    const PAGE_NUMBER = "pageNumber";
    const PAGE_SIZE = "pageSize";
    const SORT_BY = "sortBy";
    const SEARCH_VALUE = "searchValue";
    const DATE_FROM = "dateFrom";
    const DATE_TO = "dateTo";
    const CATEGORIES_KEYWORDS = "categoriesKeywords";
    const TAG_NAMES = "tagNames";
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);
    const [entryParams, setEntryParams] = useState<Pageable & EntryFilter>({
        pageNumber: 0,
        pageSize: 10,
        sortBy: "date",
        sortDescending: true
    });

    const [categories, setCategories] = useState<Category[]>([]);
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
            searchValue: searchParams.get(SEARCH_VALUE) || undefined,
            dateFrom: dateFromString ? new Date(dateFromString) : undefined,
            dateTo: dateToString ? new Date(dateToString) : undefined,
            categoriesKeywords: searchParams.get(CATEGORIES_KEYWORDS)?.split(','),
            tagNames: searchParams.get(TAG_NAMES)?.split(',')
        };

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

    const updateQueryParams = (newParams: Pageable & EntryFilter) => {
        setSearchParams({
            ...(newParams.pageNumber !== 1 && { [PAGE_NUMBER]: newParams.pageNumber.toString() }),
            ...(newParams.pageSize !== 10 && { [PAGE_SIZE]: newParams.pageSize.toString() }),
            ...((newParams.sortBy !== "date" || !newParams.sortDescending) && { [SORT_BY]: (newParams.sortDescending ? '-' : '') + newParams.sortBy }),
            ...(newParams.searchValue && { [SEARCH_VALUE]: newParams.searchValue }),
            ...(newParams.dateFrom && { [DATE_FROM]: newParams.dateFrom.toDateString() }),
            ...(newParams.dateTo && { [DATE_TO]: newParams.dateTo.toDateString() }),
            ...(newParams.categoriesKeywords && { [CATEGORIES_KEYWORDS]: newParams.categoriesKeywords.join(',') }),
            ...(newParams.tagNames && { [TAG_NAMES]: newParams.tagNames.join(',') }),
        });
    }

    const expandRow = (rowIndex: number) => {
        let expandedRowsCopy = new Array(...expandedRows);
        expandedRowsCopy[rowIndex] = !expandedRowsCopy[rowIndex];
        setExapndedRows(expandedRowsCopy);
    }

    const showCategory = (categoryKeyword: string): JSX.Element => {
        let category = categories.find(c => c.keyword === categoryKeyword);
        if (category) {
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
        } else {
            return <Box>—</Box>;
        }
    }

    return (
        <PageCardComponent title={t("pages.history.title")} width={12}>
            <TableContainer>
                <Table style={{ tableLayout: "fixed" }}>
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
                            <TableHeaderComponent
                                columnKey="category"
                                columnLabel={t("pages.history.header.category")}
                            />
                            <TableHeaderComponent
                                columnKey="tags"
                                columnLabel={t("pages.history.header.tags")}
                            />
                            <TableHeaderComponent
                                columnKey="value"
                                columnLabel={t("pages.history.header.value")}
                                align="right"
                                sortable={true}
                                sortBy={entryParams.sortBy}
                                sortDescending={entryParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableCell key="expandDetailsButton" style={{ width: "32px", paddingRight: "4px" }} />
                            <TableCell key="moreButton" style={{ width: "32px", paddingLeft: "4px" }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { !awaitingResponse && entriesPage?.data.length ?
                            React.Children.toArray(
                                entriesPage.data.map((entry, index) =>
                                    <>
                                        <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
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
                                            <TableCell>{ showCategory(entry.categoryKeyword) }</TableCell>
                                            <TableCell>
                                                { entry.tags.length ?
                                                    entry.tags.map(tag =>
                                                        <Chip key={tag} size="small" label={tag}/>
                                                    )
                                                :
                                                    '—'
                                                }
                                            </TableCell>
                                            <TableCell align="right" style={{ borderBottom: "none" }}>
                                                { currencyValueString(entry.value) }
                                            </TableCell>
                                            <TableCell style={{ width: "32px", padding: "0px 4px 0px 16px" }}>
                                                <IconButton size="small" onClick={() => expandRow(index)}>
                                                    { expandedRows[index] ? <ArrowUpIcon /> : <ArrowDownIcon /> }
                                                </IconButton>
                                            </TableCell>
                                            <TableCell style={{ width: "32px", padding: "0px 16px 0px 4px" }}>
                                                <IconButton size="small">
                                                    <MoreIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
                                                    <Typography variant="subtitle2">
                                                        { t("pages.history.header.description") }
                                                    </Typography>
                                                    <Typography variant="body2" style={{ paddingBottom: "16px" }}>
                                                        { entry.description || '—' }
                                                    </Typography>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )
                            )
                            :
                            <TableRow>
                                <TableCell colSpan={7}>
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
                        showFirstButton={true}
                        showLastButton={true}
                        onPageChange={(_event, page) => onPageChange(page)}
                        onRowsPerPageChange={(event) => onRowsPerPageChange(Number.parseInt(event.target.value))}
                    />
                </ThemeProvider>
            </TableContainer>
        </PageCardComponent>
    );
}
export default HistoryPage;