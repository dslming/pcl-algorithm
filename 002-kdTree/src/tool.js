/**
 * 使用canvas绘制序号的纹理
 * @param {*} index 显示的序号
 */
export function getTextureByCanvas({
	txt,
	color = "rgb(255, 255, 255)",
	size = 36,
	withArrow = false
} = {}) {
	const width = 64;

	// Number
	const canvas = document.createElement("canvas");
	const scale = window.devicePixelRatio;
	canvas.width = width * scale;
	canvas.height = width * scale;
	const ctx = canvas.getContext("2d");
	const x = canvas.width / 2;
	const y = canvas.width / 2;

	ctx.fillStyle = color;
	ctx.font = `bold ${size}px arial`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(`${txt}`, x, y);

	if (withArrow) {
		ctx.moveTo(20, 15);
		ctx.lineTo(45, 15);
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.moveTo(33, 8);
		ctx.lineTo(44, 15);
		ctx.lineWidth = 3;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	ctx.scale(scale, scale);
	const numberTexture = new THREE.CanvasTexture(canvas);
	return numberTexture;
}


/**
 * 一个字符串是否包含一个数组
 * @param {*} param0
 */
export function isIncludes({ src = "", target = [] } = {}) {
	for (let i = 0; i < target.length; i++) {
		let t = target[i];
		if (src.includes(t)) {
			return true;
		}
	}
	return false;
}

export function getTimestamp() {
	return new Date().getTime();
}

/**
 * 字符串rgba转数组
 * @param {string} color "rgba(1,2,3,4)"
 * @param {boolean} normalized 是否被255归一化
 * @param {boolean} ios 是否对苹果设备支持
 * @return {array} [1,2,3,4]
 * @note ios=false,苹果设备会报错,不能运行
 */
export function rgba2arr(color, normalized = true, ios = true) {
	let ret = [];

	if (ios) {
		let temp = color.split(",")
		let i = temp[0].indexOf("(")
		temp[0] = temp[0].slice(i + 1)

		let j = temp[2].indexOf(")")
		temp[2] = temp[2].slice(0, j)
		ret = temp
	} else {
		// // 去除所有空格
		// color = color.replace(/\s*/g, "");
		// // 取出rgba值
		// let colorStr = new RegExp(/(?<=\()\S+(?=\))/).exec(color);

		// if (colorStr) {
		// 	ret = colorStr[0].split(",");
		// 	ret = ret.map(item => {
		// 		return Number.parseFloat(item, 2);
		// 	});
		// }
	}


	if (normalized) {
		ret = ret.map(item => {
			return (item = +item / 255);
		});
	}
	return ret;
}


/**
 * 获取url 的参数
 * @param {*} variable
 * @param {*} type
 */
export function getQuery(variable, type) {
	var query = window.location.search.substring(1);
	var pair = query.split("=");
	if (pair[0] == variable) {
		if (type == "Boolean") {
			ret = pair[1] == "true" ? true : false
		}
		return ret;
	}
	return (false);
}


export function isDev() {
	return window.location.href.includes("localhost")
}

/**
 * 返回5位数的字符串id
 */
export function getId() {
	let num = Math.random() * 100000
	return num.toFixed(0)
}

export function getType(params) {
	if (Array.isArray(params)) {
		return "array"
	}

	if (params.indexOf) {
		return "string"
	}

	if (parseFloat(val).toString() == "NaN") {
		return "number"
	}

	if (typeof params == "function") {
		return "function"
	}

	return "unkonw"
}


export function canvas2img(canvas) {
	canvas.toBlob(function (blob) {
		var a = document.createElement("a");
		document.body.appendChild(a);
		let time = new Date().getTime()
		a.download = time + ".png";
		a.href = window.URL.createObjectURL(blob);
		a.click();
		document.body.removeChild(a)
	});
}
