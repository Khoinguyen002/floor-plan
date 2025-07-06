import { signHMAC } from "@/server-features/authentication/utils/token";
import axios from "axios";
import { NEXT_JWT_SECRET } from "./envs";
import { toBase64url } from "@/utils/encode-decode";
import {
  HMAC_PAYLOAD_HEADER,
  HMAC_SIGNATURE_HEADER,
  HMAC_TOKEN_TTL,
} from "./token";

const nextAxiosInstance = axios.create({
  timeout: 15000,
});

nextAxiosInstance.interceptors.request.use(
  async (config) => {
    if (!NEXT_JWT_SECRET) throw new Error("NEXT_JWT_SECRET is not defined");

    const payload = {
      id: self.crypto.randomUUID(),
      exp: Math.floor(Date.now() / 1000) + HMAC_TOKEN_TTL,
    };
    const raw = JSON.stringify(payload);

    config.headers[HMAC_SIGNATURE_HEADER] = signHMAC(raw);
    config.headers[HMAC_PAYLOAD_HEADER] = toBase64url(raw);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default nextAxiosInstance;
