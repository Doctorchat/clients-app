import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../Inputs";
import SearchIcon from "@/icons/search.svg";
import useDebounce from "@/hooks/useDebounce";
import searchObjectsByKeys from "@/utils/searchObjectsByKeys";

export default function Search(props) {
  const {
    searchKeys,
    placeholder,
    request,
    localList,
    updateList,
    onFocus,
    onBlur,
    minSearchedLocalList,
  } = props;
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
      updateList(searchResult);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [input, request, updateList]);

  const localSearch = useCallback(() => {
    const searchResult = search.current(input);

    if (searchResult.length <= minSearchedLocalList) {
      apiSearch();
    }

    updateList(searchResult);
  }, [apiSearch, input, minSearchedLocalList, updateList]);

  const searchHanlder = useCallback(() => {
    if (input.length > 1) {
      if (search.current && localList.length >= minSearchedLocalList) {
        localSearch();
      } else {
        apiSearch();
      }
    }
  }, [apiSearch, input.length, localList.length, localSearch, minSearchedLocalList]);

  const debouncedSearch = useDebounce(searchHanlder, 200, {
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
      loading={loading}
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
  updateList: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  minSearchedLocalList: PropTypes.number,
};

Search.defaultProps = {
  placeholder: "Caută...",
  minSearchedLocalList: 3,
};
