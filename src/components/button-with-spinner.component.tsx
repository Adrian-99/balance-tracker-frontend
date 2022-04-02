import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";

interface IProps {
    buttonText: string;
    variant?: "text" | "contained" | "outlined" | undefined;
    submitButton?: boolean | undefined;
    enableSpinner: boolean;
}

const ButtonWithSpinnerComponent: React.FC<IProps> = ({ buttonText, variant, submitButton, enableSpinner }) => {
    return (
        <Box position="relative">
            <Button variant={variant}
                size="large"
                type={submitButton ? "submit" : "button"}
                disabled={enableSpinner}
            >
                {buttonText}
            </Button>
            {enableSpinner && 
                <CircularProgress size={26}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-13px',
                        marginLeft: '-13px',
                    }}
                />
            }
        </Box>
    )
}

export default ButtonWithSpinnerComponent;