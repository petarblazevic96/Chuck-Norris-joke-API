export default () => ({
    database: {
        host: process.env.DATABASE_HOST || "localhost",
        port: process.env.DATABASE_PORT || 5432,
        database_name: process.env.DATABASE_NAME || "chuck_norris_joke_app"
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        default_job_options: {
            attempts: process.env.REDIS_DEFAULT_JOB_OPTIONS_ATTEMPTS || 3,
            timeout: process.env.REDIS_DEFAULT_JOB_OPTIONS_TIMEOUT || 30000
        }
    },
    email_options: {
        email: process.env.EMAIL_OPTIONS_EMAIL || "",
        password: process.env.EMAIL_OPTIONS_PASSWORD || ""
    },
    env_variables: {
        port: process.env.PORT || 3000,
        log_level: process.env.LOG_LEVEL || "debug",
        log_directory: process.env.LOG_DIRECTORY,
    },
    chuck_norris_api: {
        api_url: process.env.CHUCK_NORRIS_API_API_URL,
        api_path: process.env.CHUCK_NORRIS_API_API_PATH
    },
    jwt_secret: process.env.JWT_SECRET
});