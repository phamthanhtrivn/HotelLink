import api from "./api"

export const reviewService = {
  getTop3Reviews: async () => {
    const res = await api.get("/public/reviews/top-three")
    return res.data
  }
}