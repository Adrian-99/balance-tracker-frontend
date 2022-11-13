import { TableCell, TableCellProps, TableSortLabel } from "@mui/material";

interface IProps {
    columnKey: string;
    columnLabel: string;
    tableCellProps?: TableCellProps;
    sortable?: boolean;
    sortBy?: string;
    sortDescending?: boolean;
    onSortChange?: (columnKey: string) => void;
}

const TableHeaderComponent: React.FC<IProps> = ({ columnKey, columnLabel, tableCellProps, sortable, sortBy, sortDescending, onSortChange }) => {
    return (
        <TableCell key={columnKey} {...tableCellProps}>
            { sortable ?
                <TableSortLabel
                    active={sortBy === columnKey}
                    direction={sortBy === columnKey && sortDescending ? "desc" : "asc"}
                    onClick={() => onSortChange && onSortChange(columnKey)}
                >
                    { columnLabel }
                </TableSortLabel>
                :
                columnLabel
            }
        </TableCell>
    )
}

export default TableHeaderComponent;