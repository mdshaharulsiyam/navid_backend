import { PipelineStage } from "mongoose";

const escapeRegex = (str: string): string => {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export interface QueryKeys {
    limit?: string;
    page?: string;
    sort?: string;
    order?: string;
    [key: string]: any;
}

export interface SearchKeys {
    [key: string]: string;
}

interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

interface ResponseData<T> {
    success: boolean;
    data: T;
    pagination?: Pagination;
}

const Aggregator = async<T>(
    collectionModel: any,
    queryKeys: QueryKeys,
    searchKeys: SearchKeys,
    aggregationPipeline: PipelineStage[],
): Promise<ResponseData<T>> => {
    try {
        const { limit, page, sort, order, ...filters } = queryKeys;
        const itemsPerPage = parseInt(limit || "10", 10);
        const currentPage = parseInt(page || "1", 10);

        let matchStage: any = {};

        // Handle search queries
        if (Object.keys(searchKeys).length > 0) {
            matchStage.$or = Object.keys(searchKeys)
                .map(key => ({ [key]: { $regex: escapeRegex(searchKeys[key]), $options: "i" } }))
                .filter(item => Object.keys(item).length > 0);
        }

        // Handle filters
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'undefined') {
                matchStage[key] = filters[key];
            }
        });

        let sortStage: any = {};
        if (sort) {
            sortStage[sort] = order === "desc" ? -1 : 1;
        }

        // Construct aggregation pipeline
        const pipeline: any[] = [
            { $match: matchStage },
            ...aggregationPipeline,
            ...(Object.entries(sortStage).length > 0 ? [{ $sort: sortStage }] : []),
            
            { $skip: (currentPage - 1) * itemsPerPage },
            { $limit: itemsPerPage },
        ];

        // if (modelSelect) {
        //     pipeline.push({ $project: modelSelect.split(' ').reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) });
        // }

        // Get paginated results
        const [result, totalItems] = await Promise.all([
            collectionModel.aggregate(pipeline),
            collectionModel.countDocuments(matchStage)
        ]);

        return {
            success: true,
            data: result,
            pagination: {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage)
            }
        };
    } catch (error: any) {
        throw new Error(error.message || "An error occurred while executing the query");
    }
};

export default Aggregator;
