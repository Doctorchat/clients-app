import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "usehooks-ts";

import getActiveLng from "@/utils/getActiveLng";

import { getDoctors, getDoctorsForCorporateClient } from "../api";

const useDoctorsInfiniteList = () => {
  const [search, setSearch] = useState("");
  const [speciality, setSpeciality] = useState("");

  const locale = getActiveLng();
  const user = useSelector((state) => state.user.data);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedSpecialty = useDebounce(speciality, 500);

  const parsedSpeciality = useMemo(() => {
    if (!debouncedSpecialty || debouncedSpecialty?.value === "all") return undefined;
    return debouncedSpecialty?.value;
  }, [debouncedSpecialty]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["projects", { search: debouncedSearch, specialty: parsedSpeciality, locale }],
    queryFn: ({ pageParam = 1 }) => {
      const query = {
        page: pageParam,
        search: debouncedSearch,
        speciality: parsedSpeciality,
        locale,
      };

      if (user?.company_id) {
        return getDoctorsForCorporateClient(query);
      }

      return getDoctors(query);
    },
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
