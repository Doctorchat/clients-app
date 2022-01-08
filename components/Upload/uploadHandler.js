export default async function uploadHandler(file, action, { onProgress, onSuccess, onError }) {
  try {
    const response = await action(file, {
      onUploadProgress: ({ total, loaded }) => {
        if (onProgress) {
          onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
        }
      },
    });

    if (onSuccess) onSuccess(response);
  } catch (error) {
    if (onError) onError(error, file);
  }
}
