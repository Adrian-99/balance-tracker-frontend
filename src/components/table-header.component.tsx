import { TableCell, TableSortLabel } from "@mui/material";

interface IProps {
    columnKey: string;
    columnLabel: string;
    align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
    sortable?: boolean;
    sortBy?: string;
    sortDescending?: boolean;
    onSortChange?: (columnKey: string) => void;
}

const TableHeaderComponent: React.FC<IProps> = ({ columnKey, columnLabel, align, sortable, sortBy, sortDescending, onSortChange }) => {
    return (
        <TableCell key={columnKey} align={align ? align : "inherit"}>
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