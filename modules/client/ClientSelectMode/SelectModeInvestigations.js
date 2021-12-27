import { useSelector } from "react-redux";
import FormItem from "@/components/Form/FormItem";
import InvestigationItem from "@/components/InvestigationItem";
import Radio from "@/components/Radio";

export default function SelectModeInvestigations() {
  const {
    user: { investigations },
  } = useSelector((store) => ({ user: store.user.data }));

  const InvestigationsRadios = investigations.map((investigation) => (
    <Radio
      value={String(investigation.id)}
      className="investigation-select-radio"
      key={investigation.id}
    >
      <InvestigationItem {...investigation} />
    </Radio>
  ));

  return (
    <FormItem name="investigation_id">
      <Radio.Group>{InvestigationsRadios}</Radio.Group>
    </FormItem>
  );
}
