import { IGaugeConfig, IGaugeData } from "./interface";

declare var G_vmlCanvasManager: any;

export class Gauge {
    public static degToRands(value?: number): number {
        if (value === undefined) {
            return Math.PI / 180;
        }
        return value * Math.PI / 180;
    }

    public static percentToRands(value?: number, max?: number): number {
        if (value === undefined || max === undefined) {
            return Math.PI / 180;
        }
        return value * max / 100 * Math.PI / 180;
    }

    public options!: IGaugeConfig;
    public el!: HTMLElement;
    public elLabels!: JQuery<HTMLElement>;
    public canvas!: HTMLCanvasElement;
    public context!: CanvasRenderingContext2D;

    protected default: IGaugeConfig =
        {
            autoDraw: true,
            backgroundColor: "#E3DBCB",
            backgroundShow: true,
            canvasHeight: 300,
            canvasWidth: 600,
            centerX: "center",
            centerY: "center",
            data: undefined,
            deg: 180,
            lineCap: "butt",
            labelInverse: false,
            labelHtml: false,
            labelHtmlUseCanvasSize: false,
            labelCssBase: undefined,
            offset: 180,
            scale: false,
            scaleUp: false,
        };

    protected defaultData: IGaugeData =
        {
            color: "#0382A0",
            label: undefined,
            labelCss: undefined,
            labelColor: "#727272",
            labelFont: "sans-serif",
            labelShow: true,
            labelSize: 20,
            labelStyle: "normal normal bold",
            size: 10,
            value: 0,
        };

    private centerXFactor: number = 0.5;
    private centerYFactor: number = 0.5;
    private gaugeSize: number = 0;
    private labelSize: number = 0;

    constructor(element: HTMLElement | JQuery<HTMLElement>, opt: IGaugeConfig) {
        // Wrapper
        if (element === null || element === undefined) {
            // tslint:disable-next-line:no-console
            console.log("Could not find wrapper element");
            return;
        }

        if (element instanceof HTMLElement) {
            this.el = element;
        } else {
            this.el = element[0];
        }

        // Configs
        this.options = $.extend(true, this.default, opt);
        this.checkData();
        let flexX = "center";
        if (this.options.centerX === "left") {
            this.centerXFactor = 0;
            flexX = "flex-start";
        } else if (this.options.centerX === "right") {
            this.centerXFactor = 1;
            flexX = "flex-end";
        } else {
            this.centerXFactor = 0.5;
        }

        let flexY = "center";
        if (this.options.centerY === "top") {
            this.centerYFactor = 0;
            flexY = "flex-start";
        } else if (this.options.centerY === "bottom") {
            this.centerYFactor = 1;
            flexY = "flex-end";
        } else {
            this.centerYFactor = 0.5;
        }

        // HTML Labels
        if (this.options.labelHtml) {

            this.elLabels = $("<div></div)");
            this.elLabels.css({
                "position": "absolute",
                "top": 0,
                "left": 0,
                "height": this.options.labelHtmlUseCanvasSize ? this.options.canvasHeight : "100%",
                "width": this.options.labelHtmlUseCanvasSize ? this.options.canvasWidth : "100%",
                "display": "flex",
                "flex-direction": "column",
                "justify-content": flexY,
                "align-items": flexX,
            });

            $(this.el).css({
                "position": "relative",
            }).append(this.elLabels);
        }

        // Create and draw Canvas
        this.createCanvas();
        if (this.options.autoDraw) {
            this.$draw();
        }
    }

    public createCanvas() {
        this.canvas = document.createElement("canvas");
        this.el.appendChild(this.canvas);

        if (typeof (G_vmlCanvasManager) === "object") {
            G_vmlCanvasManager.initElement(this.canvas);
        }

        this.canvas.height = this.options.canvasHeight;
        this.canvas.width = this.options.canvasWidth;
        const c = this.canvas.getContext("2d");
        if (c !== null) {
            this.context = c;
        }

        let scaleBy = 1;
        if (this.options.scale && window.devicePixelRatio > 1) {
            scaleBy = window.devicePixelRatio;
            if (!this.options.scaleUp) {
                scaleBy = 1 / window.devicePixelRatio;
            }

            this.canvas.width = this.canvas.width * scaleBy;
            this.canvas.height = this.canvas.height * scaleBy;
            this.context.scale(scaleBy, scaleBy);
        }

        // Clear
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public $draw() {
        // Draw background
        if (this.options.backgroundShow) {
            this.drawBackground();
        }

        // Draw data lines
        if (this.options != undefined
            && this.options.data != undefined
            && this.options.data.length > 0) {
            let offsetLine = 0;
            let offsetText = this.options.labelHtml ? 0 : 1;
            for (const data of this.options.data) {
                this.drawGauge(data, offsetLine);
                offsetLine += data.size!;
            }

            const ll = this.options.labelInverse ? this.options.data.reverse() : this.options.data;
            for (const data of ll) {
                if (data.labelShow) {
                    if (!this.options.labelHtml) {
                        this.drawText(data, offsetText);
                        offsetText += (data.labelSize || 0) + 10;
                    } else {
                        this.htmlText(data);
                    }
                }
            }
        }
    }

    public drawBackground() {
        const rands = Gauge.degToRands(this.options.deg);
        this.drawLine(rands, this.gaugeSize, this.options.backgroundColor!, 0);
    }

    public drawGauge(data: IGaugeData, offset: number = 0) {
        const rands = Gauge.percentToRands(data.value, this.options.deg);
        this.drawLine(rands, data.size!, data.color!, offset);
    }

    public drawLine(rands: number, size: number, color: string, offset: number = 0) {
        // Arc
        const center = this.getCenterPoint();
        let radius = (this.canvas.width / 2) - (size / 2) - offset;
        if (this.canvas.width < this.canvas.height) {
            radius = (this.canvas.height / 2) - (size / 2) - offset;
        }

        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, Gauge.degToRands(this.options.offset), rands + Gauge.degToRands(this.options.offset), false);
        this.context.strokeStyle = color;
        this.context.lineWidth = size;
        this.context.lineCap = this.options.lineCap!;
        this.context.stroke();
        this.context.closePath();
    }

    public drawText(data: IGaugeData, offset: number) {
        const center = this.getCenterPoint();
        const font = (data.labelStyle + " " + data.labelSize + "px " + data.labelFont).trim();

        let label = "";
        if (typeof data.label === "function") {
            label = data.label(data.value);
        } else {
            label = data.label || "";
        }

        this.context.textAlign = this.options.centerX || this.default.centerX!;
        this.context.font = font;

        let y = center.y - offset;
        if (this.options.centerY === "center") {
            y = center.y - offset + this.labelSize / 2;
        } else if (this.options.centerY === "top") {
            y = offset + this.labelSize / 2;
        }

        this.context.fillStyle = data.labelColor!;
        this.context.fillText(label, center.x, y);
    }

    public htmlText(data: IGaugeData) {
        let label = "";
        if (typeof data.label === "function") {
            label = data.label(data.value);
        } else {
            label = data.label || "";
        }

        let css = this.options.labelCssBase!;
        if (data.labelCss) {
            css += " " + data.labelCss;
        }

        this.elLabels.append('<span class="' + css + '">' + label + "</span>");
    }

    private getCenterPoint() {
        return {
            x: this.canvas.width * this.centerXFactor,
            y: this.canvas.height * this.centerYFactor,
        };
    }

    private checkData() {
        if (this.options != undefined && this.options.data != undefined && this.options.data.length > 0) {
            for (let i = 0; i < this.options.data.length; i++) {
                this.options.data[i] = $.extend(true, {}, this.defaultData, this.options.data[i]);
                if (this.options.data[i].label === undefined) {
                    this.options.data[i].label = this.options.data[i].value + "%";
                }

                // Total size
                this.gaugeSize += this.options.data[i].size!;
                this.labelSize += this.options.data[i].labelSize!;
            }
        }
    }
}