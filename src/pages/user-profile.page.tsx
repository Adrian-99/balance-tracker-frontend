import { CheckCircleOutline as EmailVerifiedIcon } from "@mui/icons-material";
import { Grid, List, ListItem, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { AuthenticationContext } from "../components/authentication.provider";
import PageCardComponent from "../components/page-card.component"
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import UserData from "../data/user-data";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUserService } from "../hooks/user-service.hook";
import { CustomFormModalCloseReason } from "../modals/custom-form.modal";
import EditUserProfileModal from "../modals/edit-user-profile.modal";

const UserProfilePage: React.FC = () => {
    const { action } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const authenticationContext = useDebounce(useContext(AuthenticationContext), 10);
    const { getUserData } = useUserService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();

    const EDIT_MODAL_URL = "edit";
    const VERIFY_EMAIL_MODAL_URL = "verify-email";
    const ACTIONS = [
        { name: t("pages.userProfile.editUserData"), action: () => navigate(EDIT_MODAL_URL) },
        { name: t("pages.userProfile.verifyEmail"), action: () => navigate(VERIFY_EMAIL_MODAL_URL) }
    ];

    const [awaitingUserData, setAwaitingUserData] = useState(true);
    const [userData, setUserData] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        updateUserData();
    }, [authenticationContext]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateUserData = () => {
        setAwaitingUserData(true);
        getUserData()
            .then(data => {
                setUserData(data);
            }).catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
                setUserData(undefined);
            }).finally(() => {
                setAwaitingUserData(false);
            });
    };

    const onModalClose = (_reason: CustomFormModalCloseReason) => {
        navigate("/user-profile");
    };

    if (action && action !== EDIT_MODAL_URL && action !== VERIFY_EMAIL_MODAL_URL) {
        onModalClose("cancel");
    }

    return (
        <PageCardComponent title={t("pages.userProfile.title")} actions={
            userData ? 
                userData.isEmailVerified ?
                    ACTIONS.slice(0, 1) :
                    ACTIONS :
                undefined
        }>
            { !awaitingUserData && userData ?
                <List>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.username")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md="auto">
                                <Typography variant="body2">{userData.username}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={10} md={4}>
                                <Typography variant="body1">{t("user.email")}:</Typography>
                            </Grid>
                            <Grid item xs={10} md="auto">
                                <Typography variant="body2" display="flex" alignItems="center">
                                    {userData.email}
                                    { userData.isEmailVerified &&
                                        <Tooltip title={t("pages.userProfile.emailVerified") as string} arrow>
                                            <EmailVerifiedIcon sx={{ ml: "4px" }} />
                                        </Tooltip>
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.firstName")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2">{userData.firstName || "—"}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.lastName")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2">{userData.lastName || "—"}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                :
                <SpinnerOrNoDataComponent showSpinner={awaitingUserData} showNoData={!userData} />
            }
            {action === EDIT_MODAL_URL &&
                <EditUserProfileModal open={action === EDIT_MODAL_URL}
                    onClose={onModalClose}
                    userData={userData}
                    showSpinner={awaitingUserData} />
            }
        </PageCardComponent>
    );
}

export default UserProfilePage;
