import { useTranslation } from "react-i18next";
import { CommentOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import PropTypes from "prop-types";

export default function MessageSurvey(props) {
  if (props.type !== "answer") return null;
  const contentMessage = props.content && JSON.parse(props.content);
  const { t } = useTranslation();
  return (
    <div className="message-survey message">
     <div className="message-title">  
        <h3>{t("survey_filled")}</h3>
        <p>{t("answers_receive")}</p>
      </div>
      <Timeline>
        {contentMessage.map((item, index) => (
          <Timeline.Item dot={<CommentOutlined />} key={index}>
            <p className="message-question">
              <span>{item.doctor}</span>
            </p>
            <div className="py-2 card-survey">
              <div className="ant-card ant-card-bordered border !border-gray-300">
                <div className="ant-card-body">
                  <p className="message-answer">{item.patient}</p>
                </div>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

MessageSurvey.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
};
