import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export const useCustomToast = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const successToast = (backendTranslationKey?: string | undefined) => {
        anyToast("success", backendTranslationKey);
    }
    
    const errorToast = (backendTranslationKey?: string | undefined) => {
        anyToast("error", backendTranslationKey);
    }
    
    const anyToast = (variant: "success" | "error", backendTranslationKey?: string | undefined) => {
        var message = backendTranslationKey ?
                t("backend." + backendTranslationKey) :
                t("toast." + variant);
    
        enqueueSnackbar(message, { variant });
    }

    return { successToast, errorToast };
}