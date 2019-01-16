MAX_STORY_PARAGRAPH = 3
class StoryGame {
	constructor(game, scene){
		this.screen = $("#game");
		this.s = scene;
		this.self = this;
		this.curr_scene;
		this.story_section = 0;
		// this.backgrounds = {};
		// this.raw_backgrounds = bgs;
	}

	start(){
		if (this.s == null){
			console.log("[error] Scene is not set.");
			return;
		}
		this.prepare_screen();

		// GET params
		var url = new URL(window.location.href);
		var scene = url.searchParams.get("scene");
		this.render((scene == undefined) ? (window.location.hash.length == 0) ? 2001 : window.location.hash.substring(1, window.location.hash.length) : scene);
	}

	preload_all_img(){
		let self = this;
		let str_url = "";
		for (var bg in this.raw_backgrounds) {
			for (var raw_img in this.raw_backgrounds[bg]){
				let img = new Image();
				img.src = this.raw_backgrounds[bg][raw_img].url;
				str_url = str_url + " url('" + img.src + "'')";
				if(this.backgrounds[bg] != undefined){
					let tmp_obj = [this.raw_backgrounds[bg][raw_img]];
					tmp_obj.url = img.src;
					this.backgrounds[bg].push(this.raw_backgrounds[bg][raw_img]);
				}
				else {
					let tmp_obj = [this.raw_backgrounds[bg][raw_img]];
					tmp_obj.url = img.src;
					this.backgrounds[bg] = tmp_obj;
				}
			}
		}
		$("body:after").css("content", str_url);
		console.log(str_url)
		this.loading(false);
	}

	loading(flag) {
		if (flag){
			$("#game").addClass("hidden");
			$("#loading").html("Loading");
		}
		else {
			$("#game").removeClass("hidden");
			$("#loading").html("");
		}
	}

	render(n_s) {
		var s = this.s[n_s];
		this.curr_scene = n_s;
		if (s == undefined) {
			console.log("[error] Scene is undefined.")
			return;
		}
		/* clear up */
		$(this.screen).html("");

		/* prepare background */
		console.log(s.background)
		if (s.background != undefined){
			let background = s.background
			this.render_background(background);
		}

		/* story */
		if (s.story != undefined && s.story.length > 0){
			if (s.auto_render != undefined){

			}
			else {
				this.render_story(s);
			}
		}
		else if (s.line != undefined && s.line.length > 0) {
			if (s.auto_render != undefined){
				this.render_line(s, {
					timeout: s.auto_render.timeout,
					args: s.auto_render.scene,
					});
			}
			else {
				this.render_line(s);
			}
		}
		else if (s.image_story != undefined && s.image_story.length > 0){
			if (s.auto_render != undefined){
				this.render_image_story(s, {
					timeout: s.auto_render.timeout,
					args: s.auto_render.scene,
					});
			}
			else {
				this.render_image_story(s);
			}
		}
	}

	prepare_screen() {
		$(this.screen).css("position", "relative");
		$(this.screen).css("top", "50%");
		$(this.screen).css("-webkit-transform", "translateY(-50%)");
		$(this.screen).css("-ms-transform", "translateY(-50%);");
		$(this.screen).css("transform", "translateY(-50%);");
		$(this.screen).css("width", this.width+"px");
		$(this.screen).css("height", this.height+"px");
		$(this.screen).css("margin-left", "calc((100% - "+this.width+"px )/2)");
		$(this.screen).css("padding-left", "38px");
		$(this.screen).css("padding-right", "38px");
	}

	btn_handler(btn, actions, self) {
		var scene = this.s;
		// var render = this.render;
		$(btn).on("click", function(){
			if (actions.scene != undefined) {
				self.render(actions.scene);
			}
		});
	}

	render_background(bg) {
		if (bg.length == undefined || bg.length == 1) {
			if (bg.transition != undefined){
				this.screen.css({"transition": "background "+bg.transition+"s linear"});
			}
			else {
				this.screen.css({"transition": ""});
			}
			if (bg.url == undefined){
				$(this.screen).css("background", "url("+bg+")");
			}
			else{
				$(this.screen).css("background", "url("+bg.url+")");
			}
			$(this.screen).css("background-size", this.width+"px "+this.height+"px");
			if (bg.left != undefined) {
				$(this.screen).css("background-position-x", bg.left+"px");
			}
			if (bg.right != undefined) {
				$(this.screen).css("background-position-y", bg.right+"px");
			}			
		}
		else if (bg.length > 1) {
			this.background_shuffle(bg, 0, this.curr_scene);
		}
	}

	background_shuffle(bg, index, curr_s) {
		var background_shuffle = this.background_shuffle;
		var self = this;
		this.render_background(bg[index])
		setTimeout(function(){
			index = (index + 1) % bg.length;
			if (curr_s == self.curr_scene){
				self.background_shuffle(bg, index, self.curr_scene);
			}
		}, Math.random()*10000%3000)
	}

	render_story(s) {
		var story = $("<div>", {class: "story-wrapper"});
		if (s.story_color != undefined){
			story.css({"color": s.story_color});
		}
		else if (s.text_color != undefined) {
			story.css({"color": s.text_color});
		}
		if (s.story_date != undefined){
			story.append($("<p>", {class: "story story-date", text: s.story_date}));
		}
		let start = this.story_section * MAX_STORY_PARAGRAPH;
		let end = this.story_section * MAX_STORY_PARAGRAPH + (MAX_STORY_PARAGRAPH);
		let story_section;
		if (end >= s.story.length){
			story_section = s.story.slice(start);
		}
		else {
			story_section = s.story.slice(start, end);
		}
		$.each(story_section, function(i, j){
			story.append($("<p>", {class: "story story-content", text: j}));
		})
		$(this.screen).append(story);
		/* buttons */
		if (end >= s.story.length){
			this.story_section = 0;
			this.render_buttons(s);
		}
		else {
			this.story_section += 1;
			this.render_buttons({
				text_color: s.text_color,
				btn_left:{text: "繼續", scene: this.curr_scene}
			})
		}

	}

	render_line(s, callback) {
		var line = $("<div>", {class: "line-wrapper"});
		var timeout_count = 0;
		var row;
		var self = this;
		$(this.screen).append(line);
		$.each(s.line, function(i, j){
			if (j.timeout == undefined) {
				j.timeout = 0;
			}
			timeout_count += j.timeout;
			setTimeout(function(){
				if (j.type == "read") {
					row = $("<p>", {class: "line line-right text-right"});
					row.append($("<span>", {class: "line-read", text: "已讀"}));
					if (j.message != undefined){
						row.append($("<span>", {class: "line-msg", text: j.message}));
					}
					else if (j.img != undefined) {
						if (j.img.length == 1){
							j.img = [j.img];
						}
						for (let k of j.img){
							row.append($("<img>", {class: "line-msg", src: k}));
						}
					}
					line.append(row);
				}
				else if (j.type == "read-above") {
					$.each(line.find("p.line-right"), function(k, v){
						if ($(v).find("span.line-read").length == 0){
							$(v).prepend($("<span>", {class: "line-read", text: "已讀"}));
						}
					});
				}
				else if (j.type == "sent") {
					row = $("<p>", {class: "line line-right text-right"});
					if (j.message != undefined){
						row.append($("<span>", {class: "line-msg", text: j.message}));
					}
					else if (j.img != undefined) {
						if (j.img.length == 1){
							j.img = [j.img];
						}
						for (let k of j.img){
							row.append($("<img>", {class: "line-msg", src: k}));
						}
					}
					line.append(row);
				}
				else if (j.type == "received") {
					row = $("<p>", {class: "line line-left text-left"});
					if (j.message != undefined){
						row.append($("<span>", {class: "line-msg", text: j.message}));
					}
					else if (j.img != undefined) {
						if (j.img.length == 1){
							j.img = [j.img];
						}
						for (let k of j.img){
							row.append($("<img>", {class: "line-msg", src: k}));
						}
					}
					line.append(row);
				}
				else if (j.type == "outgoing dialing") {
					row = $("<p>", {class: "line line-right text-right"});
					row.append($("<span>", {class: "line-msg line-call", text: "撥打中..."}));
					line.append(row);
				}
				else if (j.type == "outgoing cancelled") {
					row = $("<p>", {class: "line line-right text-right"});
					row.append($("<span>", {class: "line-msg line-call", text: "取消通話"}));
					line.append(row);
				}
				else if (j.type == "incoming dialing") {
					row = $("<p>", {class: "line line-left text-left"});
					row.append($("<span>", {class: "line-msg line-call", text: "撥打中..."}));
					line.append(row);
				}
				else if (j.type == "incoming cancelled") {
					row = $("<p>", {class: "line line-left text-left"});
					row.append($("<span>", {class: "line-msg line-call", text: "取消通話"}));
					line.append(row);
				}
				if (line[0].scrollHeight < 240 && line.height() > 170) {
					line.css("top", parseFloat(line.css("top"))-row.height()+"px");
				}
				if (line[0].scrollHeight > 240){
					line.css("top", "10px");
					line.animate({scrollTop: line[0].scrollHeight}, 500);
					// line.css({scrollTop: line[0].scrollHeight}, 500);
				}
				if (i == s.line.length - 1) {
					if (callback != undefined) {
						if (callback.timeout != undefined) {
							setTimeout(self.render(callback.args), callback.timeout*1000);
						}
						else if (callback.args != undefined) {
							self.render(callback.args);
						}
						else {
							callback();
						}
					}
					else {
						/* buttons */
						self.render_buttons(s);
					}
				}
			}, timeout_count*1000);
		});
	}

	render_image_story(s, callback) {
		var image_story = $("<div>", {class: "image-story-wrapper"});
		var timeout_count = 0;
		var row;
		var self = this;
		$(this.screen).append(image_story);
		if (s.image_story.length > 0){
			let i = 0;
			while (i < s.image_story.length) {
				let j = s.image_story[i];
				let curr_i = i;
				if (j.timeout == undefined) {
					j.timeout = 0;
				}
				timeout_count += j.timeout;
				setTimeout(function(){
					self.render_background(j);

					if (curr_i == s.image_story.length - 1) {
						if (callback != undefined) {
							if (callback.timeout != undefined) {
								setTimeout(self.render(callback.args), callback.timeout);
							}
							else if (callback.args != undefined) {
								self.render(callback.args);
							}
							else {
								callback();
							}
						}
						else {
							/* buttons */
							if (j.timeout != undefined) {
								setTimeout(function(){
									self.render_buttons(s)
								}, j.timeout * 1000);
							}
							else {
								self.render_buttons(s);
							}
						}
					}
				}, timeout_count*1000);
				i += 1;
			}
		}
		$.each(s.image_story, function(i, j){
		});
	}

	render_buttons(s) {
		if (s.btn_left != undefined || s.btn_middle != undefined || s.btn_right != undefined) {
			var btns = $("<div>", {class: "btn-wrapper"});
			if (s.btn_left != undefined){
				$("<a>", {
					id: "btn-1", 
					href: "#",
					class: "btn btn-default",
					text: s.btn_left.text,
				}).appendTo(btns);
			}
			if (s.btn_middle != undefined){
				$("<a>", {
					id: "btn-2", 
					href: "#",
					class: "btn btn-default",
					text: s.btn_middle.text,
				}).appendTo(btns);
			}
			if (s.btn_right != undefined){
				$("<a>", {
					id: "btn-3", 
					href: "#",
					class: "btn btn-default",
					text: s.btn_right.text,
				}).appendTo(btns);
			}
			$(this.screen).append(btns);
			if (s.btns_color != undefined) {
				btns.css({
					"color": s.btns_color,
					"border-color": s.text_color,
				});
			}
			else if (s.text_color != undefined) {
				btns.find(".btn").css({
					"color": s.text_color,
					"border-color": s.text_color,
				});
			}
			this.btn_handler("#btn-1", s.btn_left, this.self);
			this.btn_handler("#btn-2", s.btn_middle, this.self);
			this.btn_handler("#btn-3", s.btn_right, this.self);
		}
	}

}