import "./dnd-node.css";

export const UMLClass = (props: any) => {
  const { size = { width: 126, height: 104 }, data } = props;
  const { width, height } = size;
  const { label, stroke, fill, fontFill, fontSize } = data;
  console.log("data", data);

  return (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d=" M 20 1 L 40 1 C 58 1 58 20  58 20 C 58 20 58 38  40 38 L 20 38 C 1 38 1 20  1 20 C 1 20 1 1  20 1" fill="#FFFFFF" stroke="#A2B1C3"></path>
      <text x="30" y="20" fill="#000" text-anchor="middle" alignment-baseline="middle" font-size="12">
        {label}
      </text>
      Sorry, your browser does not support inline SVG.
    </svg>
  );
};
