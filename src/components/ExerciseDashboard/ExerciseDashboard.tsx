"use client";
import {
  Button,
  Col,
  Form,
  FormProps,
  InputNumber,
  Layout,
  Modal,
  Row,
  Space,
  Steps,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useExerciseStatsProvider } from "../../contexts/ExerciseStatsProvider";
import VideoFeed from "../VideoFeed/VideoFeed";
import { useState } from "react";
import { RepsData } from "@/contexts/ExerciseStats.interface";

function ExerciseDashboard() {
  const [isAddResModalOpen, setIsAddRepModalOpen] = useState(false);
  const [isRepCountAdded, setIsResCountAdded] = useState(false);
  const { currentExercise, repCount, totalReps, exercises, setTotalReps } =
    useExerciseStatsProvider();

  const handleAddRepForExercise = () => setIsAddRepModalOpen(true);

  const handleCloseRepForExerciseModal = () => setIsAddRepModalOpen(false);

  const handleSubmit: FormProps<RepsData>["onFinish"] = (values) => {
    setTotalReps(values)
    setIsResCountAdded(true);
    handleCloseRepForExerciseModal();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isRepCountAdded ? (
        <>
          <Sider
            style={{
              backgroundColor: "white",
            }}
          >
            <Row
              align="middle"
              justify="center"
              gutter={[16, 16]}
              style={{ height: "100%" }}
            >
              <Col>
                <Steps
                  current={currentExercise.key}
                  percent={(repCount / totalReps) * 100}
                  labelPlacement="horizontal"
                  direction="vertical"
                  items={exercises.map((exercise) => ({
                    ...exercise,
                    title: (
                      <Space size={8}>
                        {exercise.title}
                        {exercise.count}
                      </Space>
                    ),
                  }))}
                />
              </Col>
            </Row>
          </Sider>
          <Content style={{ backgroundColor: "white" }}>
            <Row
              align="middle"
              justify="center"
              gutter={[16, 16]}
              style={{ height: "100%" }}
            >
              <Col>
                <VideoFeed />
              </Col>
            </Row>
          </Content>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Button type="primary" size="large" onClick={handleAddRepForExercise}>
            Start Exercise
          </Button>
        </div>
      )}

      {isAddResModalOpen && (
        <Modal
          maskClosable={false}
          open
          okButtonProps={{
            htmlType: "submit",
            id: "rep-form",
            form: "rep-form",
          }}
          okText="Start Exercise"
          title={"Add Reps for exercise"}
          onCancel={handleCloseRepForExerciseModal}
        >
          <Form id="rep-form" layout="vertical" onFinish={handleSubmit}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Lunges"
                  name="lunges"
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of Lunges",
                    },
                  ]}
                >
                  <InputNumber className="w-full" min={1} max={100} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Planks"
                  name="planks"
                  help="Input will be in seconds like 30, 60, 90, etc."
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of Planks",
                    },
                  ]}
                >
                  <InputNumber className="w-full" min={1} max={100} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Pushups"
                  name="pushups"
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of Pushups",
                    },
                  ]}
                >
                  <InputNumber className="w-full" min={1} max={100} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Squats"
                  name="squats"
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of Squats",
                    },
                  ]}
                >
                  <InputNumber className="w-full" min={1} max={100} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </Layout>
  );
}

export default ExerciseDashboard;
