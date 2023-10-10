import * as winston from "winston";

import { Injectable, LogLevel, LoggerService, Scope } from "@nestjs/common";
import { AbstractConfigSetLevels } from "winston/lib/winston/config";
import _ from "lodash";
import { ConfigService } from "@nestjs/config";
import { EnvConfiguration } from "../config/interfaces";


@Injectable()
export class CustomLogger implements LoggerService {
    private nestLogLevels: AbstractConfigSetLevels = {
        fatal: 0,
        error: 1,
        debug: 2,
        warn: 3, 
        info: 4,
        verbose: 5,
    };

    private logger;
    private level: string = "";

    constructor(private configService: ConfigService) {
        const env: string = process.env.NODE_ENV || "development";
        const env_configuration = this.configService.get<EnvConfiguration>("env_variables");

        const isLocal = !["staging", "production"].includes(env);
        this.level = isLocal ? "info" : (env_configuration?.log_level || "debug");

        const currentDir = __dirname;
        const logsDirectory = env_configuration?.log_directory;
        const rootFilePath = `${currentDir}/${logsDirectory}/`;
        
        const format = winston.format.combine(
            winston.format.printf(info => `[${info.level}] ${info.message}`),
            winston.format.json()
        );

        this.logger = winston.createLogger({
            levels: this.nestLogLevels,
            level: this.level,
            transports: [
                new winston.transports.Console({
                    level: this.level,
                    format: format
                }),
                new winston.transports.File({
                    filename: `${rootFilePath}${new Date().getTime()}/Warn.log`,
                    level: "warn",
                    format: format
                }),
                new winston.transports.File({
                    filename: `${rootFilePath}${new Date().getTime()}/Error.log`,
                    level: "error",
                    format: format
                }),
            ]
        }) as Record<keyof typeof this.nestLogLevels, winston.LeveledLogMethod> & winston.Logger;
    }
    
    log(message: any, ...optionalParams: any[]) {
        this.logger.info(message, ...optionalParams);
    }
    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, ...optionalParams);
    }
    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, ...optionalParams);
    }
    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, ...optionalParams);
    }
    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, ...optionalParams);
    }
    fatal?(message: any, ...optionalParams: any[]) {
        this.logger.fatal(message, ...optionalParams);
    }

    setLogLevels?(levels: LogLevel[]) {
        this.nestLogLevels = levels.reduce((acc: AbstractConfigSetLevels, level: LogLevel) => {
            const logLevelKeys = _.keys(this.nestLogLevels);
            const levelIndex = logLevelKeys.indexOf(level);
            acc[level] = levelIndex;

            return acc;
        }, {});
    }
}