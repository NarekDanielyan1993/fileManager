import { ParsedUrlQuery } from 'querystring';

export type EnvVariableTypes =
    | 'DATABASE_URL'
    | 'PORT'
    | 'ACCESS_TOKEN_KEY'
    | 'REFRESH_TOKEN_KEY'
    | 'AUTH_EXPIRATION_TIME'
    | 'SERVER_BASE_API'
    | 'HASH_SAULT'
    | 'UPLOAD_DIRECTORY'
    | 'NODE_ENV';

export interface IParsedPaginatedQueryParams {
    pageSize: number;
    pageNumber: number;
    skip: number;
}

export type IPaginatedQueryParams = {
    list_size: string;
    page: string;
} & ParsedUrlQuery;
