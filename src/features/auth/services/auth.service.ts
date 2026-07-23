import axiosInstance from "@/src/lib/axios";

export const login = async (username: string, password: string) => {

  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};

export const logout = async () => {
  return true;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");

  return response.data;
};