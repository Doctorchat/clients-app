import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "usehooks-ts";

import getActiveLng from "@/utils/getActiveLng";

import { getDoctors } from "../api";

const useDoctorsInfiniteList = () => {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  const locale = getActiveLng();

  const debouncedSearch = useDebounce(search, 500);
  const debouncedSpecialty = useDebounce(specialty, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["projects", { search: debouncedSearch, specialty: debouncedSpecialty, locale }],
    queryFn: ({ pageParam = 1 }) =>
      getDoctors({
        page: pageParam,
        search: debouncedSearch,
        specialty: debouncedSpecialty,
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
      specialty,
      setSpecialty,
    },
    pagination: {
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    },
  };
};

export default useDoctorsInfiniteList;
