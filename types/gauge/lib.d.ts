/// <reference types="jquery" />
import { IGaugeConfig, IGaugeData } from "./interface";
export declare class Gauge {
    static degToRands(value?: number): number;
    static percentToRands(value?: number, max?: number): number;
    options: IGaugeConfig;
    el: HTMLElement;
    elLabels: JQuery<HTMLElement>;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    protected default: IGaugeConfig;
    protected defaultData: IGaugeData;
    private centerXFactor;
    private centerYFactor;
    private gaugeSize;
    private labelSize;
    constructor(element: HTMLElement | JQuery<HTMLElement>, opt: IGaugeConfig);
    createCanvas(): void;
    $draw(): void;
    drawBackground(): void;
    drawGauge(data: IGaugeData, offset?: number): void;
    drawLine(rands: number, size: number, color: string, offset?: number): void;
    drawText(data: IGaugeData, offset: number): void;
    htmlText(data: IGaugeData): void;
    private getCenterPoint();
    private checkData();
}
