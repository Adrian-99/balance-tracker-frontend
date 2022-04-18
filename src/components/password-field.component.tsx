import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
    label: string;
    useFormRegister: UseFormRegisterReturn,
    fullWidth?: boolean | undefined,
    error?: boolean | undefined,
    helperText?: string,
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
}

const PasswordFieldComponent: React.FC<IProps> = ({ label, useFormRegister, fullWidth, error, helperText, onChange }) => {
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);

    const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = event => {
        useFormRegister.onChange(event);
        if (onChange) {
            onChange(event);
        }
    }

    return (
        <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth={fullWidth} error={error}>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                {...useFormRegister}
                endAdornment={
                    <InputAdornment position="end">
                        <Tooltip title={t(showPassword ? 'password.hide' : 'password.show') as string} arrow>
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                }
                label={label}
                onChange={onInputChange}
            />
            <FormHelperText>
                {helperText}
            </FormHelperText>
        </FormControl>
    );
}

export default PasswordFieldComponent;