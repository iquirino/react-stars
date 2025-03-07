import { ReactStars } from "../ReactStars";

export default {
  title: "ReactStars",
  component: ReactStars,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
  },
};

export const Default = () => <ReactStars />;
export const WithHalf = () => <ReactStars half />;
export const WithColor = () => <ReactStars color1="red" color2="blue" />;
export const WithSize = () => <ReactStars size={50} />;
export const WithChar = () => <ReactStars char="A" />;
export const WithEdit = () => <ReactStars edit />;
export const WithValue = () => <ReactStars value={3} />;
