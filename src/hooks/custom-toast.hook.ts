import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export const useCustomToast = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const successToast = (message?: string | undefined) => {
        enqueueSnackbar(message ? message : t("toast.success"), { variant: "success" });
    }
    
    const errorToast = (message?: string | undefined) => {
        enqueueSnackbar(message ? message : t("toast.error"), { variant: "error" });
    }

    const evaluateBackendMessage = (translationKey: string | undefined, translationParams: any = undefined): string | undefined => {
        return translationKey ? 
            t("backend." + translationKey, translationParams) : 
            undefined;
    }

    return { successToast, errorToast, evaluateBackendMessage };
}