import Captcha from "react-captcha-code";

export const Basic = (prop: any) => {
  const { onChange } = prop;
  return <Captcha charNum={4} onChange={onChange} />;
};

export default Basic;
