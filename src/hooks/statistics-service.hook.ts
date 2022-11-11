import { useContext } from "react"
import { ApplicationContext } from "../components/application-context.provider"
import ApiResponse from "../data/api-response";
import StatisticsRequest from "../data/statistics-request";
import StatisticsResponse from "../data/statistics-response";

export const useStatisticsService = () => {
    const { http } = useContext(ApplicationContext);

    const generateStatistics = (statisticsRequest: StatisticsRequest): Promise<ApiResponse<StatisticsResponse>> => {
        return http.post("/statistics", statisticsRequest)
            .then(response => response.data);
    };

    return { generateStatistics };
}