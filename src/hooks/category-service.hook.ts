import { useContext } from "react";
import { ApplicationContext } from "../components/application-context.provider";
import ApiResponse from "../data/api-response";
import Category from "../data/category";

export const useCategoryService = () => {
    const { http } = useContext(ApplicationContext);

    const getAllCategories = (): Promise<ApiResponse<Category[]>> => {
        return http.get<ApiResponse<Category[]>>("/category")
            .then(response => response.data);
    };

    return { getAllCategories };
};