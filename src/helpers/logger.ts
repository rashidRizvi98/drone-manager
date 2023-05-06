import * as log4js from "log4js";

export const getLogger = (context: string)=> {
    const logger = log4js.getLogger(context);
    logger.level = 'debug'
    return logger
}