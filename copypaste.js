//Typed in the allmigty dvorak layout
//Some helper fenctiens coded by AI
// Extracts a rectangular matrix from (x, y) with width w and height h
function pluckMatrix(x, y, w, h) {
	var result = [];
	for (var j = 0; j < h; j++) {
		var row = [];
		for (var i = 0; i < w; i++) {
			var px = pixelMap[x + i]?.[y + j];
			if (px) {
				row.push({
					element: px.element,
					temp: px.temp,
					color: px.color
				});
			} else {
				row.push(null);
			}
		}
		result.push(row);
	}
	return result;
}

// Compress a single row using RLE (nulls + identical object blocks)
function compressRow(row) {
	var compressed = [];
	var count = 0;
	var last = null;

	for (var i = 0; i < row.length; i++) {
		var current = row[i];

		// Compare stringified versions for identical objects
		var same = JSON.stringify(current) === JSON.stringify(last);

		if (same) {
			count++;
		} else {
			if (last !== null) {
				if (count > 1) {
					compressed.push(["repeat", last, count]);
				} else {
					compressed.push(last);
				}
			}
			last = current;
			count = 1;
		}
	}

	// Push the final sequence
	if (last !== null) {
		if (count > 1) {
			compressed.push(["repeat", last, count]);
		} else {
			compressed.push(last);
		}
	}

	return compressed;
}

// Compress the full matrix
function compressMatrix(matrix) {
	return matrix.map(compressRow);
}

// Decompress a single row
function decompressRow(row) {
	var decompressed = [];

	for (var i = 0; i < row.length; i++) {
		var item = row[i];

		if (Array.isArray(item) && item[0] === "repeat") {
			var obj = item[1];
			var count = item[2];
			for (var j = 0; j < count; j++) {
				decompressed.push(obj);
			}
		} else {
			decompressed.push(item);
		}
	}

	return decompressed;
}

// Decompress full matrix
function decompressMatrix(matrix) {
	return matrix.map(decompressRow);
}

var copyOnce = false;
var pasteOnce = false;

// Tool definitions (logic handled outside)
elements.copy = {
	name: "copy to clipboard",
	color: ["#f5c211"],
	tool: function(pixel) {},
	category: "tools",
	excludeRandom: true,
};

elements.paste = {
	name: "paste from clipboard",
	color: ["#813d9c"],
	tool: function(pixel) {},
	category: "tools",
	excludeRandom: true,
};

// Clipboard interaction on mousedown
document.addEventListener("mousedown", () => {
	if (currentElement === "copy" && !copyOnce) {
		copyOnce = true;

		var { x, y } = mousePos;
		var size = mouseSize || 1;

		var rawMatrix = pluckMatrix(x, y, size, size);
		var matrix = compressMatrix(rawMatrix);

		navigator.clipboard.writeText(JSON.stringify({
			matrix: matrix,
			x: x,
			y: y
		})).then(() => {
			console.log("Copied " + size + "x" + size + " matrix to clipboard.");
		}).catch(err => {
			console.error("Copy failed:", err);
		});
	}

	if (currentElement === "paste" && !pasteOnce) {
		pasteOnce = true;

		var { x, y } = mousePos;

		navigator.clipboard.readText().then(text => {
			var data = JSON.parse(text);
			var matrix = decompressMatrix(data.matrix);

			for (var j = 0; j < matrix.length; j++) {
				for (var i = 0; i < matrix[j].length; i++) {
					var cell = matrix[j][i];
					if (cell && cell.element) {
						var px = createPixel(cell.element, x + i, y + j);
						if (px && typeof cell.temp === "number") {
							px.temp = cell.temp;
						}
						if (px && typeof cell.color === "string") {
							px.color = cell.color;
						}
					}
				}
			}
			console.log("Pasted matrix at", x, y);
		}).catch(err => {
			console.error("Paste failed:", err);
		});
	}
});

// Reset flags on mouse release
document.addEventListener("mouseup", () => {
	copyOnce = false;
	pasteOnce = false;
});
