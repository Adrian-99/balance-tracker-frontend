import { Box, Chip, Typography } from "@mui/material";

interface IProps {
    tagNames: string[];
}

const TagsComponent: React.FC<IProps> = ({ tagNames }) => {
    if (tagNames.length) {
        return (
            <Box display="flex" gap="4px">
                {tagNames.map(tagName => 
                    <Chip key={tagName} size="small" label={tagName}/>
                )}
            </Box>
        );
    } else {
        return (
            <Typography variant="inherit" key="no-tag">—</Typography>
        );
    }
}

export default TagsComponent;