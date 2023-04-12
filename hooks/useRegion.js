export default function useRegion() {
  const region = process.env.NEXT_PUBLIC_API_REGION;
  return region;
}
