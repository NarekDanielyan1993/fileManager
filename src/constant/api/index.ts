export const USER_API = {
    SIGN_UP: '/signup',
    INFO: '/info',
    LOGIN: '/signin',
    LOG_OUT: '/logout',
    UPDATE_ACCESS_TOKEN: '/signin/new_token',
};

export const FILE_API = {
    CREATE: '/file/upload',
    GET_FILE: '/file/:id',
    GET_FILES: '/file/list',
    UPDATE_FILE: '/file/update/:id',
    DELETE_FILE: '/file/delete/:id',
    DOWNLOAD_FILE: '/file/download/:id',
};

export const BASE_API = '/api';
