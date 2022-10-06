import api from "@/services/axios/api";

import { setBootstrapData } from "../slices/bootstrapSlice";






export const getBootstrapData = () => async (dispatch) => {
  Promise.allSettled([api.bootstrap.categories(), api.bootstrap.global()])
    .then((settledPromises) => {
      const [categories, global] = settledPromises;

      const data = {
        categories: categories.value?.data || [],
        global: global.value?.data || [],
      };

      dispatch(setBootstrapData(data));

      return Promise.resolve(data);
    })
    .catch((error) => Promise.reject(error));
};
