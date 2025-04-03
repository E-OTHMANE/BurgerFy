import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Try to parse as JSON first
    let errorData;
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        errorData = await res.json();
        // If we have a detailed error message or errors array
        if (errorData.message) {
          throw new Error(errorData.message);
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMsg = errorData.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
          throw new Error(errorMsg || `Error ${res.status}`);
        }
        // Otherwise throw the whole error object
        throw errorData;
      } catch (e) {
        if (e instanceof Error) throw e;
        // If JSON parsing fails, fall back to text
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
    } else {
      // Not JSON, just get as text
      const text = await res.text();
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
