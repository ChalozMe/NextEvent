import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Mock response para permitir probar el frontend sin necesidad del backend
    console.log("Mock login for frontend testing");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: "mock-jwt-token-12345",
          username: data.email.split('@')[0],
          email: data.email,
          fullName: "Usuario de Prueba",
          role: "ADMIN"
        });
      }, 800);
    });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Mock response para el registro
    console.log("Mock register for frontend testing");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: "mock-jwt-token-12345",
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: "USER"
        });
      }, 800);
    });
  },

  logout: (): void => {
    // El borrado del token y localStorage ya se maneja en AuthContext.tsx
    console.log("Mock logout");
  }
};
