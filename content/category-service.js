import axios from "./axios";
import { ENV } from "../config/env";

export const CategoryService = {
  getAll() {
    return axios.get("/api/v1/categories", {
      headers: {
        Authorization: `Bearer ${ENV.WEB_TOKEN ?? ""}`,
      },
    });
  },
};
