import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

const City = ({ width = 160, height = 112 }) => {
  const theme = useTheme();
  const colorPrimaryMain = theme.palette.primary.main;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 160 112">
      <path
        fill={colorPrimaryMain}
        d="M21.4 94.766h-9.406v12.615H21.4V94.766zM8.295 88.455h10.17l2.93 6.31h-9.4l-3.7-6.31zM11.975 94.766H5.02v12.615h6.955V94.766z"
      ></path>
      <path fill="#000" d="M21.4 94.766h-9.406v12.615H21.4V94.766zM8.295 88.455h10.17l2.93 6.31h-9.4l-3.7-6.31z" opacity="0.09"></path>
      <path fill="#fff" d="M7.925 97.43H6.07v2.27h1.855v-2.27zM10.955 97.43H9.1v2.27h1.855v-2.27zM9.916 103.23H7.39v4.15h2.525v-4.15z"></path>
      <path fill={colorPrimaryMain} d="M11.975 94.765l-3.695-6.31-3.26 6.31h6.955z"></path>
      <path fill="#000" d="M18.465 88.455H8.295l3.7 6.31v12.615h9.4V94.765l-2.93-6.31z" opacity="0.09"></path>
      <path fill="#FFD200" d="M135.955 26.745c5.761 0 10.43-4.67 10.43-10.43s-4.669-10.43-10.43-10.43c-5.76 0-10.43 4.67-10.43 10.43s4.67 10.43 10.43 10.43z"></path>
      <path
        fill="#FFD200"
        d="M135.955 32.62c9.005 0 16.305-7.3 16.305-16.305 0-9.005-7.3-16.305-16.305-16.305-9.005 0-16.305 7.3-16.305 16.305 0 9.005 7.3 16.305 16.305 16.305z"
        opacity="0.15"
      ></path>
      <path
        fill="#DDDBDB"
        d="M153.744 55.68c-.391.001-.778.07-1.145.205a5.79 5.79 0 00-.601-4.803 5.795 5.795 0 00-10.719 3.048c0 .155 0 .305.025.46a4.194 4.194 0 10-1.9 7.935h14.34a3.42 3.42 0 002.506-.955 3.435 3.435 0 001.05-2.468 3.431 3.431 0 00-1.05-2.467 3.422 3.422 0 00-2.506-.955z"
        opacity="0.64"
      ></path>
      <path
        fill="#fff"
        d="M23.03 63.2a2.284 2.284 0 00-.744.13 3.78 3.78 0 10-7.385-1.14 2.846 2.846 0 000 .295 2.739 2.739 0 10-2.438 4.908c.374.18.783.273 1.198.272h9.37a2.236 2.236 0 100-4.465z"
        opacity="0.48"
      ></path>
      <path
        fill="#DDDBDB"
        d="M16.71 37.315a2.18 2.18 0 00-.745.13c.119-.367.18-.75.18-1.135a3.76 3.76 0 00-7.5 0v.295a2.72 2.72 0 10-1.23 5.145h9.3a2.221 2.221 0 001.638-3.824 2.22 2.22 0 00-1.638-.61h-.005z"
      ></path>
      <path
        fill="#DDDBDB"
        d="M78.925 6.875c-.341.005-.68.069-1 .19A5.001 5.001 0 1068.12 5.74v.395a3.625 3.625 0 10-1.5 6.885l12.385-.235A2.954 2.954 0 0080.997 7.7a2.955 2.955 0 00-2.107-.825h.035z"
        opacity="0.33"
      ></path>
      <path fill="#fff" d="M42.81 58.98h-1.755v2.69h1.755v-2.69z"></path>
      <path fill="#DDDBDB" d="M88.464 24.516H74.11V90.42H100.81V34.846l-12.345-10.33z" opacity="0.53"></path>
      <path
        fill="#fff"
        d="M80.095 51.494h-2.22v3.4h2.22v-3.4zM80.095 60.83h-2.22v3.4h2.22v-3.4zM80.095 70.99h-2.22v3.4h2.22v-3.4zM84.91 70.99h-2.22v3.4h2.22v-3.4zM80.095 80.93h-2.22v3.4h2.22v-3.4zM84.91 80.93h-2.22v3.4h2.22v-3.4z"
      ></path>
      <path fill="#DDDBDB" d="M118.826 43.435h-14.355v65.901H131.171v-55.57l-12.345-10.33z" opacity="0.67"></path>
      <path
        fill="#fff"
        d="M107.96 79.744h-2.22v3.4h2.22v-3.4zM112.775 79.744h-2.22v3.4h2.22v-3.4zM107.96 89.91h-2.22v3.4h2.22v-3.4zM112.775 89.91h-2.22v3.4h2.22v-3.4zM107.96 99.846h-2.22v3.4h2.22v-3.4zM112.775 99.846h-2.22v3.4h2.22v-3.4z"
      ></path>
      <path fill="#DDDBDB" d="M51.935 28.115H39.39V50.68l-5.985-5.005h-14.35v35.12h10.69l-1.03 9.91h17.04V78.38H61.21V28.115h-9.275z" opacity="0.33"></path>
      <path fill="#245B5B" d="M44.445 62.275l12.345 10.33v34.7H39.75l4.695-45.03z"></path>
      <path fill="#000" d="M44.445 62.275l12.345 10.33v34.7H39.75l4.695-45.03z" opacity="0.35"></path>
      <path fill="#fff" d="M47.35 107.304h-.92V63.94l.92.77v42.594zM50.715 107.306h-.92v-40.55l.92.77v39.78z" opacity="0.25"></path>
      <path fill="#fff" d="M53.955 107.305h-.92v-37.85l.92.78v37.07z"></path>
      <path fill="#245B5B" d="M44.445 62.275H30.09v35.12h14.355v-35.12z"></path>
      <path fill={colorPrimaryMain} d="M109.574 71h-21.92v36.255h21.92V71z"></path>
      <path fill="#000" d="M109.574 71h-21.92v36.255h21.92V71z" opacity="0.18"></path>
      <path fill={colorPrimaryMain} d="M96.905 71H82.6v36.255h14.305V71z"></path>
      <path fill="#fff" d="M86.496 73.756h-1.65V89.82h1.65V73.756zM89.92 73.756h-1.65V89.82h1.65V73.756zM93.34 73.756h-1.65V89.82h1.65V73.756z"></path>
      <path fill="#FFD200" d="M68.405 43.69h-15.86v63.564h15.86V43.689z"></path>
      <path fill="#FFD200" d="M80.14 43.69H64.28v63.564h15.86V43.689z"></path>
      <path fill="#000" d="M80.14 43.69H64.28v63.564h15.86V43.689z" opacity="0.09"></path>
      <path fill="#fff" d="M77.624 83.404H66.79v2.025h10.835v-2.025zM77.624 52.97H66.79v2.026h10.835V52.97z" opacity="0.25"></path>
      <path
        fill="#fff"
        d="M107.054 74.99h-7.525v1.62h7.525v-1.62zM107.054 80.39h-7.525v1.62h7.525v-1.62zM107.054 85.96h-7.525v1.62h7.525v-1.62zM107.054 91.53h-7.525v1.62h7.525v-1.62z"
        opacity="0.33"
      ></path>
      <path fill="#fff" d="M77.624 63.135H66.79v2.025h10.835v-2.025zM77.624 73.07H66.79v2.025h10.835V73.07z" opacity="0.25"></path>
      <path
        fill="#fff"
        d="M56.874 52.285h-2.22v3.4h2.22v-3.4zM61.685 52.285h-2.22v3.4h2.22v-3.4zM56.874 62.445h-2.22v3.4h2.22v-3.4zM61.685 62.445h-2.22v3.4h2.22v-3.4zM56.874 72.385h-2.22v3.4h2.22v-3.4zM61.685 72.385h-2.22v3.4h2.22v-3.4zM56.874 82.72h-2.22v3.4h2.22v-3.4zM61.685 82.72h-2.22v3.4h2.22v-3.4z"
      ></path>
      <path fill="#fff" d="M77.624 92.84H66.79v2.025h10.835V92.84z" opacity="0.25"></path>
      <path fill="#fff" d="M56.874 92.15h-2.22v3.4h2.22v-3.4zM61.685 92.15h-2.22v3.4h2.22v-3.4z"></path>
      <path fill={colorPrimaryMain} d="M29.25 82.18H16.29v25.125h12.96V82.18z"></path>
      <path fill={colorPrimaryMain} d="M38.84 82.18H25.88v25.125h12.96V82.18zM25.88 82.18l-5.1-8.7-4.49 8.7h9.59z"></path>
      <path fill={colorPrimaryMain} d="M20.78 73.48H34.8l4.04 8.7H25.88l-5.1-8.7z"></path>
      <path fill="#000" d="M34.8 73.48H20.78l5.1 8.7v25.125h12.96V82.18l-4.04-8.7z" opacity="0.09"></path>
      <path
        fill="#fff"
        d="M20.57 86.436h-2.554v3.13h2.555v-3.13zM24.125 86.436H21.57v3.13h2.555v-3.13zM20.57 94.05h-2.554v3.13h2.555v-3.13zM24.125 94.05H21.57v3.13h2.555v-3.13zM22.77 101.26h-3.48v5.725h3.48v-5.725z"
      ></path>
      <path fill="#FFD200" d="M114.194 85.516h-11.45v22.2h11.45v-22.2zM111.22 85.515l-4.505-7.685-3.965 7.685h8.47z"></path>
      <path fill="#FFD200" d="M119.1 77.83h-12.385l4.505 7.685v22.2h11.45v-22.2l-3.57-7.685z"></path>
      <path fill="#000" d="M119.1 77.83h-12.385l4.505 7.685v22.2h11.45v-22.2l-3.57-7.685z" opacity="0.18"></path>
      <path
        fill="#fff"
        d="M106.525 87.615h-2.255v2.765h2.255v-2.765zM109.669 87.615h-2.255v2.765h2.255v-2.765zM106.525 92.266h-2.255v2.765h2.255v-2.765zM109.669 92.266h-2.255v2.765h2.255v-2.765zM106.525 97.025h-2.255v2.765h2.255v-2.765zM109.669 97.025h-2.255v2.765h2.255v-2.765zM108.475 102.369H105.4v5.055h3.075v-5.055zM60.044 101.26h-3.48v5.725h3.48v-5.725z"
      ></path>
      <path fill="#245B5B" d="M131.585 58.3h-15.86v48.956h15.86V58.301z"></path>
      <path fill="#245B5B" d="M143.321 58.3h-15.86v48.956h15.86V58.301z"></path>
      <path fill="#000" d="M143.321 58.3h-15.86v48.956h15.86V58.301z" opacity="0.35"></path>
      <path
        fill="#fff"
        d="M140.81 83.404h-10.835v2.025h10.835v-2.025zM140.81 63.135h-10.835v2.025h10.835v-2.025zM140.81 73.07h-10.835v2.025h10.835V73.07z"
        opacity="0.33"
      ></path>
      <path
        fill="#fff"
        d="M120.056 62.445h-2.22v3.4h2.22v-3.4zM124.865 62.445h-2.22v3.4h2.22v-3.4zM120.056 72.385h-2.22v3.4h2.22v-3.4zM124.865 72.385h-2.22v3.4h2.22v-3.4zM120.056 82.72h-2.22v3.4h2.22v-3.4zM124.865 82.72h-2.22v3.4h2.22v-3.4zM140.81 92.84h-10.835v2.025h10.835V92.84zM120.056 92.15h-2.22v3.4h2.22v-3.4zM124.865 92.15h-2.22v3.4h2.22v-3.4zM123.224 101.26h-3.48v5.725h3.48v-5.725z"
      ></path>
      <path fill={colorPrimaryMain} d="M82.6 89.39H69.19v17.991H82.6v-17.99zM79.11 89.39l-5.276-9-4.645 9h9.92z"></path>
      <path fill={colorPrimaryMain} d="M88.34 80.39H73.837l5.275 9v17.991h13.405v-17.99l-4.175-9z"></path>
      <path fill="#000" d="M88.34 80.39H73.837l5.275 9v17.991h13.405v-17.99l-4.175-9z" opacity="0.09"></path>
      <path fill={colorPrimaryMain} d="M92.34 93.676h-7.365l2.68 4.57v9.135h6.81v-9.135l-2.125-4.57z"></path>
      <path fill="#000" d="M92.34 93.676h-7.365l2.68 4.57v9.135h6.81v-9.135l-2.125-4.57z" opacity="0.09"></path>
      <path fill="#fff" d="M92.5 100.525h-2.78v3.395h2.78v-3.395z" opacity="0.33"></path>
      <path fill={colorPrimaryMain} d="M84.975 93.676v13.705h2.68v-9.135l-2.68-4.57z"></path>
      <path fill="#fff" d="M83.805 92.856h-2.78v3.395h2.78v-3.395zM83.805 99.574h-2.78v3.395h2.78v-3.395z" opacity="0.33"></path>
      <path fill="#fff" d="M73.11 93.19h-2.645v3.234h2.645V93.19zM77.434 93.19H74.79v3.234h2.645V93.19zM75.95 101.461h-3.6v5.92h3.6v-5.92z"></path>
      <path fill="#FFD200" d="M39.785 94.765l-3.7-6.31-3.255 6.31h6.955zM39.785 94.766H32.83v12.615h6.955V94.766z"></path>
      <path fill="#FFD200" d="M46.256 88.455h-10.17l3.7 6.31v12.615h9.4V94.765l-2.93-6.31z"></path>
      <path fill="#000" d="M46.256 88.455h-10.17l3.7 6.31v12.615h9.4V94.765l-2.93-6.31z" opacity="0.09"></path>
      <path
        fill="#fff"
        d="M35.58 97.43h-1.855v2.27h1.855v-2.27zM38.61 97.43h-1.854v2.27h1.855v-2.27zM37.57 103.23h-2.525v4.15h2.525v-4.15zM36.185 94.065a1.14 1.14 0 100-2.28 1.14 1.14 0 000 2.28z"
      ></path>
      <path fill={colorPrimaryMain} d="M122.67 94.765l-3.7-6.31-3.255 6.31h6.955zM122.67 94.766h-6.955v12.615h6.955V94.766z"></path>
      <path fill={colorPrimaryMain} d="M129.141 88.455h-10.17l3.7 6.31v12.615h9.4V94.765l-2.93-6.31z"></path>
      <path fill="#000" d="M129.141 88.455h-10.17l3.7 6.31v12.615h9.4V94.765l-2.93-6.31z" opacity="0.18"></path>
      <path fill="#fff" d="M118.464 97.43h-1.855v2.27h1.855v-2.27zM121.496 97.43h-1.855v2.27h1.855v-2.27zM120.455 103.23h-2.525v4.15h2.525v-4.15z"></path>
      <path
        fill="#245B5B"
        d="M157.195 107.256H2.13a1.89 1.89 0 00-1.89 1.89v.93a1.89 1.89 0 001.89 1.89h155.065a1.89 1.89 0 001.89-1.89v-.93a1.89 1.89 0 00-1.89-1.89z"
      ></path>
      <path fill="#FFD200" d="M142.211 89.39h-13.41v17.991h13.41v-17.99zM138.716 89.39l-5.27-9-4.645 9h9.915z"></path>
      <path fill="#FFD200" d="M147.945 80.39h-14.5l5.27 9v17.991h13.41v-17.99l-4.18-9z"></path>
      <path fill="#FFD200" d="M151.951 93.676h-7.365l2.675 4.57v9.135h6.81v-9.135l-2.12-4.57z"></path>
      <path fill="#000" d="M147.945 80.39h-14.5l5.27 9v17.991h13.41v-17.99l-4.18-9z" opacity="0.18"></path>
      <path fill="#FFD200" d="M151.951 93.676h-7.365l2.675 4.57v9.135h6.81v-9.135l-2.12-4.57z"></path>
      <path fill="#000" d="M151.951 93.676h-7.365l2.675 4.57v9.135h6.81v-9.135l-2.12-4.57z" opacity="0.18"></path>
      <path fill="#fff" d="M152.104 100.525h-2.78v3.395h2.78v-3.395z" opacity="0.33"></path>
      <path fill="#FFD200" d="M144.586 93.676v13.705h2.675v-9.135l-2.675-4.57z"></path>
      <path fill="#fff" d="M143.415 92.856h-2.78v3.395h2.78v-3.395zM143.415 99.574h-2.78v3.395h2.78v-3.395z" opacity="0.33"></path>
      <path
        fill="#fff"
        d="M132.719 93.19h-2.645v3.234h2.645V93.19zM137.04 93.19h-2.645v3.234h2.645V93.19zM135.561 101.461h-3.6v5.92h3.6v-5.92zM133.586 88.394a1.625 1.625 0 100-3.25 1.625 1.625 0 000 3.25z"
      ></path>
    </svg>
  );
};

City.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default City;
