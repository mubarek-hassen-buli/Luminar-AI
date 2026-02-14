const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  // Get token from localStorage (matching use-materials logic)
  const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session-token") : null;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `API Error: ${response.statusText}`);
  }

  // Handle empty responses (like 204 No Content or DELETE success)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {} as T;
  }

  return response.json();
}
