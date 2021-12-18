import { setBootstrapData } from "../slices/bootstrapSlice";
import api from "@/services/axios/api";

export const getBootstrapData = () => async (dispatch) => {
  Promise.allSettled([api.bootstrap.categories()])
    .then((settledPromises) => {
      const [categories] = settledPromises;

      const data = {
        categories: categories.value?.data || [],
      };

      dispatch(setBootstrapData(data));

      return Promise.resolve(data);
    })
    .catch((error) => Promise.reject(error));
};
