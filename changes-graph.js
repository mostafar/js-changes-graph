
function ChangesGraph(element, width, height) {
	this.element = element;
	this.cellWidth = width ? width: 32;
	this.cellHeight = height ? height: 32;

	this.element.style['position'] = 'relative';
	this.element.style['padding'] = '0px';

	this.calcChildrenCount();

    var wrapper = document.createElement('div');
    wrapper.style['position'] = 'absolute';
	this.element.insertBefore(wrapper, this.element.firstChild);

	var svg = this.buildSVG(this.getViewTable());
    wrapper.appendChild(svg);

    var items = this.element.querySelectorAll('li');

    for (var i = 0; i < items.length; i++) {
        items[i].style['line-height'] = this.cellHeight + 'px';
        items[i].style['margin-left'] = (Number(svg.getAttribute('width')) + 15) + 'px';
    }
}

ChangesGraph.prototype = {
	calcChildrenCount: function () {
        var items = this.element.querySelectorAll('li');

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            item.setAttribute('x-children', '0');

			var parent = item.getAttribute('x-parent');

			if (parent != 'null') {
				var children = Number(this.element.querySelector('li[x-id="' + parent + '"]').getAttribute('x-children'));

				this.element.querySelector('li[x-id="' + parent + '"]').setAttribute('x-children', children + 1)
			}
		}
	},

	getViewTable: function () {
        var items = this.element.querySelectorAll('li');

        var table = [];
        for (var index = 0; index < items.length; index++) {
            var item = items[index];

			var row = [];

			if (table.length) {
				var last = table[table.length - 1];

				for (var i = 0; i < last.length; i++) {
				    var node = last[i];

				    if (node.children == 1) {
				        row.push({
				            id: node.id,
				            type: 'L',
				            children: 1,
				            parentColumn: i
				        });
					} else if (node.children > 1) {
				        row.push({
				        	id: node.id,
				        	type: 'L',
				        	children: 1,
				            parentColumn: i
				    	});

				        row.push({
				        	id: node.id,
				        	type: 'L',
				        	children: node.children - 1,
				            parentColumn: i
				    	});
				    }
				}
			}

			var found = false;
			for (var i = 0; i < row.length; i++) {
				var node = row[i];

				if (node.id == item.getAttribute('x-parent')) {
				    node.id = item.getAttribute('x-id');
				    node.type = 'O';
				    node.children = Number(item.getAttribute('x-children'));

				    found = true;
				    break;
				}
			}

			if (!found) {
				row.push({
					id: item.getAttribute('x-id'),
					type: 'O',
					children: Number(item.getAttribute('x-children')),
					parentColumn: null
				});
			}

			table.push(row);
		}

		return table;
	},

	makeSVGElement: function (tag, attrs) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs) el.setAttribute(k, attrs[k]);
		return el;
    },

	buildSVG: function (table) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

		var maxWidth = 0;

		for (var i = 0; i < table.length; i++) {
			if (table[i].length > maxWidth) maxWidth = table[i].length;

			for (var j = 0; j < table[i].length; j++) {
				var cell = {
					x: (j + 0.5) * this.cellWidth,
					y: (i + 0.5) * this.cellHeight
				};

				if (table[i][j].parentColumn != null) {
					var link = this.makeSVGElement('line', {
						x1: table[i][j].parentColumn * this.cellWidth + this.cellWidth / 2,
						y1: cell.y - this.cellHeight,
						x2: cell.x,
						y2: cell.y,
						'stroke': '#000',
						'stroke-linecap': 'round'
					});

                    link.setAttribute('class', 'link');

                    svg.appendChild(link);
				}
			}
		}

		for (var i = 0; i < table.length; i++) {
			for (var j = 0; j < table[i].length; j++) {
				if (table[i][j].type == 'O') {
					var node = this.makeSVGElement('circle', {
						cx: (j + 0.5) * this.cellWidth,
						cy: (i + 0.5) * this.cellHeight,
						r: Math.min(this.cellWidth, this.cellHeight) / 4
					});

                    node.setAttribute('class', 'node');

                    svg.appendChild(node);
				}
			}
		}

		svg.setAttribute('width', maxWidth * this.cellWidth);
		svg.setAttribute('height', table.length * this.cellHeight);

		return svg;
	}
};
