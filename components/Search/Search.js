import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import useDebounce from "@/hooks/useDebounce";
import SearchIcon from "@/icons/search.svg";
import searchObjectsByKeys from "@/utils/searchObjectsByKeys";

import Input from "../Inputs";






export default function Search(props) {
  const { searchKeys, placeholder, request, localList, onFocus, onBlur, updateSearchConfig } =
    props;
  const [input, setInput] = useState("");
  const search = useRef(null);

  useEffect(() => {
    search.current = searchObjectsByKeys(searchKeys, localList);
  }, [searchKeys, localList]);

  const apiSearch = useCallback(async () => {
    try {
      const searchResult = await request(input);
      updateSearchConfig("list", searchResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }, [input, request, updateSearchConfig]);

  const localSearch = useCallback(() => {
    const searchResult = search.current(input);

    updateSearchConfig("list", searchResult);
  }, [input, updateSearchConfig]);

  const searchHandler = useCallback(() => {
    if (!input || !input.length) onBlur();

    if (input.length > 0) {
      updateSearchConfig("active", true);
      if (search.current) {
        localSearch();
      } else if (request) {
        apiSearch();
      }
    } else updateSearchConfig("active", false);
  }, [apiSearch, input, localSearch, onBlur, request, updateSearchConfig]);

  const debouncedSearch = useDebounce(searchHandler, 300, {
    maxWait: 600,
  });

  const onInputChange = useCallback(
    (e) => {
      debouncedSearch();
      setInput(e.target.value);
    },
    [debouncedSearch]
  );

  return (
    <Input
      name="search"
      autoComplete="off"
      value={input}
      onChange={onInputChange}
      placeholder={placeholder}
      prefix={<SearchIcon />}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

Search.propTypes = {
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  request: PropTypes.func,
  localList: PropTypes.array,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  updateSearchConfig: PropTypes.func,
};

Search.defaultProps = {
  placeholder: "Caută...",
  minSearchedLocalList: 3,
  onBlur: () => null,
  onFocus: () => null,
  updateSearchConfig: () => null,
};
