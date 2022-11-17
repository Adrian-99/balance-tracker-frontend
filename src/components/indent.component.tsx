import { Box, Divider } from "@mui/material";

interface IProps {
    widthPx: number;
    divider?: boolean;
}

const IndentComponent: React.FC<IProps> = ({ widthPx, divider }) => {
    if (divider) {
        return <Divider sx={{ mx: widthPx / 2 + "px" }} orientation="vertical" flexItem />;
    } else {
        return <Box width={widthPx + "px"} height="100%"></Box>;
    }
}

export default IndentComponent;