import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../Inputs";
import SearchIcon from "@/icons/search.svg";
import useDebounce from "@/hooks/useDebounce";
import searchObjectsByKeys from "@/utils/searchObjectsByKeys";

export default function Search(props) {
  const { searchKeys, placeholder, request, localList, onFocus, onBlur, updateSearchConfig } =
    props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const search = useRef(null);

  useEffect(() => {
    search.current = searchObjectsByKeys(searchKeys, localList);
  }, [searchKeys, localList]);

  const apiSearch = useCallback(async () => {
    try {
      setLoading(true);
      const searchResult = await request(input);
      updateSearchConfig("list", searchResult);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [input, request, updateSearchConfig]);

  const localSearch = useCallback(() => {
    const searchResult = search.current(input);

    // if (searchResult.length <= minSearchedLocalList) {
    //   apiSearch();
    // }

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
      // loading={loading}
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
