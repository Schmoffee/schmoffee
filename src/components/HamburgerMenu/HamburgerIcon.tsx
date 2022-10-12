import * as React from 'react';
import Svg, { Line } from 'react-native-svg';

interface HamburgerIconProps {
    width?: number;
    navigation: any;
}
const HamburgerIcon = (props: HamburgerIconProps) => {
    return (
        <Svg
            width="46"
            height="36"
            viewBox="0 0 46 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Line
                x1="8"
                y1="6"
                x2="38"
                y2="6"
                stroke="#046D66"
                strokeWidth="3.75"
                strokeLinecap="round"
            />
            <Line
                x1="8"
                y1="18"
                x2="38"
                y2="18"
                stroke="#046D66"
                strokeWidth="3.75"
                strokeLinecap="round"
            />
            <Line
                x1="8"
                y1="30"
                x2="38"
                y2="30"
                stroke="#046D66"
                strokeWidth="3.75"
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default HamburgerIcon;
