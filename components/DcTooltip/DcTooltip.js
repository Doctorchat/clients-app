import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import PropTypes from "prop-types";

const DcTooltip = ({ children, content, side = "top", align = "center", asChild = false }) => {
  return (
    <TooltipPrimitive.Root disableHoverableContent>
      <TooltipPrimitive.Trigger asChild={asChild} className="dc-tooltip__trigger">
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal className="dc-tooltip__portal">
        <TooltipPrimitive.Content
          className="dc-tooltip__content"
          alignOffset={-5}
          side={side}
          align={align}
        >
          {content}
          <TooltipPrimitive.Arrow className="dc-tooltip__arrow" width={11} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

DcTooltip.propTypes = {
  children: PropTypes.element,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  side: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  align: PropTypes.oneOf(["start", "center", "end"]),
  asChild: PropTypes.bool,
};

export default DcTooltip;
