import { describe, expect, it } from "vitest";

import {
  getPlaidErrorCode,
  getPlaidHttpStatus,
  sanitizePlaidError,
} from "./errors";

describe("Plaid error sanitization", () => {
  it("extracts only safe Plaid error metadata", () => {
    const error = {
      response: {
        status: 400,
        data: {
          error_code: "ITEM_LOGIN_REQUIRED",
          error_message: "access token should not be logged",
        },
      },
    };

    expect(getPlaidErrorCode(error)).toBe("ITEM_LOGIN_REQUIRED");
    expect(getPlaidHttpStatus(error)).toBe(400);
    expect(sanitizePlaidError(error)).toEqual({
      code: "ITEM_LOGIN_REQUIRED",
      status: 400,
    });
  });
});
