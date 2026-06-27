export interface SerializedError {
  name: string;
  message: string;
  stack?: string | undefined;
}

export function serializeError(err: unknown): SerializedError | undefined {
  if (!(err instanceof Error)) return undefined;
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
}
