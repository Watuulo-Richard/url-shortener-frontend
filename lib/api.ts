const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

type ApiResponseBody = unknown;

function getStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function getErrorMessageFromObject(
  data: Record<string, unknown>,
): string | null {
  const directMessage =
    getStringValue(data.message) ??
    getStringValue(data.error) ??
    getStringValue(data.detail) ??
    getStringValue(data.description);

  if (directMessage) {
    return directMessage;
  }

  if (Array.isArray(data.errors)) {
    const messages = data.errors
      .map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object") {
          return getErrorMessageFromObject(error as Record<string, unknown>);
        }
        return null;
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flatMap((error) => (Array.isArray(error) ? error : [error]))
      .map((error) => getStringValue(error))
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return null;
}

function getErrorMessage(data: ApiResponseBody, fallback: string): string {
  if (typeof data === "string") {
    return data.trim() || fallback;
  }

  if (data && typeof data === "object") {
    return (
      getErrorMessageFromObject(data as Record<string, unknown>) ?? fallback
    );
  }

  return fallback;
}

async function readResponseBody(response: Response): Promise<ApiResponseBody> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

function getRecordValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getIdValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return null;
}

function getUserName(data: Record<string, unknown>, fallbackEmail: string) {
  const directName = getStringValue(data.name);
  if (directName) return directName;

  const firstName =
    getStringValue(data.firstName) ?? getStringValue(data.first_name);
  const lastName =
    getStringValue(data.lastName) ?? getStringValue(data.last_name);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || fallbackEmail.split("@")[0] || "User";
}

function normalizeUser(
  value: unknown,
  fallbackEmail?: string,
  fallbackName?: string,
): User | null {
  const data = getRecordValue(value);
  const email = data
    ? (getStringValue(data.email) ?? fallbackEmail)
    : fallbackEmail;

  if (!email) {
    return null;
  }

  return {
    id:
      getIdValue(data?.id) ??
      getIdValue(data?.userId) ??
      getIdValue(data?.user_id) ??
      email,
    email,
    name:
      fallbackName ??
      (data ? getUserName(data, email) : email.split("@")[0] || "User"),
    role: data?.role === "admin" ? "admin" : "user",
    createdAt:
      getStringValue(data?.createdAt) ??
      getStringValue(data?.created_at) ??
      new Date().toISOString(),
  };
}

function extractAuthSession(
  data: ApiResponseBody,
  fallbackEmail?: string,
  fallbackName?: string,
): { user: User | null; token: string | null } {
  const root = getRecordValue(data);

  if (!root) {
    return { user: null, token: null };
  }

  const payload =
    getRecordValue(root.data) ??
    getRecordValue(root.payload) ??
    getRecordValue(root.result) ??
    root;

  const token =
    getStringValue(payload.token) ??
    getStringValue(payload.accessToken) ??
    getStringValue(payload.access_token) ??
    getStringValue(root.token) ??
    getStringValue(root.accessToken) ??
    getStringValue(root.access_token);

  const userSource =
    getRecordValue(payload.user) ??
    getRecordValue(payload.account) ??
    getRecordValue(payload.profile) ??
    getRecordValue(root.user) ??
    (getStringValue(payload.email) ? payload : null);

  const user =
    normalizeUser(userSource, fallbackEmail, fallbackName) ??
    (token ? normalizeUser(null, fallbackEmail, fallbackName) : null);

  return { user, token };
}

export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  userId: string;
  favicon?: string;
}
export interface LinkResponse {
  shortCode: string;
}

// Mock delay to simulate API calls
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth API calls
export const authApi = {
  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<{
    user: User | null;
    token: string | null;
    error: string | null;
  }> {
    // await delay(1000)

    try {
      const response = await fetch(`${BACKEND_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await readResponseBody(response);

      if (!response.ok) {
        return {
          user: null,
          token: null,
          error: getErrorMessage(data, "Signup failed. Please try again."),
        };
      }

      return { ...extractAuthSession(data, email, name), error: null };
    } catch {
      return {
        user: null,
        token: null,
        error: "Network error. Please check your connection.",
      };
    }
  },

  async signin(
    email: string,
    password: string,
  ): Promise<{
    user: User | null;
    token: string | null;
    error: string | null;
  }> {
    // await delay(1000)

    // TODO: Replace with actual API call
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await readResponseBody(response);

      if (!response.ok) {
        return {
          user: null,
          token: null,
          error: getErrorMessage(data, "Signin failed. Please try again."),
        };
      }

      return { ...extractAuthSession(data, email), error: null };
    } catch {
      return {
        user: null,
        token: null,
        error: "Network error. Please check your connection.",
      };
    }
  },

  async signout(): Promise<void> {
    // await delay(500)
    // TODO: Replace with actual API call
    // await fetch('YOUR_GOLANG_API/auth/signout', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
  },

  async getCurrentUser(token: string): Promise<User> {
    // await delay(500)

    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/auth/me', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()

    return {
      id: "1",
      email: "user@example.com",
      name: "Demo User",
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
    };
  },
};

// Links API calls
export const linksApi = {
  async getLinks(token: string): Promise<Link[]> {
    // await delay(800)

    // TODO: Replace with actual API call
    const response = await fetch(`${BACKEND_API_URL}/links`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await readResponseBody(response);
if (!response.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch links."));
    }

    const root = getRecordValue(data as ApiResponseBody)
    const list =
      Array.isArray(root?.data) ? root.data :
      Array.isArray(root?.links) ? root.links :
      Array.isArray(data) ? data : [];
    return list.map((item: unknown) => {
      const link = getRecordValue(item) ?? {};
      const originalUrl = getStringValue(link.originalUrl) ?? getStringValue(link.original_url) ?? "";
      const hostname = (() => { try { return new URL(originalUrl).hostname; } catch { return ""; } })();

      return {
        id: getIdValue(link.id) ?? getIdValue(link.linkId) ?? Date.now().toString(),
        shortCode: getStringValue(link.shortCode) ?? getStringValue(link.short_code) ?? "",
        originalUrl,
        clicks: typeof link.clicks === "number" ? link.clicks : 0,
        createdAt: getStringValue(link.createdAt) ?? getStringValue(link.created_at) ?? new Date().toISOString(),
        userId: getIdValue(link.userId) ?? getIdValue(link.user_id) ?? "",
        favicon: getStringValue(link.favicon) ?? (hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128` : undefined),
      } satisfies Link;
    });
  },

  async createLink(
    token: string,
    originalUrl: string,
    customCode?: string,
  ): Promise<LinkResponse> {
    // await delay(1000)

    // TODO: Replace with actual API call
    const response = await fetch(`${BACKEND_API_URL}/links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl, shortCode: customCode }),
    });
    const data = await readResponseBody(response);

    console.log("STATUS:", response.status);
    console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Failed to create link."));
    }

    const root = getRecordValue(data);
    const payload = getRecordValue(root?.data) ?? root;
    const shortCode = getStringValue(payload?.shortCode);

    if (!shortCode) {
      throw new Error(
        "Link created, but the server did not return a short code.",
      );
    }

    return {
      // id: Date.now().toString(),
      shortCode,
      // originalUrl,
      // clicks: 0,
      // createdAt: new Date().toISOString(),
      // userId: '1',
      // favicon: `https://www.google.com/s2/favicons?domain=${new URL(originalUrl).hostname}&sz=128`
    };
  },

  async deleteLink(token: string, linkId: string): Promise<void> {
    // await delay(500)
    // TODO: Replace with actual API call
    // await fetch(`YOUR_GOLANG_API/links/${linkId}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
  },

  async getLinkStats(
    token: string,
    linkId: string,
  ): Promise<{ clicks: number; lastClicked?: string }> {
    // await delay(500)

    // TODO: Replace with actual API call
    // const response = await fetch(`YOUR_GOLANG_API/links/${linkId}/stats`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()

    return {
      clicks: Math.floor(Math.random() * 100),
      lastClicked: new Date().toISOString(),
    };
  },
};
