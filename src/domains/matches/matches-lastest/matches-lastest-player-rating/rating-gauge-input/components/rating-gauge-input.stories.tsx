import { useState } from "react";

import RatingGaugeInput from "./rating-gauge-input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof RatingGaugeInput> = {
  title: "Matches/RatingGaugeInput",
  component: RatingGaugeInput,
  parameters: {
    docs: {
      description: {
        component:
          "드래그 가능한 평점 입력 게이지 컴포넌트입니다. 마우스나 터치로 0-10점 사이의 평점을 입력할 수 있습니다.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 10, step: 0.1 },
      description: "현재 평점 값 (0-10)",
    },
    disabled: {
      control: { type: "boolean" },
      description: "비활성화 상태",
    },
    onChangeEnd: {
      action: "onChangeEnd",
      description: "드래그 완료 시 호출되는 콜백 함수",
    },
  },
};

export default meta;

type Story = StoryObj<typeof RatingGaugeInput>;

// 기본 스토리
export const Default: Story = {
  args: {
    value: 6.0,
    disabled: false,
  },
};

// 높은 평점
export const HighRating: Story = {
  args: {
    value: 8.5,
    disabled: false,
  },
};

// 낮은 평점
export const LowRating: Story = {
  args: {
    value: 3.2,
    disabled: false,
  },
};

// 최고 평점
export const MaxRating: Story = {
  args: {
    value: 10.0,
    disabled: false,
  },
};

// 최저 평점
export const MinRating: Story = {
  args: {
    value: 0.0,
    disabled: false,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    value: 7.0,
    disabled: true,
  },
};

// 중간 평점
export const MediumRating: Story = {
  args: {
    value: 5.0,
    disabled: false,
  },
};

// Controlled 컴포넌트 예시
export const Controlled: Story = {
  render: () => {
    const [rating, setRating] = useState(6.0);

    return (
      <div className="space-y-4">
        <RatingGaugeInput value={rating} onChangeEnd={setRating} disabled={false} />
        <div className="text-center">
          <p className="text-white">현재 평점: {rating.toFixed(1)}</p>
          <button className="bg-primary-400 mt-2 rounded px-4 py-2 text-white" onClick={() => setRating(6.0)}>
            리셋 (6.0)
          </button>
        </div>
      </div>
    );
  },
};

// 다양한 평점 예시들
export const RatingExamples: Story = {
  render: () => {
    const ratings = [1.0, 3.5, 5.0, 6.8, 8.2, 9.5];

    return (
      <div className="space-y-6">
        {ratings.map((rating, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg text-white">평점 {rating}점</h3>
            <RatingGaugeInput
              value={rating}
              onChangeEnd={() => {}}
              disabled={true} // 읽기 전용으로 표시
            />
          </div>
        ))}
      </div>
    );
  },
};

// 드래그 중 상태 시뮬레이션
export const Dragging: Story = {
  render: () => {
    const [rating, setRating] = useState(6.0);
    const [isDragging, setIsDragging] = useState(false);

    return (
      <div className="space-y-4">
        <RatingGaugeInput
          value={rating}
          onChangeEnd={(newRating) => {
            setRating(newRating);
            setIsDragging(false);
          }}
          disabled={false}
        />
        <div className="text-center">
          <p className="text-white">상태: {isDragging ? "드래그 중..." : "대기 중"}</p>
          <p className="text-white">현재 평점: {rating.toFixed(1)}</p>
        </div>
      </div>
    );
  },
};
