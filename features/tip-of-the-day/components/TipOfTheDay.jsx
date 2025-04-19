import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import TipList from "./TipList";
import TipDetail from "./TipDetail";
import api from "../api";

export default function TipOfTheDay() {
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tipsList, setTipsList] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTips = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.getTipsList(page);
      const { data, meta } = response.data;
      
      setTipsList(prev => page === 1 ? data : [...prev, ...data]);
      if (meta && meta.last_page) {
        setTotalPages(meta.last_page);
      }
    } catch (error) {
      console.error("Failed to fetch tips", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTips(1);
  }, [fetchTips]);

  const loadMoreTips = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTips(nextPage);
    }
  };

  const handleSelectTip = async (id) => {
    try {
      setDetailLoading(true);
      const response = await api.getTipById(id);
      setSelectedTip(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tip detail", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedTip(null);
  };

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title={selectedTip ? selectedTip.title : t("tip_of_the_day")}
          onBack={selectedTip ? handleBackToList : updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y tip-of-the-day-content">
          {selectedTip ? (
            <TipDetail 
              tip={selectedTip} 
              loading={detailLoading}
            />
          ) : (
            <TipList 
              tips={tipsList} 
              loading={loading} 
              onSelectTip={handleSelectTip} 
              onLoadMore={loadMoreTips}
              hasMore={currentPage < totalPages}
            />
          )}
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}