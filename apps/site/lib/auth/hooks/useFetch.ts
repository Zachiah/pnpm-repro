import { useEffect, useState } from "react";

import { ApiResponse, ErrorResponse } from "../types/auth-response";

export function useFetch<SuccessResponse, Error>(
  fetchFn: (...params: any[]) => Promise<ApiResponse>,
  options: {
    autoFetch: boolean;
    onSuccess?: (data: SuccessResponse) => void;
    onError?: (error: ErrorResponse<Error>) => void;
  },
) {
  const [error, setError] = useState<ErrorResponse<Error> | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SuccessResponse | undefined>();

  const execute = async (...params: any[]) => {
    setIsLoading(true);
    setError(undefined);
    setData(undefined);
    try {
      const result = await fetchFn(...params);
      if (result.ok) {
        setData(result.data);
        if (options.onSuccess) options.onSuccess(result.data);
      } else {
        setError(() => {
          const error = {
            status: result.status,
            statusText: result.statusText,
            data: result.data,
          };
          if (options.onError) options.onError(error);
          return error;
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(() => {
          const error = {
            status: 404,
            statusText: "path not found",
            reason: "path not found",
          };
          if (options.onError) options.onError(error);
          return error;
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.autoFetch]);

  return { isLoading, data, error, execute };
}
