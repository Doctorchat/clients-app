export default function useRegion() {
  const region = process.env.NEXT_PUBLIC_API_REGION;
  return region;
}

export const HOME_PAGE_URL = `https://doctorchat.${process.env.NEXT_PUBLIC_API_REGION}/`;
