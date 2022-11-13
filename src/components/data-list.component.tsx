import { Grid, List, ListItem, Typography } from "@mui/material";

export interface DataRecord {
    name: string;
    value: JSX.Element | string;
}

interface IProps {
    data: DataRecord[];
    nameWidth?: number;
    size?: "small" | "medium";
    align?: "inherit" | "left" | "center" | "right" | "justify";
    breakLine?: "sm" | "md";
}

const DataListComponent: React.FC<IProps> = ({ data, nameWidth, size, align, breakLine }) => {
    return (
        <List sx={{ py: 0 }}>
            { data.map((record, index) => 
                <ListItem key={index} sx={ size === "small" ? { py: "4px", px: 0 } : {} }>
                    <Grid container alignItems="center" spacing={size === "small" ? 0 : "4px"}>
                        <Grid item xs={12} sm={breakLine === "sm" && (nameWidth || 4)} md={nameWidth || 4}>
                            <Typography variant="body1" align={align}>{record.name}:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={breakLine === "sm" && nameWidth ? 12 - nameWidth : 8} md={nameWidth ? 12 - nameWidth : 8}>
                            { typeof record.value === "string" ?
                                <Typography variant="body2" align={align}>{record.value}</Typography>
                                :
                                record.value
                            }
                        </Grid>
                    </Grid>
                </ListItem>
            ) }
        </List>
    );
}

export default DataListComponent;