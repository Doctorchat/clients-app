import { object, string } from "yup";

const configureFormSchema = object().shape({
  investigation_id: string().required("Selectează o anchetă"),
});

export default configureFormSchema;
