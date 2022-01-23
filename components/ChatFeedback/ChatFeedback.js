import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button, { IconBtn } from "../Button";
import { Textarea } from "../Inputs";
import Form from "../Form";
import LikeIcon from "@/icons/like.svg";
import DislikeIcon from "@/icons/dislike.svg";
import Tabs from "@/packages/Tabs";

const tabsKeys = {
  rate: "feedback-rate",
  review: "feedback-review",
  success: "feedback-success",
};

export default function ChatFeedback(props) {
  const { chatId } = props;
  const [tabsConfig, setTabsConfig] = useState({ key: tabsKeys.rate, dir: "next" });
  const form = useForm();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );
  return (
    <div className="chat-feedback">
      <div className="chat-feedback-header">
        <h3 className="feedback-header-title">Send us your feeback!</h3>
        <p className="feedback-header-subtitle">Do you have a suggestion or found some bug?</p>
        <p className="feedback-header-subtitle">Let us know in the field below.</p>
      </div>
      <div className="chat-feedback-content">
        <div className="chat-feeback-rate mb-4">
          <h4 className="chat-feedback-section-title">How was your experience?</h4>
          <IconBtn
            icon={<DislikeIcon />}
            onClick={updateTabsConfig(tabsKeys.review)}
            className="rate-action remove-action me-2"
            size="sm"
          />
          <IconBtn
            icon={<LikeIcon />}
            onClick={updateTabsConfig(tabsKeys.review)}
            className="rate-action accept-action mb-1"
            size="sm"
          />
        </div>
        <div className="chat-feedback-review">
          <div className="chat-feeback-section w-100">
            <Form methods={form} className="w-100">
              <Form.Item label="(Opțional)" name="message">
                <Textarea className="feedbock-textarea" minHeight={120} placeholder="Describe your expericne here..." />
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  className="w-100"
                  onClick={updateTabsConfig(tabsKeys.success)}
                >
                  Trimite
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {/* <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={tabsKeys.rate} unmountOnExit={false}>
          <div className="chat-feedback-rate">
            <h4 className="chat-feeback-title">
              How do you rate your customer service experience?
            </h4>
            <div className="chat-feeback-section">
              <IconBtn
                icon={<DislikeIcon />}
                onClick={updateTabsConfig(tabsKeys.review)}
                className="remove-action me-2"
              />
              <IconBtn
                icon={<LikeIcon />}
                onClick={updateTabsConfig(tabsKeys.review)}
                className="accept-action"
              />
            </div>
          </div>
        </Tabs.Pane>
        <Tabs.Pane dataKey={tabsKeys.review}>
          <div className="chat-feedback-review">
            <h4 className="chat-feeback-title">
              How do you rate your customer service experience?
            </h4>
            <div className="chat-feeback-section w-100">
              <Form methods={form} className="w-100">
                <Form.Item label="Message" name="message">
                  <Textarea />
                </Form.Item>
                <div className="d-flex justify-content-end">
                  <Button type="primary" onClick={updateTabsConfig(tabsKeys.success)}>
                    Trimite
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Tabs.Pane>
        <Tabs.Pane dataKey={tabsKeys.success}>
          <div className="chat-feedback-review">
            <div className="chat-feeback-section">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>
        </Tabs.Pane>
      </Tabs> */}
    </div>
  );
}

ChatFeedback.propTypes = {};

ChatFeedback.defaultProps = {};
