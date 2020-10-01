// Vincent Class contains drawing logic to canvas

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.selected = false;
        this.neighbour = false;
        this.id = parseInt(Math.random() * 100000)
    }

    distance({x, y}) {
        return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    }

    select(point, radius) {
        let selected = false;
        if (this.x === point.x && this.y === point.y) {
            selected = true;
        }

        if (this.distance(point) <= radius) {
            selected = true;
        }

        this.selected = selected;
        return this.selected;
    }
}

class Vincent {
    constructor(canvasElement) {
        this.canvas = canvasElement;

        this.pointColor = '#111111';
        this.pointRadius = 3;

        this.lineColor = '#aaa';

        return this.canvas === undefined ? false : true;
    }

    init() {
        this.context = this.canvas.getContext('2d');
    }

    clear() {
        this.context.clearRect (0, 0, canvas.width, canvas.height);
    }

    line(from, to, color = this.lineColor) {
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    rect(from, to, color = this.lineColor) {
        this.context.strokeStyle = color;
        this.context.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
    }

    point({x, y}, color = this.pointColor) {
        this.context.beginPath();
        this.context.arc(x, y, this.pointRadius, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
    }

    circle({x, y}, radius, color = this.lineColor) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.context.strokeStyle = color;
        this.context.stroke();
    }
}