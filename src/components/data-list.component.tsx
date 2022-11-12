import { Grid, List, ListItem, Typography } from "@mui/material";

export interface DataRecord {
    name: string;
    value: JSX.Element | string;
}

interface IProps {
    nameWidth?: number;
    data: DataRecord[];
}

const DataListComponent: React.FC<IProps> = ({ nameWidth, data }) => {
    return (
        <List>
            { data.map(record => 
                <ListItem>
                    <Grid container alignItems="center" spacing="4px">
                        <Grid item xs={12} md={nameWidth || 4}>
                            <Typography variant="body1">{record.name}:</Typography>
                        </Grid>
                        <Grid item xs={12} md={nameWidth ? 12 - nameWidth : 8}>
                            { typeof record.value === "string" ?
                                <Typography variant="body2">{record.value}</Typography>
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