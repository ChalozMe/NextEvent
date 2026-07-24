const API_URL = "http://localhost:8080/api/users";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UpdateUserProfileRequest {
  name: string;
  email: string;
}

export const userService = {
  async getCurrentUser(): Promise<UserProfile> {
    const token = localStorage.getItem("nexevent_token");

    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText || `No se pudo obtener el perfil (${response.status})`,
      );
    }

    return response.json();
  },

  async updateCurrentUser(
    request: UpdateUserProfileRequest,
  ): Promise<UserProfile> {
    const token = localStorage.getItem("nexevent_token");

    const response = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText ||
          `No se pudo actualizar el perfil (${response.status})`,
      );
    }

    return response.json();
  },

};
