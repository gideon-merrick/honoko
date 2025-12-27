export class APIError extends Error {
  public fields?: Record<string, string[]>;

  constructor(args: { message?: string; fields?: Record<string, string[]> }) {
    super(args.message);
    this.name = "APIError";
    this.fields = args.fields;
  }
}
