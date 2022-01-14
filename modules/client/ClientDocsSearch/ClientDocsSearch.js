import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Select from "@/components/Select";
import Search from "@/components/Search/Search";
import Switch from "@/components/Switch";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function ClientDocsSearch(props) {
  const { localList, updateSearchConfig } = props;
  const [filters, setFilters] = useState({
    online: false,
    categories: [],
  });
  const { t } = useTranslation();

  const onFiltersChange = (name) => (value) =>
    setFilters((prevState) => ({ ...prevState, [name]: value }));

  return (
    <div className="find-doc-search">
      <Search
        placeholder={t("conversation_search_placeholder")}
        localList={localList}
        updateSearchConfig={updateSearchConfig}
        searchKeys={["name", "category"]}
      />
      <div className="find-doc-filters d-flex align-items-center justify-content-between mt-3 gap-5">
        <Select
          value={filters.categories}
          placeholder={t("select_categories")}
          size="sm"
          options={options}
          onChange={onFiltersChange("categories")}
          multiple
        />
        <Switch
          value={filters.online}
          label={t("online_doctors")}
          onChange={onFiltersChange("online")}
        />
      </div>
    </div>
  );
}

ClientDocsSearch.propTypes = {
  localList: PropTypes.array,
  setSearchedList: PropTypes.func,
  toggleSearchStatus: PropTypes.func,
  updateSearchConfig: PropTypes.func,
};
