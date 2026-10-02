import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from './services/logger.service';

// Catches errors nothing else handled (template errors, exceptions in subscriptions) and logs them.
@Injectable({
  providedIn: 'root'
})
export class LoggingErrorHandlerService implements ErrorHandler {

  private log = this.logger.for('ErrorHandler');

  constructor(private logger: LoggerService) { }

  handleError(error: any): void {
    this.log.error(`Uncaught error: ${error && error.message ? error.message : error}`, error);
  }
}
