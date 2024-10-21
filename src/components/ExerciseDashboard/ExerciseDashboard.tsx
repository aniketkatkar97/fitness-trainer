"use client";
import { Col, Layout, Row, Space, Steps } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useExerciseStatsProvider } from "../../contexts/ExerciseStatsProvider";
import VideoFeed from "../VideoFeed/VideoFeed";

function ExerciseDashboard() {
  const { currentExercise, repCount, totalReps, exercises } =
    useExerciseStatsProvider();

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
          <Col offset={4}>
            <strong>You will have to perform 5 reps for each exercise</strong>
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
    </Layout>
  );
}

export default ExerciseDashboard;
