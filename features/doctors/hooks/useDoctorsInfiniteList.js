import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "usehooks-ts";

import getActiveLng from "@/utils/getActiveLng";

import { getDoctors } from "../api";

const useDoctorsInfiniteList = () => {
  const [search, setSearch] = useState("");
  const [speciality, setSpeciality] = useState("");

  const locale = getActiveLng();

  const debouncedSearch = useDebounce(search, 500);
  const debouncedSpecialty = useDebounce(speciality, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["projects", { search: debouncedSearch, specialty: debouncedSpecialty, locale }],
    queryFn: ({ pageParam = 1 }) =>
      getDoctors({
        page: pageParam,
        search: debouncedSearch,
        speciality: debouncedSpecialty ? debouncedSpecialty.value : undefined,
        locale,
      }),
    getNextPageParam: (lastPage) => lastPage.next_page_url?.replace(/\D/g, "") ?? false,
  });

  return {
    doctors: data?.pages?.flatMap((page) => page.data) ?? [],
    isLoading,
    filters: {
      search,
      setSearch,
      speciality,
      setSpeciality,
    },
    pagination: {
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    },
  };
};

export default useDoctorsInfiniteList;
