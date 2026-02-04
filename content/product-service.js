import axios from "./axios";
import { ENV } from "../config/env";

export const ProductService = {
  getAll() {
    return axios.get("/api/v1/get_active_products", {
      headers: {
        Authorization: `Bearer ${ENV.WEB_TOKEN ?? ""}`,
      },
    });
  },
};
