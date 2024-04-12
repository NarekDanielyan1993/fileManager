export const FILE_ERROR_MESSAGES = {
    FILE_READ: 'Error occurred while reading the file.',
    FILE_GET: 'Error occurred while retrieving the file.',
    FILES_GET: 'Error occurred while retrieving the files.',
    FILE_CREATE: 'Error occurred while creating the file.',
    FILE_UPDATE: 'Error occurred while updating the file.',
    FILE_DELETE: 'Error occurred while deleting the file.',
    LIMIT_FILE_SIZE: 'File size exceeds the limit: 5MB',
    FILE_NOT_FOUND: 'File not found',
    DEFAULT: 'File upload error',
};

export const USER_ERROR_MESSAGES = {
    VERIFY_PASSWORD: 'Error verifying password',
    ENCRYPT_PASSWORD: 'Error encrypting password',
    CREATE_USER: 'An error occurred while creating the User.',
    GET_USERS: 'An error occurred while finding the User.',
    GET_USER: 'An error occurred while finding the User.',
    EXIST_USER: 'User with this email or phone number already exists',
    NOT_FOUND_USER: 'User not found',
    INCORRECT_PASSWORD: 'Password is incorrect',
};

export const USER_VALIDATION_ERRORS = {
    EMAIL_OR_PHONE:
        'Please enter a valid email or Russian phone number: Example(+79258328380 or test@mail.com).',
    PASSWORD_MIN: 'Password must be at least 6 characters long.',
    PASSWORD_MAX: 'Password cannot exceed 32 characters in length.',
};
