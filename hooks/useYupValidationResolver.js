import { useCallback } from "react";

const useYupValidationResolver = (validationSchema) =>
  useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce((allErrors, currentError) => {
            let path = currentError.path;

            if (path.match(/\[(.*?)\]/)) {
              const [obj, idx, prop] = path.replace(".", "").split(/\[(.*?)\]/);
              path = `${obj}.${idx}.${prop}`;
            }

            return {
              ...allErrors,
              [path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            };
          }, {}),
        };
      }
    },
    [validationSchema]
  );

export default useYupValidationResolver;
