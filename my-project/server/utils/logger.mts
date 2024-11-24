type LogLevel = 'info' | 'error' | 'warn' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, error?: unknown) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, error || '');
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        console.debug(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  info(message: string) {
    this.log('info', message);
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  debug(message: string) {
    this.log('debug', message);
  }
}

export const logger = new Logger();