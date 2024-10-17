import { RepsData } from "@/contexts/ExerciseStats.interface";
import { useExerciseStatsProvider } from "@/contexts/ExerciseStatsProvider";
import { Form, FormProps, InputNumber, Modal } from "antd";
import React from "react";

const AddRepsModal = ({
  handleContinueExercise,
}: {
  handleContinueExercise: () => void;
}) => {
  const {
    isInitialRepCountAdded,
    setTotalReps,
    setIsInitialResCountAdded,
    handleCloseRepForExerciseModal,
  } = useExerciseStatsProvider();

  const handleSubmit: FormProps<RepsData>["onFinish"] = (values) => {
    setTotalReps(values.totalReps);
    if (isInitialRepCountAdded) {
      handleContinueExercise();
    } else {
      setIsInitialResCountAdded(true);
    }
    handleCloseRepForExerciseModal();
  };

  return (
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
        <Form.Item
          label="Enter the number of total number repetitions you want to perform."
          name="totalReps"
          rules={[
            {
              required: true,
              message: "Please input the number of Repetitions",
            },
          ]}
        >
          <InputNumber autoFocus className="w-full" min={1} max={100}  />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRepsModal;
