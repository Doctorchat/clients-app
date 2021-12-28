import { string, object } from "yup";

const configureFormSchema = object().shape({
  investigation_id: string().required("Selectează o anchetă"),
});

export default configureFormSchema;
