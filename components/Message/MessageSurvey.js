import { CommentOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import PropTypes from "prop-types";

export default function MessageSurvey(props) {
  if (props.type !== "answer") return null;
  const contentMessage = props.content && JSON.parse(props.content);

  return (
    <div className="message-survey">
      <Timeline>
        {contentMessage.map((item, index) => (
          <Timeline.Item style={{ fontSize: "16px", paddingBottom: 0 }} dot={<CommentOutlined />} key={index}>
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
