type PlaidErrorData = {
  error_code?: string;
  error_type?: string;
  error_message?: string;
};

type PlaidErrorLike = {
  response?: {
    status?: number;
    data?: PlaidErrorData;
  };
};

export function getPlaidErrorCode(error: unknown): string | undefined {
  return (error as PlaidErrorLike).response?.data?.error_code;
}

export function getPlaidHttpStatus(error: unknown): number | undefined {
  return (error as PlaidErrorLike).response?.status;
}

export function sanitizePlaidError(error: unknown): {
  code: string;
  status?: number;
} {
  return {
    code: getPlaidErrorCode(error) ?? "PLAID_ERROR",
    status: getPlaidHttpStatus(error),
  };
}
