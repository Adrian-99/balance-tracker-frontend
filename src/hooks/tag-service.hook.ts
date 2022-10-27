import { useContext } from "react"
import { ApplicationContext } from "../components/application-context.provider"
import ApiResponse from "../data/api-response";
import EditTag from "../data/edit-tag";
import Page from "../data/page";
import Pageable from "../data/pageable";
import Tag from "../data/tag";
import TagFilter from "../data/tag-filter";

export const useTagService = () => {
    const { http } = useContext(ApplicationContext);

    const getTagNames = (): Promise<ApiResponse<string[]>> => {
        return http.get<ApiResponse<string[]>>("/tag/name")
            .then(response => response.data);
    };

    const getTagsPaged = (parameters: Pageable & TagFilter): Promise<Page<Tag>> => {
        const params = {
            pageNumber: parameters.pageNumber,
            pageSize: parameters.pageSize,
            sortBy: (parameters.sortDescending ? '-' : '') + parameters.sortBy,
            searchValue: parameters.searchValue
        }
        return http.get<Page<Tag>>("/tag", { params })
            .then(response => response.data);
    };

    const createTag = (data: EditTag): Promise<ApiResponse<string>> => {
        return http.post<ApiResponse<string>>("/tag", data)
            .then(response => response.data);
    }

    const editTag = (id: string, data: EditTag): Promise<ApiResponse<string>> => {
        return http.put<ApiResponse<string>>(`/tag/${id}`, data)
            .then(response => response.data);
    }

    return { getTagNames, getTagsPaged, createTag, editTag };
}