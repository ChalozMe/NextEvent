import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return await response.json();
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.fullName,
        email: data.email,
        password: data.password
      })
    });
  

    if (!response.ok) {
      throw new Error("Error al registrar usuario");
    }

    return {
      token: "demo-token",
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: "USER"
    };
  },

  logout: (): void => {
    console.log("Mock logout");
  }
};
