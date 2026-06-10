export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        message: string;
        code?: string;
      };
    };

export function ok<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ success: true, data } satisfies ApiResponse<T>, init);
}

export function fail(
  message: string,
  status: number,
  code?: string
): Response {
  return Response.json(
    {
      success: false,
      error: { message, code },
    } satisfies ApiResponse<never>,
    { status }
  );
}

export function unauthorized(): Response {
  return fail("Authentication required.", 401, "UNAUTHORIZED");
}
