"use client";
import { Button, Col, Layout, Row, Space, Steps, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useExerciseStatsProvider } from "../../contexts/ExerciseStatsProvider";
import VideoFeed from "../VideoFeed/VideoFeed";

function ExerciseDashboard() {
  const {
    currentExercise,
    repCount,
    totalReps,
    exercises,
    isExerciseFinished,
    isExerciseChange,
    isInitialRepCountAdded,
    handleAddRepForExercise,
  } = useExerciseStatsProvider();

  const handleReStartExercise = () => {
    window.location.reload();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isInitialRepCountAdded ? (
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
                {!isExerciseChange && !isExerciseFinished && <VideoFeed />}

                {isExerciseFinished && (
                  <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center gap-8">
                      <Typography.Text className="text-2xl">
                        Well done you have successfully completed your exercise 🎉
                      </Typography.Text>
                      <Button
                        className="w-fit"
                        type="primary"
                        size="large"
                        onClick={handleReStartExercise}
                      >
                        Restart Exercise
                      </Button>
                    </div>
                  </div>
                )}
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
    </Layout>
  );
}

export default ExerciseDashboard;
