import axios from "./axios";

export const CategoryService = {
  getAll() {
    return axios.get("/api/v1/categories");
  },
};