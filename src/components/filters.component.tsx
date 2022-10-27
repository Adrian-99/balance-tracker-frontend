import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUtils } from "../hooks/utils.hook";

interface IProps {
    renderFiltersForm: (horizontally: boolean) => JSX.Element;
    isFilterSet: boolean;
    clearFilters: () => void;
}

const FiltersComponent: React.FC<IProps> = ({ renderFiltersForm, isFilterSet, clearFilters }) => {
    const { t } = useTranslation();
    const { isSmallScreen } = useUtils();

    return (
        <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} gap="8px" alignItems="center">
            { isSmallScreen ?
                <Accordion elevation={0} sx={{ border: "solid 1px", borderColor: "grey.300", width: "100%" }}>
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
                        { renderFiltersForm(false) }
                    </AccordionDetails>
                </Accordion>
                :
                renderFiltersForm(true)
            }
            { isFilterSet &&
                <Button variant="text" onClick={clearFilters}>
                    { t("general.clearFilters") }
                </Button>
            }
        </Box>
    );
}

export default FiltersComponent;