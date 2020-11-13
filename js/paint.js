//PANEL


function change_background_color (argument) {

	var canvas = document.getElementById("canvas");
	canvas.style.background = document.getElementById("bcolor").value;
}

function change_background_size (argument) {

	var canvas = document.getElementById("canvas");
	var w = (document.getElementById("bwidth").value);
	var h = (document.getElementById("bheight").value);

	if (w > 1024) {
		w = 1024;
	};

	if (h > 768) {
		 h = 768;
	};

	if (w < 256) {
		w = 256;
	};

	if (h < 256) {
		h = 256;
	};


	canvas.width =  w;
	canvas.height = h;

	according_to_image(backup);
}

// EDITOR

var color = "#000000";
var size = 10;
var sw = 1;
var pencil_sw = false;
var eraser_sw = false;


// Activators

// outside the editor
function mouse_off_the_board(event) {
	turn_off_pencil();
}

// pencil

function turn_off_pencil() {
	pencil_sw = false;
	eraser_sw = false;
}

function turn_on_pencil() {
	sw = 1;
	var canvas = document.getElementById("canvas");
	canvas.style.cursor = "url(img/pencil-up.png), auto" ;
}

// seal
function turn_on_seal() {
	sw = 2;
	change_pixel_size();
}

// eraser

function turn_on_eraser() {
	sw = 3;
	change_pixel_size();
}

// Drawing tools

function pencil (event) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var position = canvas.getBoundingClientRect();

	var x = event.clientX - position.left;
	var y = event.clientY - position.top;

	if (pencil_sw) {
		ctx.fillStyle = color;
		ctx.fillRect(x,y,size,size);
		create_segment(color,size,x,y);
		update_code_box(color,size,x,y);
	};

}

function seal (a,b) {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var position = canvas.getBoundingClientRect();

	var x = a - position.left;
	var y = b - position.top;

	ctx.fillStyle = color;
	ctx.fillRect(x,y,size,size);

	create_segment(color,size,x,y);
	update_code_box(color,size,x,y);
}

function eraser (event) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var position = canvas.getBoundingClientRect();

	var x = event.clientX - position.left;
	var y = event.clientY - position.top;

	if (eraser_sw) {
		ctx.clearRect(x,y,size,size);
		create_segment("eraser",size,x,y);
		update_code_box("eraser",size,x,y);
	};

}


function eraser_seal (a,b) {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var position = canvas.getBoundingClientRect();

	var x = a - position.left;
	var y = b - position.top;

	ctx.clearRect(x,y,size,size);

	create_segment("eraser",size,x,y);
	update_code_box("eraser",size,x,y);


}
// Brush planner


function draw(event) {

	var x = event.clientX;
	var y = event.clientY;

	switch (sw) {

		case 1:
	  		pencil_sw = true;
	  		//seal(x,y);
	  		break;

	  	case 2:
	    	seal(x,y);
	    	break;
	    case 3:
	    	eraser_sw = true;
	    	eraser_seal(x,y);
	    	break;

	  	default:
	    	pencil_sw = true;
	    	break;
	}
}


// Edit stroke and cursor

function change_pixel_size (argument) {
	size = document.getElementById("psize").value;


	if (sw == 2) {
		if (size >= 10) {
			var canvas = document.getElementById("canvas");
			var name = size.toString() + "x" + size.toString() + ".gif" ;
			var cursorurl = "url(img/seal/" + name + "), auto" ;
		 	canvas.style.cursor = cursorurl ;
	 	}
	 	else {
	 		var canvas = document.getElementById("canvas");
		 	canvas.style.cursor = "context-menu";
	 	}
	 }

	 else if (sw == 3) {
		if (size >= 10) {
			var canvas = document.getElementById("canvas");
			var name = size.toString() + "x" + size.toString() + ".gif" ;
			var cursorurl = "url(img/eraser/" + name + "), auto" ;
		 	canvas.style.cursor = cursorurl ;
	 	}
	 	else {
	 		var canvas = document.getElementById("canvas");
		 	canvas.style.cursor = "context-menu";
	 	}

	 }
	
}

function change_pixel_color (argument) {
	color = document.getElementById("pcolor").value;
}


// Output Elements

// show coordinates in editor

function update_coordinates (event) {

	var canvas = document.getElementById('canvas');
	var position = canvas.getBoundingClientRect();

	document.getElementById("cx").innerHTML = event.clientX - position.left;
	document.getElementById("cy").innerHTML = event.clientY - position.top;
}

// box code 

function update_code_box(c,s,x,y) {

	var box = document.getElementById("code-box");

	if (c == "eraser") {
		box.innerHTML += "<p class='code'> ctx.clearRect("+x+","+y+","+s+","+s+");</p>";
	}
	else {
		box.innerHTML += "<p class='code'> ctx.fillStyle = " + c + ";</p>";
		box.innerHTML += "<p class='code'> ctx.fillRect(" +x+ "," +y+ "," +s+ "," + s + ");</p>";
	}
}

function empty_code_box() {
	var box = document.getElementById("code-box");
	box.innerHTML = "<p class='code'>var canvas = document.getElementById('canvas');</p>";
	box.innerHTML += "<p class='code'>var ctx = canvas.getContext('2d');</p>";	
}

function undo_code_box() {
	empty_code_box();

	for (var i = 0 ; i <= backup.length; i++) {
		update_code_box(backup[i].color,backup[i].size,backup[i].position_x,backup[i].position_y);
	}
}

// Save img

function save_img (argument) {
	var canvas = document.getElementById("canvas");
	var imagen = canvas.toDataURL("image/png");
	this.href = imagen;	
}

//Backup Draw

var backup = [];


// segments with values ​​to create pixel

function create_segment(c,s,x,y) {
	var segment = {color: c, size: s, position_x: x, position_y: y};
	backup.push(segment);
}

// create drawing from segment arrangement 

function according_to_image(a) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	for (var i = 0; i <= a.length - 1; i++) {

		if (a[i].color == "eraser") {

			ctx.clearRect(a[i].position_x,a[i].position_y,a[i].size,a[i].size);

		} else {
			ctx.fillStyle = a[i].color;
			ctx.fillRect(a[i].position_x,a[i].position_y,a[i].size,a[i].size);	
		}
		
	}
}

// empty arrangement

function empty_arrangement() {

	var opc = confirm("¿Esta seguro que desea de eliminar el contenido?");

	if (opc) {
		backup = [];
		update_panel();
		empty_code_box();
	}
}

// undo last segment created

function undo_segment() {
	backup.pop();
	update_panel();
	undo_code_box();
}

// update drawing

function update_panel() {

	var canvas = document.getElementById("canvas");
	var w = (document.getElementById("bwidth").value);
	var h = (document.getElementById("bheight").value);

	canvas.width =  w;
	canvas.height = h;

	according_to_image(backup);
}



// Key Board

function keyboard_control(event) {

	var key = event.keyCode;

	var s = document.getElementById("psize");
 	
 	if (key ==  107) {
 		s.value++;
 		change_pixel_size();
 	}
 	if (key == 109) {
 		s.value--;
 		change_pixel_size();
 	}
 } 