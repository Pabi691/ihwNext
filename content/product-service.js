import axios from "./axios";

export const ProductService = {
  getAll() {
    return axios.get("/api/v1/get_active_products");
  },
};