export interface DatabaseConfiguration {
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
}

export interface RedisConfiguration {
  host: string;
  port: number;
  default_job_options: {
    attempts: number;
    timeout: number;
  };
}

export interface EmailOptionsConfiguration {
  email: string;
  password: string;
}

export interface EnvConfiguration {
  port: number;
  log_level: string;
  log_directory: string;
}

export interface ChuckNorrisApi {
  api_url: string;
  api_path: string;
}
