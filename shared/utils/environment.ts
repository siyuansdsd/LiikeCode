import { LogLevel } from "./logger";

/** The App environment */
export type Environment = "dev" | "prod";

export const APP_ENV: Environment =
  process.env.CRM_ENV === "prod" ? "prod" : "dev";

export const isProd = process.env.CRM_ENV === "prod" ? true : false;

export const LOG_LEVEL: LogLevel =
  process.env.CRM_DEBUG === "true"
    ? "debug"
    : APP_ENV === "prod"
    ? "warn"
    : "info";
