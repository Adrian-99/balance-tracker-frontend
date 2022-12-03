import { MoreVert as MoreIcon } from "@mui/icons-material";
import { Box, Button, createTheme, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Typography, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { ApplicationContext } from "../components/application-context.provider";
import FiltersComponent from "../components/filters.component";
import PageCardComponent from "../components/page-card.component"
import SearchFieldComponent from "../components/search-field.component";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import TableHeaderComponent from "../components/table-header.component";
import Page from "../data/page";
import Pageable from "../data/pageable";
import Tag from "../data/tag";
import TagFilter from "../data/tag-filter";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { useUtils } from "../hooks/utils.hook";
import { ConfirmationModalCloseReason } from "../modals/confirmation.modal";
import { CustomFormModalCloseReason } from "../modals/custom-form.modal";
import DeleteTagModal from "../modals/delete-tag.modal";
import EditTagModal from "../modals/edit-tag.modal";

export const TagsPage: React.FC = () => {
    const { register, handleSubmit, setValue, reset } = useForm<TagFilter>();
    const { t } = useTranslation();
    const { getTagsPaged } = useTagService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { isExtraSmallScreen } = useUtils();
    const { user } = useContext(ApplicationContext);

    const THEME = createTheme(useTheme(), plPL);

    const PAGE_NUMBER = "pageNumber";
    const PAGE_SIZE = "pageSize";
    const SORT_BY = "sortBy";
    const SEARCH_VALUE = "searchValue";

    const ACTIONS = user?.isEmailVerified ?
        [ { name: t("pages.tags.addTag"), action: () => openAddTagModal() } ] :
        [];

    const [searchParams, setSearchParams] = useSearchParams();
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);
    const [isFilterSet, setIsFilterSet] = useState<boolean>(false);
    const [tagParams, setTagParams] = useState<Pageable & TagFilter>({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "name",
        sortDescending: false,
        searchValue: null
    });
    const [tagsPage, setTagsPage] = useState<Page<Tag> | undefined>();
    const [editTagModalOpen, setEditTagModalOpen] = useState(false);
    const [deleteTagModalOpen, setDeleteTagModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const [tagOptionsAnchor, setTagOptionsAnchor] = useState<null | HTMLElement>(null);
    const tagOptionsOpen = Boolean(tagOptionsAnchor);

    useEffect(() => {
        let sortBy = searchParams.get(SORT_BY) || "name";
        if (sortBy.startsWith('-')) {
            sortBy = sortBy.substring(1);
        }
        let sortByTyped: "name" | "entriesCount";
        let sortByCorrect: boolean;
        if (sortBy === "name" || sortBy === "entriesCount") {
            sortByTyped = sortBy;
            sortByCorrect = true;
        } else {
            sortByTyped = "name";
            sortByCorrect = false;
        }

        const params = {
            pageNumber: Number.parseInt(searchParams.get(PAGE_NUMBER) || '1'),
            pageSize: Number.parseInt(searchParams.get(PAGE_SIZE) || '10'),
            sortBy: sortByTyped,
            sortDescending: (searchParams.get(SORT_BY)?.startsWith('-') && sortByCorrect) || false,
            searchValue: searchParams.get(SEARCH_VALUE) || null
        };

        setValue("searchValue", params.searchValue);

        setIsFilterSet(params.searchValue !== null);

        if (sortByCorrect) {
            setTagParams(params);
            getTags(params);
        } else {
            updateQueryParams(params);
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const getTags = (params?: Pageable & TagFilter) => {
        setAwaitingResponse(true);
        getTagsPaged(params || tagParams)
            .then(response => {
                setTagsPage(response);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    const onSortChange = (sortColumn: string) => {
        if (sortColumn === tagParams.sortBy) {
            updateQueryParams({ ...tagParams, pageNumber: 1, sortDescending: !tagParams.sortDescending });
        } else if (sortColumn === "name" || sortColumn === "entriesCount") {
            updateQueryParams({ ...tagParams, pageNumber: 1, sortBy: sortColumn, sortDescending: false });
        } else {
            updateQueryParams({ ...tagParams, pageNumber: 1, sortBy: "name", sortDescending: false });
        }
    }

    const onPageChange = (page: number) => {
        updateQueryParams({ ...tagParams, pageNumber: page + 1 });
    }

    const onRowsPerPageChange = (rowsPerPage: number) => {
        updateQueryParams({ ...tagParams, pageNumber: 1, pageSize: rowsPerPage });
    }

    const onFilterSubmit: SubmitHandler<TagFilter> = data => {
        updateQueryParams({ ...tagParams, pageNumber: 1, searchValue: data.searchValue });
    }

    const clearFilters = () => {
        reset();
        updateQueryParams({
            pageNumber: 1,
            pageSize: tagParams.pageSize,
            sortBy: tagParams.sortBy,
            sortDescending: tagParams.sortDescending,
            searchValue: null
        });
    }

    const updateQueryParams = (newParams: Pageable & TagFilter) => {
        setSearchParams({
            ...(newParams.pageNumber !== 1 && { [PAGE_NUMBER]: newParams.pageNumber.toString() }),
            ...(newParams.pageSize !== 10 && { [PAGE_SIZE]: newParams.pageSize.toString() }),
            ...((newParams.sortBy !== "name" || newParams.sortDescending) && { [SORT_BY]: (newParams.sortDescending ? '-' : '') + newParams.sortBy }),
            ...(newParams.searchValue && { [SEARCH_VALUE]: newParams.searchValue })
        });
    }

    const openTagOptions = (event: React.MouseEvent<HTMLButtonElement>, tag: Tag) => {
        setTagOptionsAnchor(event.currentTarget);
        setSelectedTag(tag);
    }

    const closeTagOptions = () => {
        setTagOptionsAnchor(null);
    }

    const openAddTagModal = () => {
        if (!editTagModalOpen && !deleteTagModalOpen) {
            setSelectedTag(undefined);
            setEditTagModalOpen(true);
        }
    }

    const openEditTagModal = () => {
        if (!editTagModalOpen && !deleteTagModalOpen) {
            setEditTagModalOpen(true);
            closeTagOptions();
        }
    }

    const openDeleteTagModal = () => {
        if (!editTagModalOpen && !deleteTagModalOpen) {
            setDeleteTagModalOpen(true);
            closeTagOptions();
        }
    }

    const onModalClose = (reason: CustomFormModalCloseReason | ConfirmationModalCloseReason) => {
        setSelectedTag(undefined);
        setEditTagModalOpen(false);
        setDeleteTagModalOpen(false);
        if (reason === "save" || reason === "yes") {
            getTags();
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
                </Box>
            </form>
        );
    }

    return (
        <PageCardComponent title={t("pages.tags.title")} width={12} actions={ACTIONS}>
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
                                columnKey="name"
                                columnLabel={t("general.tag.name")}
                                sortable={true}
                                sortBy={tagParams.sortBy}
                                sortDescending={tagParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            <TableHeaderComponent
                                columnKey="entriesCount"
                                columnLabel={t("general.tag.entriesCount")}
                                sortable={true}
                                sortBy={tagParams.sortBy}
                                sortDescending={tagParams.sortDescending}
                                onSortChange={onSortChange}
                            />
                            { user?.isEmailVerified &&
                                <TableCell key="actionButtons" style={{ width: "34px" }} />
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { !awaitingResponse && tagsPage?.data.length ?
                            React.Children.toArray(
                                tagsPage.data.map(tag =>
                                    <TableRow>
                                        <TableCell>{tag.name}</TableCell>
                                        <TableCell>
                                            <Box display="flex" flexWrap="wrap" columnGap="4px" alignItems="center">
                                                <Typography variant="inherit">{tag.entriesCount}</Typography>
                                                { tag.entriesCount !== undefined && tag.entriesCount > 0 &&
                                                    <Button size={isExtraSmallScreen ? "small" : "medium"}
                                                        sx={{...(!isExtraSmallScreen && { lineHeight: 1.5 })}}
                                                        to={"/history?tagNames=" + tag.name} component={Link}
                                                    >
                                                        {t("general.view")}
                                                    </Button>
                                                }
                                            </Box>
                                        </TableCell>
                                        { user?.isEmailVerified &&
                                            <TableCell style={{ width: "34px" }}>
                                                <IconButton size="small" onClick={event => openTagOptions(event, tag)}>
                                                    <MoreIcon />
                                                </IconButton>
                                            </TableCell>
                                        }
                                    </TableRow>
                                )
                            )
                            :
                            <TableRow>
                                <TableCell colSpan={user?.isEmailVerified ? 3 : 2}>
                                    <SpinnerOrNoDataComponent showSpinner={awaitingResponse} showNoData={!tagsPage?.data.length} />
                                </TableCell>
                            </TableRow>
                        }
                        <Menu anchorEl={tagOptionsAnchor}
                            open={tagOptionsOpen}
                            onClose={closeTagOptions}
                        >
                            <MenuItem onClick={openEditTagModal}>{t("pages.tags.editTag")}</MenuItem>
                            <MenuItem onClick={openDeleteTagModal}>{t("pages.tags.deleteTag")}</MenuItem>
                        </Menu>
                    </TableBody>
                </Table>
                <ThemeProvider theme={THEME}>
                    <TablePagination
                        component="div"
                        count={tagsPage?.totalCount || 0}
                        page={tagParams.pageNumber - 1}
                        rowsPerPage={tagParams.pageSize}
                        showFirstButton={!isExtraSmallScreen}
                        showLastButton={!isExtraSmallScreen}
                        onPageChange={(_event, page) => onPageChange(page)}
                        onRowsPerPageChange={(event) => onRowsPerPageChange(Number.parseInt(event.target.value))}
                    />
                </ThemeProvider>
            </TableContainer>

            <EditTagModal
                open={editTagModalOpen}
                onClose={onModalClose}
                tag={selectedTag}
            />

            <DeleteTagModal
                open={deleteTagModalOpen}
                onClose={onModalClose}
                tag={selectedTag}
            />

        </PageCardComponent>
    );
}