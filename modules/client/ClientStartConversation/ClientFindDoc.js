import { useSelector } from "react-redux";
import DocList from "@/components/DocList/";
import { PopupHeader, PopupContent } from "@/components/Popup";

export default function ClientFindDoc() {
  const { docSelectList } = useSelector((store) => ({
    docSelectList: store.docSelectList,
  }));

  return (
    <div className="popup-body">
      <PopupHeader title="Selecteză un doctor" />
      <PopupContent>
        <DocList onDocClick={() => () => null} listSlice={docSelectList} />
      </PopupContent>
    </div>
  );
}
