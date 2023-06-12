import React from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import { useEventListener } from "usehooks-ts";

import Portal from "@/containers/Portal";

import { TemplateForm, TemplateSelect } from "./elements";

import Styles from "./styles/index.module.scss";

export default function DocMessageTemplate({ isOpen, onClose, onChooseTemplate }) {
  const ref = React.useRef();

  const [step, setStep] = React.useState("select");
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") onClose();
  });

  return (
    <Portal portalName="modalRoot">
      <CSSTransition nodeRef={ref} in={isOpen} timeout={isOpen ? 200 : 0} unmountOnExit>
        <div ref={ref} className={Styles.Root}>
          {step === "select" && (
            <TemplateSelect
              onClose={onClose}
              onEditTemplate={(template) => {
                setSelectedTemplate(template);
                setStep("form");
              }}
              onChooseTemplate={onChooseTemplate}
              onCreateTemplate={() => {
                setSelectedTemplate(null);
                setStep("form");
              }}
            />
          )}
          {step === "form" && (
            <TemplateForm
              defaultValues={selectedTemplate}
              onClose={() => {
                setSelectedTemplate(null);
                setStep("select");
              }}
            />
          )}
        </div>
      </CSSTransition>
    </Portal>
  );
}

DocMessageTemplate.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onChooseTemplate: PropTypes.func,
};
