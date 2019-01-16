var AUTO_MAKE_CHILD = true;
var AUTO_EXPAND = false;
class StoryTree {
	constructor(r, s) {
		this.root = $('#'+r);
		this.scene = s;
	}

	make_tree() {
		let keys = Object.keys(this.scene).map(x => parseInt(x));
		let n_root = Math.min(...keys);
		this.make_scene(n_root).appendTo(this.root);
	}

	make_scene(n) {
		let row = $("<div>", {class: "row"});
		let div_scene = $("<div>", {
			class: "col",
		}).appendTo(row);
		div_scene.appendTo(this.root);
		this.make_node(n, div_scene);
		this.make_content(n, div_scene);
		this.make_child(n, div_scene);
		return row;
	}

	make_node(n, div) {
		let scene = this.scene[n];
		div.append($("<a>", {
			class: "btn btn-primary text-white",
			text: n,
			"data-toggle": "collapse",
			href: "#content-"+n,
			role: "button",
			"aria-expanded": "false",
		}).append($("<span>", {text: scene.description})))
	}

	make_content(n, div) {
		let scene = this.scene[n];
		let _content = $("<div>", {
			class: !AUTO_EXPAND ? "collapse" : null,
			id: "content-"+n,
		});

		if (scene.story != undefined) { // story
			for (let j of scene.story) {
				_content.append($("<p>", {class: "text-center", text: j}));
			}
		}
		else if (scene.line != undefined) { // line
			for (let j of scene.line) {
				if (j.message != undefined){
					_content.append($("<p>", {class: "text-left", text: j.type+", "+j.message}));
				}
				else {
					_content.append($("<p>", {class: "text-left font-weight-bold", text: j.type}));
				}
			}
		}
		_content.appendTo(div);
	}

	make_child(n, div) {
		let scene = this.scene[n];
		let row = $("<div>", {class: "row"}).appendTo(div);
		if (scene.btn_left != undefined) {
			let _col = $("<div>", {
				class: "col-xs-4"
			});
			_col.appendTo(row);
			_col.append($("<a>", {
				class: "col-xs-4 btn btn-success mx-1 text-white",
				text: "btn_left: "+scene.btn_left.scene,
			}));
			if (AUTO_MAKE_CHILD) {
				this.make_scene(scene.btn_left.scene, row).appendTo(_col);
			}
		}
		if (scene.btn_middle != undefined) {
			let _col = $("<div>", {
				class: "col-xs-4"
			});
			_col.appendTo(row);
			_col.append($("<a>", {
				class: "col-xs-4 btn btn-success mx-1 text-white",
				text: "btn_middle: "+scene.btn_middle.scene,
			}));
			if (AUTO_MAKE_CHILD) {
				this.make_scene(scene.btn_middle.scene, row).appendTo(_col);
			}
		}
		if (scene.btn_right != undefined) {
			let _col = $("<div>", {
				class: "col-xs-4"
			});
			_col.appendTo(row);
			_col.append($("<a>", {
				class: "col-xs-4 btn btn-success mx-1 text-white",
				text: "btn_right: "+scene.btn_right.scene,
			}));
			if (AUTO_MAKE_CHILD) {
				this.make_scene(scene.btn_right.scene, row).appendTo(_col);
			}
		}

	}
}