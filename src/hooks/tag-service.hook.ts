import { useContext } from "react"
import { ApplicationContext } from "../components/application-context.provider"
import ApiResponse from "../data/api-response";
import Tag from "../data/tag";

export const useTagService = () => {
    const { http } = useContext(ApplicationContext);

    const getAllTags = (): Promise<ApiResponse<Tag[]>> => {
        return http.get<ApiResponse<Tag[]>>("/tag")
            .then(response => response.data);
    }

    return { getAllTags };
}