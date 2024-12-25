import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken; 
  }
  return null;  // Token yoksa null döndür
};