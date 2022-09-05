import moment from "moment";
import { useContext } from "react"
import { ApplicationContext } from "../components/application-context.provider"
import ApiResponse from "../data/api-response";
import EditEntry from "../data/edit-entry";
import Entry from "../data/entry";
import EntryFilter from "../data/entry-filter";
import Page from "../data/page";
import Pageable from "../data/pageable";

export const useEntryService = () => {
    const DATE_FORMAT = "YYYY-MM-DD";

    const { http } = useContext(ApplicationContext);

    const getEntriesPaged = (parameters: Pageable & EntryFilter): Promise<Page<Entry>> => {
        const params = {
            pageNumber: parameters.pageNumber,
            pageSize: parameters.pageSize,
            sortBy: (parameters.sortDescending ? '-' : '') + parameters.sortBy,
            searchValue: parameters.searchValue,
            dateFrom: parameters.dateFrom !== null ? moment(parameters.dateFrom).format(DATE_FORMAT) : null,
            dateTo: parameters.dateTo !== null ? moment(parameters.dateTo).format(DATE_FORMAT) : null,
            categoriesKeywords: parameters.categoriesKeywords?.join(','),
            tagsNames: parameters.tagsNames?.join(',')
        }
        return http.get<Page<Entry>>("/entry", { params })
            .then(response => response.data);
    };

    const createEntry = (data: EditEntry): Promise<ApiResponse<string>> => {
        return http.post<ApiResponse<string>>("/entry", data)
            .then(response => response.data);
    }

    return { getEntriesPaged, createEntry };
}