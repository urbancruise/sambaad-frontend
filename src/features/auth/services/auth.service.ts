import axiosInstance from "@/src/lib/axios";
import { setAccessToken, removeAccessToken } from "@/src/lib/auth";

export const login = async (username: string, password: string) => {

  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });


  const accessToken =
    response.data?.data?.accessToken ?? response.data?.accessToken;

  if (accessToken) {
    setAccessToken(accessToken);
  }

  return response.data;
};

export const logout = async () => {
  // Was a no-op — the actual token cleanup only happened because
  // Navbar.tsx calls api.post("/auth/logout") + clears localStorage
  // directly, bypassing this function entirely. Fixed so this function
  // does what it claims to, in case anything else calls it.
  try {
    await axiosInstance.post("/auth/logout");
  } finally {
    removeAccessToken();
  }
  return true;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");

  return response.data;
};