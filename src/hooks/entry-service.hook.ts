import { useContext } from "react"
import { ApplicationContext } from "../components/application-context.provider"
import Entry from "../data/entry";
import EntryFilter from "../data/entry-filter";
import Page from "../data/page";
import Pageable from "../data/pageable";

export const useEntryService = () => {
    const { http } = useContext(ApplicationContext);

    const getEntriesPaged = (parameters: Pageable & EntryFilter): Promise<Page<Entry>> => {
        const params = {
            pageNumber: parameters.pageNumber,
            pageSize: parameters.pageSize,
            sortBy: (parameters.sortDescending ? '-' : '') + parameters.sortBy,
            searchValue: parameters.searchValue,
            dateFrom: parameters.dateFrom?.toDateString(),
            dateTo: parameters.dateTo?.toDateString(),
            categoriesKeywords: parameters.categoriesKeywords?.join(','),
            tagNames: parameters.tagNames?.join(',')
        }
        return http.get<Page<Entry>>("/entry", { params })
            .then(response => response.data);
    };

    return { getEntriesPaged };
}