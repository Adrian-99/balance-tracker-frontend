import { Box, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Category from "../data/category";
import { SelectValue } from "../data/statistics-enums";
import StatisticsRow from "../data/statistics.row";
import { useUtils } from "../hooks/utils.hook";
import CategoryComponent from "./category.component";
import DataListComponent from "./data-list.component";
import EntryTypeComponent from "./entry-type.component";
import TagsComponent from "./tags.component";

interface IProps {
    rowData: StatisticsRow;
    selectValues: SelectValue[];
    categories: Category[];
    groupByLevel: number;
}

const StatisticsTableRowComponent: React.FC<IProps> = ({ rowData, selectValues, categories, groupByLevel }) => {
    const { t } = useTranslation();
    const { isExtraSmallScreen, isSmallScreen, currencyValueString } = useUtils();

    const [subRowsExpanded, setSubRowsExpanded] = useState(false);

    const DATE_FORMAT = "YYYY.MM.DD";

    const evaluateGroup = (): JSX.Element => {
        if (rowData.dateFrom && rowData.dateTo) {
            if (moment.utc(rowData.dateFrom).startOf("day").isSame(moment.utc(rowData.dateTo).startOf("day"))) {
                return (
                    <Typography>
                        { moment.utc(rowData.dateFrom).format(DATE_FORMAT) }
                    </Typography>
                );
            } else {
                return (
                    <Typography>
                        { moment.utc(rowData.dateFrom).format(DATE_FORMAT) } — { moment.utc(rowData.dateTo).format(DATE_FORMAT) }
                    </Typography>
                )
            }
        } else if (rowData.entryType) {
            return <EntryTypeComponent entryType={rowData.entryType} />
        } else if (rowData.categoryKeyword) {
            let category = categories.find(c => c.keyword === rowData.categoryKeyword);
            if (category) {
                return <CategoryComponent category={category} />
            } else {
                return <Typography>—</Typography>;
            }
        } else if (rowData.tagName !== undefined && rowData.tagName !== null) {
            if (rowData.tagName.length > 0) {
                return <TagsComponent tagNames={[rowData.tagName]} />
            } else {
                return <Typography>{ t("pages.statistics.entriesWithoutTags") }</Typography>
            }
        } else {
            return <Typography>{ t("pages.statistics.allEntries") }</Typography>
        }
    };

    const evaluateValue = (valueType: SelectValue): string => {
        if (rowData.values) {
            if (valueType === SelectValue.COUNT) {
                return rowData.values?.count?.toString() || "";
            } else {
                return currencyValueString(rowData.values[valueType]);
            }
        } else {
            return "";
        }
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <Box ml={groupByLevel * (isExtraSmallScreen ? 8 : 32) + "px"}>
                        { evaluateGroup() }
                    </Box>
                </TableCell>
                { !isSmallScreen ?
                    selectValues.map((v, index) =>
                        <TableCell key={index} align="right">{ evaluateValue(v) }</TableCell>
                    )
                    :
                    <TableCell align="right">
                        { rowData.values &&
                            <DataListComponent
                                data={selectValues.map(v => { return {
                                    name: t("general.statistics.selectValueValue." + v),
                                    value: evaluateValue(v)
                                }})}
                                nameWidth={6}
                                size={isExtraSmallScreen ? "small" : "medium"}
                                align="right"
                                breakLine="sm"
                            />
                        }
                    </TableCell>
                }
            </TableRow>
            { rowData.subRows &&
                rowData.subRows.map((subRow, index) =>
                    <StatisticsTableRowComponent
                        key={index}
                        rowData={subRow}
                        selectValues={selectValues}
                        categories={categories}
                        groupByLevel={groupByLevel + 1}
                    />
                )
            }
        </>
    );
}

export default StatisticsTableRowComponent;