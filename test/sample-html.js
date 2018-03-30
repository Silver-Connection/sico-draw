$(document).ready(function () {
    var el = $("#gaugeHtml1");
    new sico.draw.Gauge(el, {
        backgroundShow: true,
        canvasHeight: 400,
        canvasWidth: 400,
        data: [
            {
                size: 40,
                value: 50,
                labelColor: "red"
            }
        ],
        deg: 360,
        offset: 180,
        labelHtml: true,
    });

    new sico.draw.Gauge(document.getElementById("gaugeHtml2"), {
        backgroundShow: true,
        canvasHeight: 400,
        canvasWidth: 400,
        data: [
            {
                label: (val) => "Fact. " + val + "%",
                size: 20,
                value: 50,
            },
            {
                color: "red",
                label: (val) => "Avg. " + val + "%",
                labelStyle: "normal normal normal",
                size: 20,
                value: 80,
            },
            {
                color: "green",
                label: (val) => "Proj. " + val + "%",
                size: 20,
                value: 60,
            },
        ],
        deg: 270,
        lineCap: "round",
        labelInverse: true,
        offset: 0,
        labelHtml: true,
        labelCssBase: "a",
    });

    new sico.draw.Gauge(document.getElementById("gaugeHtml3"), {
        backgroundShow: true,
        canvasHeight: 200,
        canvasWidth: 400,
        centerY: "bottom",
        data: [
            {
                size: 20,
                value: 50,
            },
            {
                color: "red",
                label: (val) => "Avg. " + val + "%",
                labelSize: 15,
                labelStyle: "normal normal normal",
                size: 40,
                value: 80,
            },
        ],
        deg: 180,
        labelHtml: true,
    });

    new sico.draw.Gauge(document.getElementById("gaugeHtml4"), {
        backgroundShow: true,
        canvasHeight: 80,
        canvasWidth: 40,
        centerX: "left",
        data: [
            {
                labelSize: 15,
                size: 10,
                value: 50,
            },
        ],
        deg: 180,
        offset: 270,
        labelHtml: true,
    });

    new sico.draw.Gauge(document.getElementById("gaugeHtml5"), {
        backgroundShow: false,
        canvasHeight: 400,
        canvasWidth: 200,
        centerX: "right",
        data: [
            {
                label: (val) => "Fact. " + val + "%",
                size: 20,
                value: 50,
            },
            {
                color: "red",
                label: (val) => "Avg. " + val + "%",
                labelStyle: "normal normal normal",
                size: 20,
                value: 80,
            },
            {
                color: "green",
                label: (val) => "Proj. " + val + "%",
                size: 20,
                value: 60,
            },
            {
                color: "#FAE82B",
                label: (val) => "A. " + val + "%",
                size: 20,
                value: 40,
            },
            {
                color: "#A01C4D",
                label: (val) => "A. " + val + "%",
                size: 20,
                value: 20,
            },
        ],
        deg: 180,
        offset: 90,
        labelHtml: true,
        labelHtmlUseCanvasSize: true
    });

    new sico.draw.Gauge(document.getElementById("gaugeHtml6"), {
        backgroundShow: true,
        canvasHeight: 200,
        canvasWidth: 400,
        centerY: "top",
        data: [
            {
                size: 20,
                value: 50,
            },
            {
                color: "red",
                label: (val) => "Avg. " + val + "%",
                labelSize: 15,
                labelStyle: "normal normal normal",
                size: 40,
                value: 80,
            },
        ],
        deg: 180,
        offset: 0,
        labelHtml: true,
    });
});
