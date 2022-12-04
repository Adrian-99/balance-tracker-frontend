import { Button, Divider, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../components/application-context.provider";
import CategoryComponent from "../components/category.component";
import DataListComponent from "../components/data-list.component";
import EntryTypeComponent from "../components/entry-type.component";
import PageCardComponent from "../components/page-card.component";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import StatisticsTableRowComponent from "../components/statistics-table-row.component";
import TableHeaderComponent from "../components/table-header.component";
import TagsComponent from "../components/tags.component";
import Category from "../data/category";
import { EntryType } from "../data/statistics-enums";
import StatisticsResponse from "../data/statistics-response";
import { useCategoryService } from "../hooks/category-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUtils } from "../hooks/utils.hook";
import GenerateNewStatisticsModal from "../modals/generate-new-statistics.modal";

const StatisticsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useContext(ApplicationContext);
    const { getAllCategories } = useCategoryService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { isSmallScreen, isExtraSmallScreen } = useUtils();

    const ACTIONS = user?.isEmailVerified ?
        [ { name: t("pages.statistics.generateNewStatistics"), action: () => setGenerateNewStatisticsModalOpen(true) } ] :
        [];
    const DATE_FORMAT = "YYYY.MM.DD";
    const QUERY_DATE_FORMAT = "YYYY-MM-DD";

    const [generateNewStatisticsModalOpen, setGenerateNewStatisticsModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [statisticsResponse, setStatisticsResponse] = useState<StatisticsResponse>();

    useEffect(() => {
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            });
        
        if (user?.isEmailVerified && !statisticsResponse) {
            setGenerateNewStatisticsModalOpen(true);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onGenerateNewStatisticsModalClose = (statisticsResponse?: StatisticsResponse) => {
        if (statisticsResponse) {
            setStatisticsResponse(statisticsResponse);
        }
        setGenerateNewStatisticsModalOpen(false);
    };

    const showCategoriesFilter = (keywords: string[]): JSX.Element => {
        return (
            <Box display="flex" flexWrap="wrap" columnGap="16px" rowGap="4px">
                { keywords.map(k => categories.find(c => c.keyword === k))
                    .filter(c => c !== undefined)
                    .map(c => c as Category)
                    .map((c, index) => <CategoryComponent key={index} category={c} typographyVariant="body2" />)
                }

            </Box>
        );
    };

    const getHistoryLink = (): string => {
        let query = "";
        if (statisticsResponse?.dateFromFilter && statisticsResponse?.dateToFilter) {
            query = `${query}&dateFrom=${moment(statisticsResponse.dateFromFilter).format(QUERY_DATE_FORMAT)}&dateTo=${moment(statisticsResponse.dateToFilter).format(QUERY_DATE_FORMAT)}`;
        }
        let categoryKeywords = statisticsResponse?.categoryFilter || [];
        if (statisticsResponse?.entryTypeFilter) {
            if (categoryKeywords.length > 0) {
                categoryKeywords = categoryKeywords.filter(ck => {
                    let category = categories.find(c => c.keyword === ck);
                    return category && (statisticsResponse.entryTypeFilter === EntryType.INCOME ? category.isIncome : !category?.isIncome);
                });
            } else {
                categoryKeywords = categories
                    .filter(c => statisticsResponse.entryTypeFilter === EntryType.INCOME ? c.isIncome : !c?.isIncome)
                    .map(c => c.keyword);
            }
        }
        if (categoryKeywords.length > 0) {
            query = `${query}&categoriesKeywords=${categoryKeywords.join(',')}`;
        }
        if (statisticsResponse?.tagFilter) {
            query = `${query}&tagNames=${statisticsResponse.tagFilter.join(',')}`;
        }
        if (query.length > 0) {
            query = '?' + query.slice(1);
        }
        return "/history" + query;        
    };

    return (
        <PageCardComponent title={t("pages.statistics.title")} width={12} actions={ACTIONS}>
            { statisticsResponse ?
                <>
                    <DataListComponent
                        nameWidth={2}
                        data={[
                            ...(statisticsResponse.dateFromFilter && statisticsResponse.dateToFilter ? [{
                                name: t("general.statistics.filterByValue.dateRange"),
                                value: `${moment(statisticsResponse.dateFromFilter).format(DATE_FORMAT)} — ${moment(statisticsResponse.dateToFilter).format(DATE_FORMAT)}`
                            }]: []),
                            ...(statisticsResponse.entryTypeFilter ? [{
                                name: t("general.statistics.filterByValue.entryType"),
                                value: <EntryTypeComponent entryType={statisticsResponse.entryTypeFilter} typographyVariant="body2" />
                            }] : []),
                            ...(statisticsResponse.categoryFilter ? [{
                                name: t("general.statistics.filterByValue.categories"),
                                value: showCategoriesFilter(statisticsResponse.categoryFilter)
                            }] : []),
                            ...(statisticsResponse.tagFilter ? [{
                                name: t("general.statistics.filterByValue.tags"),
                                value: <TagsComponent tagNames={statisticsResponse.tagFilter} />
                            }] : []),
                            {
                                name: t("pages.statistics.entriesCount"),
                                value: statisticsResponse.entriesCount.toString()
                            }
                        ]}
                    />
                    { statisticsResponse.entriesCount > 0 &&
                        <Button to={getHistoryLink()} component={Link} sx={{ ml: "16px" }}>
                            { t("pages.statistics.viewEntries") }
                        </Button>
                    }

                    <Divider sx={{ my: "16px" }} />

                    <TableContainer>
                        <Table stickyHeader style={{ tableLayout: "fixed" }} size={isExtraSmallScreen ? "small" : "medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderComponent
                                        columnKey="group"
                                        columnLabel={t("pages.statistics.entriesGroup")}
                                    />
                                    { !isSmallScreen ?
                                        statisticsResponse.selectValues.map((v, index) => 
                                            <TableHeaderComponent
                                                key={index}
                                                columnKey={v}
                                                columnLabel={t("general.statistics.selectValueValue." + v)}
                                                tableCellProps={{ align: "right", width: "100px" }}
                                            />
                                        )
                                        :
                                        <TableHeaderComponent
                                            columnKey="values"
                                            columnLabel={t("pages.statistics.values")}
                                            tableCellProps={{ align: "right" }}
                                        />
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { statisticsResponse.rows.map((row, index) =>
                                    <StatisticsTableRowComponent
                                        key={index}
                                        rowData={row}
                                        selectValues={statisticsResponse.selectValues}
                                        categories={categories}
                                        groupByLevel={0}
                                    />
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
                :
                <SpinnerOrNoDataComponent showNoData={true} showSpinner={false} />
            }

            <GenerateNewStatisticsModal
                open={generateNewStatisticsModalOpen}
                onClose={onGenerateNewStatisticsModalClose}
                categories={categories}
            />
        </PageCardComponent>
    );
}

export default StatisticsPage;