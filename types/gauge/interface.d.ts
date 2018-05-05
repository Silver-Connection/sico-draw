export interface IGaugeConfig {
    autoDraw?: boolean;
    backgroundColor?: string;
    backgroundShow?: boolean;
    canvasHeight: number;
    canvasWidth: number;
    centerX?: "left" | "center" | "right";
    centerY?: "top" | "center" | "bottom";
    deg: number;
    data?: IGaugeData[];
    lineCap?: "butt" | "round" | "square";
    labelInverse?: boolean;
    labelHtml?: boolean;
    labelHtmlUseCanvasSize?: boolean;
    labelCssBase?: string;
    offset?: number;
    scale?: boolean;
    scaleUp?: boolean;
}
export interface IGaugeData {
    value: number;
    label?: string | LabelFunction;
    labelCss?: string;
    labelColor?: string;
    labelFont?: string;
    labelSize?: number;
    labelShow?: boolean;
    labelStyle?: string;
    color?: string;
    size?: number;
}
export declare type LabelFunction = (val: number) => string;
