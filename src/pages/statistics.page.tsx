import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationContext } from "../components/application-context.provider";
import PageCardComponent from "../components/page-card.component";
import Category from "../data/category";
import StatisticsResponse from "../data/statistics-response";
import { useCategoryService } from "../hooks/category-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import GenerateNewStatisticsModal from "../modals/generate-new-statistics.modal";

const StatisticsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useContext(ApplicationContext);
    const { getAllCategories } = useCategoryService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();

    const ACTIONS = user?.isEmailVerified ?
        [ { name: t("pages.statistics.generateNewStatistics"), action: () => setGenerateNewStatisticsModalOpen(true) } ] :
        [];

    const [generateNewStatisticsModalOpen, setGenerateNewStatisticsModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [statisticsResponse, setStatisticsResponse] = useState<StatisticsResponse>();

    useEffect(() => {
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onGenerateNewStatisticsModalClose = (statisticsResponse?: StatisticsResponse) => {
        if (statisticsResponse) {
            setStatisticsResponse(statisticsResponse);
        }
        setGenerateNewStatisticsModalOpen(false);
    };

    return (
        <PageCardComponent title={t("pages.statistics.title")} width={12} actions={ACTIONS}>

            <GenerateNewStatisticsModal
                open={generateNewStatisticsModalOpen}
                onClose={onGenerateNewStatisticsModalClose}
                categories={categories}
            />
        </PageCardComponent>
    );
}

export default StatisticsPage;