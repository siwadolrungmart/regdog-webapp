const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface DogData {
  lostStatus: string;
  extraDescription: string;
  avatarUrl: string;
  chronicDiseases: string;
  microchipNumber: string;
  pedigreeFileUrl: string;
  userId: number;
  name: string;
  gender: "MALE" | "FEMALE" | "UNKNOWN";
  breed?: string;
  birthDate?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerAddress?: string;
}

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { data: json, status: res.status };
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}

export async function loginUser(data: LoginData): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { data: json, status: res.status };
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}

export async function createDog(data: DogData): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { data: json, status: res.status };
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}
type DogsListResponse = {
  items: DogData[];
  page: number;
  pageSize: number;
  total: number;
};

export async function getDogs(
  userId: number,
  page: number,
  pageSize: number,
): Promise<ApiResponse<DogsListResponse>> {
  try {
    const params = new URLSearchParams({
      userId: userId.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const res = await fetch(`${API_BASE_URL}/api/dogs?${params.toString()}`);
    const json = await res.json();
    return { data: json, status: res.status };
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}

export async function getDogById(dogId: number): Promise<ApiResponse<DogData>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dogs/${dogId}`);
    const json = await res.json();
    return { data: json, status: res.status };
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}

export async function updateDog(
  id: number,
  data: Partial<DogData>,
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dogs/${id}`, {
      method: "PATCH", // <= สำคัญ: PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    return { data: json, status: res.status };
  } catch (error) {
    console.error("updateDog error:", error);
    return { error: "Network error", status: 500 };
  }
}

export async function createEvent(
  data: { dogId: number; eventTypeId: number; eventAt: string; note: string | undefined; imageUrl: undefined; detail: any; }, // หรือใส่ type ละเอียดทีหลังได้
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dog-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));

    return {
      data: json,
      status: res.status,
    };
  } catch (error) {
    console.error("createEvent error:", error);
    return {
      error: "Network error",
      status: 500,
    };
  }
}

// lib/api.ts

export async function getEvents(dogId?: number): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("pageSize", "200"); // เอามาสักก้อนใหญ่พอ
    if (dogId) {
      params.set("dogId", String(dogId));
    }

    const res = await fetch(
      `${API_BASE_URL}/api/dog-events?${params.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const json = await res.json().catch(() => ({}));

    return {
      data: json,
      status: res.status,
    };
  } catch (error) {
    console.error("getEvents error:", error);
    return {
      error: "Network error",
      status: 500,
    };
  }
}
// lib/api.ts
export async function getDogEvents(dogId?: number): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();
    if (dogId) params.set("dogId", dogId.toString());

    const res = await fetch(
      `${API_BASE_URL}/api/dog-events?${params.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const json = await res.json().catch(() => ({}));

    return {
      data: json,
      status: res.status,
    };
  } catch (error) {
    console.error("getDogEvents error:", error);
    return {
      error: "Network error",
      status: 500,
    };
  }
}

export async function getEvent(params?: {
  dogId?: number;
  since?: string;
  until?: string;
}): Promise<ApiResponse> {
  try {
    const qs = new URLSearchParams();
    if (params?.dogId) qs.set("dogId", String(params.dogId));
    if (params?.since) qs.set("since", params.since);
    if (params?.until) qs.set("until", params.until);

    const res = await fetch(
      `${API_BASE_URL}/api/dog-events${qs.toString() ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const json = await res.json().catch(() => ({}));

    return {
      data: json,
      status: res.status,
    };
  } catch (error) {
    console.error("getEvent error:", error);
    return {
      error: "Network error",
      status: 500,
    };
  }
}

export async function getDogEventsByRange(params: {
  dogId: number;
  since?: string;
  until?: string;
}) {
  const query = new URLSearchParams();
  query.set("dogId", String(params.dogId));
  if (params.since) query.set("since", params.since);
  if (params.until) query.set("until", params.until);

  const res = await fetch(`${API_BASE_URL}/api/dog-events?${query.toString()}`);
  const json = await res.json().catch(() => ({}));

  return {
    status: res.status,
    data: json,
    error: json.error as string | undefined,
  };
}
