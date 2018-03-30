/**
 * @summary     sico-draw
 * @description Canvas Helper
 * @version     1.0.0
 * @file        dist/sico.draw.cjs.js
 * @dependencie jQuery
 * @author      Silver Connection OHG
 * @contact     Kiarash G. <kiarash@si-co.net>
 * @copyright   Copyright 2018 Silver Connection OHG
 *
 * This source file is free software, available under the following license:
 *   MIT license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: https://github.com/Silver-Connection/sico-draw
 */
'use strict';

var Gauge = /** @class */ (function () {
    function Gauge(element, opt) {
        this.default = {
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
        };
        this.defaultData = {
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
        this.centerXFactor = 0.5;
        this.centerYFactor = 0.5;
        this.gaugeSize = 0;
        this.labelSize = 0;
        // Wrapper
        if (element === null || element === undefined) {
            // tslint:disable-next-line:no-console
            console.log("Could not find wrapper element");
            return;
        }
        if (element instanceof HTMLElement) {
            this.el = element;
        }
        else {
            this.el = element[0];
        }
        // Configs
        this.options = $.extend(true, this.default, opt);
        this.checkData();
        var flexX = "center";
        if (this.options.centerX === "left") {
            this.centerXFactor = 0;
            flexX = "flex-start";
        }
        else if (this.options.centerX === "right") {
            this.centerXFactor = 1;
            flexX = "flex-end";
        }
        else {
            this.centerXFactor = 0.5;
        }
        var flexY = "center";
        if (this.options.centerY === "top") {
            this.centerYFactor = 0;
            flexY = "flex-start";
        }
        else if (this.options.centerY === "bottom") {
            this.centerYFactor = 1;
            flexY = "flex-end";
        }
        else {
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
    Gauge.degToRands = function (value) {
        if (value === undefined) {
            return Math.PI / 180;
        }
        return value * Math.PI / 180;
    };
    Gauge.percentToRands = function (value, max) {
        if (value === undefined || max === undefined) {
            return Math.PI / 180;
        }
        return value * max / 100 * Math.PI / 180;
    };
    Gauge.prototype.createCanvas = function () {
        this.canvas = document.createElement("canvas");
        this.el.appendChild(this.canvas);
        if (typeof (G_vmlCanvasManager) === "object") {
            G_vmlCanvasManager.initElement(this.canvas);
        }
        this.canvas.height = this.options.canvasHeight;
        this.canvas.width = this.options.canvasWidth;
        var c = this.canvas.getContext("2d");
        if (c !== null) {
            this.context = c;
        }
        var scaleBy = 1;
        if (window.devicePixelRatio > 1) {
            scaleBy = window.devicePixelRatio;
            this.canvas.width = this.canvas.width * scaleBy;
            this.canvas.height = this.canvas.height * scaleBy;
            this.context.scale(scaleBy, scaleBy);
        }
        // Clear
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Gauge.prototype.$draw = function () {
        // Draw background
        if (this.options.backgroundShow) {
            this.drawBackground();
        }
        // Draw data lines
        if (this.options != undefined
            && this.options.data != undefined
            && this.options.data.length > 0) {
            var offsetLine = 0;
            var offsetText = this.options.labelHtml ? 0 : 1;
            for (var _i = 0, _a = this.options.data; _i < _a.length; _i++) {
                var data = _a[_i];
                this.drawGauge(data, offsetLine);
                offsetLine += data.size;
            }
            var ll = this.options.labelInverse ? this.options.data.reverse() : this.options.data;
            for (var _b = 0, ll_1 = ll; _b < ll_1.length; _b++) {
                var data = ll_1[_b];
                if (data.labelShow) {
                    if (!this.options.labelHtml) {
                        this.drawText(data, offsetText);
                        offsetText += (data.labelSize || 0) + 10;
                    }
                    else {
                        this.htmlText(data);
                    }
                }
            }
        }
    };
    Gauge.prototype.drawBackground = function () {
        var rands = Gauge.degToRands(this.options.deg);
        this.drawLine(rands, this.gaugeSize, this.options.backgroundColor, 0);
    };
    Gauge.prototype.drawGauge = function (data, offset) {
        if (offset === void 0) { offset = 0; }
        var rands = Gauge.percentToRands(data.value, this.options.deg);
        this.drawLine(rands, data.size, data.color, offset);
    };
    Gauge.prototype.drawLine = function (rands, size, color, offset) {
        if (offset === void 0) { offset = 0; }
        // Arc
        var center = this.getCenterPoint();
        var radius = (this.canvas.width / 2) - (size / 2) - offset;
        if (this.canvas.width < this.canvas.height) {
            radius = (this.canvas.height / 2) - (size / 2) - offset;
        }
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, Gauge.degToRands(this.options.offset), rands + Gauge.degToRands(this.options.offset), false);
        this.context.strokeStyle = color;
        this.context.lineWidth = size;
        this.context.lineCap = this.options.lineCap;
        this.context.stroke();
        this.context.closePath();
    };
    Gauge.prototype.drawText = function (data, offset) {
        var center = this.getCenterPoint();
        var font = (data.labelStyle + " " + data.labelSize + "px " + data.labelFont).trim();
        var label = "";
        if (typeof data.label === "function") {
            label = data.label(data.value);
        }
        else {
            label = data.label || "";
        }
        this.context.textAlign = this.options.centerX || this.default.centerX;
        this.context.font = font;
        var y = center.y - offset;
        if (this.options.centerY === "center") {
            y = center.y - offset + this.labelSize / 2;
        }
        else if (this.options.centerY === "top") {
            y = offset + this.labelSize / 2;
        }
        this.context.fillStyle = data.labelColor;
        this.context.fillText(label, center.x, y);
    };
    Gauge.prototype.htmlText = function (data) {
        var label = "";
        if (typeof data.label === "function") {
            label = data.label(data.value);
        }
        else {
            label = data.label || "";
        }
        var css = this.options.labelCssBase;
        if (data.labelCss) {
            css += " " + data.labelCss;
        }
        this.elLabels.append('<span class="' + css + '">' + label + "</span>");
    };
    Gauge.prototype.getCenterPoint = function () {
        return {
            x: this.canvas.width * this.centerXFactor,
            y: this.canvas.height * this.centerYFactor,
        };
    };
    Gauge.prototype.checkData = function () {
        if (this.options != undefined && this.options.data != undefined && this.options.data.length > 0) {
            for (var i = 0; i < this.options.data.length; i++) {
                this.options.data[i] = $.extend(true, {}, this.defaultData, this.options.data[i]);
                if (this.options.data[i].label === undefined) {
                    this.options.data[i].label = this.options.data[i].value + "%";
                }
                // Total size
                this.gaugeSize += this.options.data[i].size;
                this.labelSize += this.options.data[i].labelSize;
            }
        }
    };
    return Gauge;
}());

var main = {
    Gauge: Gauge
};

module.exports = main;