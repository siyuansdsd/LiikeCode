import { LOG_LEVEL } from "./environment";

/** Signature of a logging function */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

/** Log levels */
export type LogLevel = "debug" | "info" | "warn" | "error";

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly debug: LogFn;
  readonly info: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level !== "debug") {
      this.debug = NO_OP;
    } else {
      this.debug = console.log.bind(console);
    }

    if (level === "error") {
      this.warn = NO_OP;
      this.info = NO_OP;
      return;
    }

    this.warn = console.warn.bind(console);

    if (level === "warn") {
      this.info = NO_OP;
      return;
    }

    this.info = console.log.bind(console);
  }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
