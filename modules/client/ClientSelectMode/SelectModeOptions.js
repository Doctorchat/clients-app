import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Alert from "@/components/Alert";
import { selectModeTabs } from "@/context/TabsKeys";
import Button from "@/components/Button";
import { investigationFormToggleVisibility } from "@/store/slices/investigationFormSlice";
import CommentIcon from "@/icons/comment-lines.svg";
import VideoIcon from "@/icons/video.svg";

export default function SelectModeOptions(props) {
  const { setTabsHeight } = props;
  const { updateTabsConfig } = useTabsContext();
  const {
    user: { investigations },
  } = useSelector((store) => ({ user: store.user.data }));
  const dispatch = useDispatch();

  const openInvestigationForm = useCallback(
    () => dispatch(investigationFormToggleVisibility(true)),
    [dispatch]
  );

  useEffect(() => {
    if (!investigations.length) {
      setTabsHeight(112.5);
    }
  }, [investigations.length, setTabsHeight]);

  if (!investigations.length)
    return (
      <>
        <Alert
          className="configure-form-alert"
          type="error"
          message="Prentu a avea acces la doctorii de pe platforma DoctorChat este nevoie să adăugați cel puțin o anchetă"
        />
        <Button size="sm" className="mt-2" onClick={openInvestigationForm}>
          Adaugă o anchetă
        </Button>
      </>
    );

  return (
    <div className="choose-mode-items d-flex align-item-center justify-content-center">
      <div
        className="choose-mode-item mr-1"
        role="button"
        onClick={updateTabsConfig(selectModeTabs.configureMeet)}
      >
        <div className="mode-item-icon meet">
          <VideoIcon />
        </div>
        <h4 className="mode-item-title">Online meet</h4>
      </div>
      <div
        className="choose-mode-item"
        role="button"
        onClick={updateTabsConfig(selectModeTabs.configureMessage)}
      >
        <div className="mode-item-icon">
          <CommentIcon />
        </div>
        <h4 className="mode-item-title">Mesaj simplu</h4>
      </div>
    </div>
  );
}

SelectModeOptions.propTypes = {
  setTabsHeight: PropTypes.func,
};
