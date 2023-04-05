import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Search from "@/components/Search/Search";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import { categoriesOptionsSelector } from "@/store/selectors";

export default function ClientDocsSearch(props) {
  const { localList, updateSearchConfig, filters, setFilters } = props;
  const { categories } = useSelector((store) => ({
    categories: categoriesOptionsSelector(store),
  }));
  const { t } = useTranslation();

  const onFiltersChange = (name) => (value) => setFilters((prevState) => ({ ...prevState, [name]: value }));

  return (
    <div className="find-doc-search">
      <Search
        placeholder={t("conversation_search_placeholder")}
        localList={localList}
        updateSearchConfig={updateSearchConfig}
        searchKeys={["name", "category"]}
      />
      <div className="find-doc-filters d-flex flex-sm-row flex-column align-items-sm-center align-items-start justify-content-between mt-3 gap-3">
        <Select
          value={filters.categories}
          placeholder={t("select_categories")}
          size="sm"
          options={[{ label: t("all"), value: "all" }, ...categories]}
          onChange={onFiltersChange("category")}
        />
        <Switch value={filters.online} label={t("online_doctors")} onChange={onFiltersChange("online")} />
      </div>
    </div>
  );
}

ClientDocsSearch.propTypes = {
  localList: PropTypes.array,
  setSearchedList: PropTypes.func,
  toggleSearchStatus: PropTypes.func,
  updateSearchConfig: PropTypes.func,
  filters: PropTypes.object,
  setFilters: PropTypes.func,
};
