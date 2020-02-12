var bg_audio = "./audio/bg.mp3"
var line_read = "./audio/line_read.mp3"
var line_call = "./audio/line_call.mp3"
var line_call_end = "./audio/line_call_end.mp3"
var dong = "./audio/dongdong.mp3"

var cover = [{url: "./img/0.png"}];
var static_background = [{url: "./img/1.png"}];
var animated_backgrounds = [{url: "./img/0.png", timeout: 2}, {url: "./img/1.png", timeout: 2}];
var animated_backgrounds_offsets = [{url: "./img/0.png", timeout: 1}, {url: "./img/0.png", timeout: 1, up: 50}, {url: "./img/0.png", timeout: 1, up: -50}, {url: "./img/0.png", timeout: 1, left: 50}, {url: "./img/0.png", timeout: 1, left: -50}];
var animated_backgrounds_random = [{url: "./img/1.png"}, {url: "./img/1.png", left: 10, up: -20}];

var scene = {
    1000:{
        description: "Cover page",
        background: cover,
        story: [""],
        btn_middle: {
            text: "Starts",
            class: "start-game", // css class
            scene: 1001,
        },
    },

    1001:{
        description: "Descriptions are for developers only. Not shown to players.",
        background: static_background,
        story: [
            "Story here. Each element in this list will be a paragraph which also wraps itself automatically.",
            "Each page contains at most 3 elements as designed. If the length is more than 3, an left-aligned CONTINUE button will be added. You can alternate the wording at the var _continue from constants.js.",
            "",
            "Therefore change of page can be also practiced by adding an empty line as above.",
        ],
        btn_left: {
            text: "Next",
            scene: 2001,
        },
    },
    2001:{
        description: "Horizontal Buttons",
        background: static_background,
        story: [
            "Attributes for buttons are:",
            "1. text : the wording\
             2. scene: the destination after clicking on this button\
             3. class: the css class",
        ],
        btn_left: {
            text: "Next (Left)",
            scene: 2002,
        },
        btn_middle: {
            text: "Next (Middle)",
            scene: 2002,
        },
        btn_right: {
            text: "Next (Right)",
            scene: 2002,
        },
    },
    2002:{
        description: "Vertical Buttons",
        background: static_background,
        story: [
            "Buttons can be horizontal/vertical aligned.",
            "It is recommended to use one alignment at a time to avoid unexpected behaviour.",
            "Besides the way they are aligned, the attributes are all the same.",
        ],
        btn_upper: {
            text: "Next (Upper)",
            scene: 2003,
        },
        btn_center: {
            text: "Next (Center)",
            scene: 2003,
        },
        btn_lower: {
            text: "Next (Lower)",
            scene: 2003,
        },
    },
    2003:{
        description: "Image Buttons",
        background: static_background,
        story: [
            "You can also use images as buttons.",
            "img_btn: An Array of Arrays. Each sub-array should has their first element as the url and the second element as the destination. The third element is optional. If set, should be an object with keys of {'up', 'left', 'height', 'width', 'rotation'}",
        ],
        img_btn: [["./img/2.jpg", 3001, {width: 170, height: 120}], ["./img/3.jpg", 3001, {width: 170, height: 120, rotate: 90}]],
    },

    3001:{
        description: "Background Images",
        background: animated_backgrounds,
        background_sequenced_random: 2,
        story: [
            "Attributes for backgrounds are:",
            "1. url    : Url for the image in absolute or relative format.",
            "2. timeout: If set and the Array has multiple objects, timeout until next background; if unset, timeout will be random. (explained later).",
        ],
        btn_left: {
            text: "Next",
            scene: 3002,
        },
    },
    3002:{
        description: "Animated Backgrounds: offset",
        background: animated_backgrounds_offsets,
        story: [
            "3. left/up: Horizontal/vertical offset of the image. So you don't have to align the photo elsewhere. For right/down direction, use negative values.",
        ],
        btn_left: {
            text: "Next",
            scene: 3003,
        },
    },
    3003:{
        description: "Animated Backgrounds: random timeout",
        background: animated_backgrounds_random,
        story: [
            "Background variabel is a JS Array with Objects.",
            "That is, static background is an Array with length == 1. If more, the images will be shown in sequence with random timeout in between 0 to 3 secs. This can attain an animation effect.",
        ],
        btn_left: {
            text: "Next",
            scene: 4001,
        },
    },
    4001:{
        description: "Messaging",
        background: static_background,
        story: [
            "Messages are constructed by an Array of Objects also. Attributes are:",
            "1. type: type belongs to {'outgoing dialing', 'incoming cancelled', 'received', 'read', 'sent-above'}\
            2. message: A String  that will be shown. Note that this is dependant to type.\
            3. timeout: Timeout until this Object to be shown.",
            "Implementation examples are as followed.",
        ],
        btn_left: {
            text: "Next",
            scene: 4002,
        },
    },
    4002: {
        description: "Messaging-demo",
        background: static_background, 
        line: [
        {type: "received", message: "It is recommended to add a small timeout before the first message.", timeout: 1},
        {type: "received", message: "'received' message comes from the other side.", timeout: 2},
        {type: "sent", message: "'sent' message has no 'read' prepended.", timeout: 2},
        {type: "read", message: "'read' message attach the 'read' directly.", timeout: 2},
        {type: "read-above", timeout: 3},
        {type: "read", message: "'read-above' make the unread messages read.", timeout: 1},

        {type: "outgoing dialing", timeout: 5},
        {type: "incoming cancelled", timeout: 1},
        {type: "sent", message: "'outgoing dialing' has no message. ", timeout: 1},
        {type: "received", message: "'incoming cancelled' has no message", timeout: 2},
        {type: "incoming dialing", timeout: 5},
        {type: "outgoing cancelled", timeout: 1},
        {type: "received", message: "'incoming dialing' has no message. ", timeout: 1},
        {type: "sent", message: "'outgoing cancelled' has no message", timeout: 2},
        ],
        btn_left: {
            text: "Next",
            scene: 4002,
        },
    },
    4003: {
        description: "Messaging-image",
        background: static_background, 
        line: [
        {type: "sent", img: "./img/2.jpg", timeout: 1},
        {type: "sent", message: "You can also send an image."},
        {type: "received", img: "./img/3.jpg", timeout: 1},
        {type: "received", message: "Or receive image.", timeout: 5},
        ],
        btn_left: {
            text: "Next",
            scene: 5001,
        },
    },

    5001: {
        description: "Messaging-image",
        background: static_background, 
        story: [
            "Image story, which helps adjust the animation easier, is an Array with Objects.",
            "Backgrounds are set at image_story, instead of the background attribute before.",
            "",
        ],
        btn_left: {
            text: "Next",
            scene: 5002,
        },
    },
    5002 : {
        description: "Image Story",
        story_delay: 1,
        btn_delay: 3,
        story: [
            "story_delay determines the timeout until the story appears from the beginning.\
            btn_delay detemines the timeout until the buttons appear after the final image is shown.",
            "Attributes for the Objects are:",
            "1. url       : Url for the image in absolute or relative format.\
             2. timeout   : Timeout from previous image.\
             3. transition: The transition delay.",
        ],
        image_story: [
        {url: "./img/2.jpg"},
        {url: "./img/3.jpg", timeout: 2, transition: 3}
        ],
        btn_left: {
            text: "Next",
            scene: 6001,
        },
    },
    6001: {
        description: "Story: Additional settings",
        background: static_background,
        text_color: "#333",
        story_header: "2018/10/1",
        page_turn: true,
        story: [
        "page_turn   : Powered by turnjs.com, and is set to {true, false}.",
        "story_header: An additional heading above the story paragraph.",
        "text_color  : Set the story text color dynamically.",
        ],
        btn_left: {
            text: "Next",
            scene: 6002,
        },
    },
    6002: {
        description: "Story: static_image",
        background: static_background,
        story: [
        "static_image: An array of objects that allow you to put images on top of the background.",
        "bgm         : You can also set the customized audio effect of this scene.",
        ],
        static_image: [
            {url: "./img/2.jpg", up: 100, height: 200, width: 100},
            {url: "./img/3.jpg", left: 200, up: 150, height: 200, width: 100, rotate: 45},
        ],
        bgm: [
            {url: dong},
        ],
        btn_left: {
            text: "Play Again",
            scene: 1000,
        },
    },
}
