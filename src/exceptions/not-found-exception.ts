export class NotFoundException extends Error {
  constructor(message: string, public context?: string) {
    super(message);
    this.name = 'NotFoundException';
    this.context = context;
  }
}
