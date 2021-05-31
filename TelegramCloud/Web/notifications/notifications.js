/*
	text - string (Required)
	element - document.Element (document.body)
	autohide - boolean (true)
	ms - integer (5000) (milliseconds)
	buttons - array ( [button_name] )
					( [[button_name, function]] )
*/

notifications_element = ""
counter = 1
async function Warning(text, arg1, arg2, arg3, arg4){
	arr = check_elements(text, arg1, arg2, arg3, arg4)
	await NewWarning(arr.text, arr.elem, arr.autohide, arr.ms, arr.buttons)
}
async function Error(text, arg1, arg2, arg3, arg4){
	arr = check_elements(text, arg1, arg2, arg3, arg4)
	await NewError(arr.text, arr.elem, arr.autohide, arr.ms, arr.buttons)
}
async function Success(text, arg1, arg2, arg3, arg4){
	arr = check_elements(text, arg1, arg2, arg3, arg4)
	await NewSuccess(arr.text, arr.elem, arr.autohide, arr.ms, arr.buttons)
}

function check_elements(text, arg1, arg2, arg3, arg4){
	if (!notifications_element){
		elem = document.body;
	}
	else{
		elem = notifications_element
	}
	autohide=true; ms=5000; buttons=null;

	if ((!text) || (typeof(text) != "string")){
		throw "The variable 'text' is not defined";
	}

	if (typeof(arg1) == "object"){
		if (Array.isArray(arg1)){
			buttons=arg1;
		}
		else{
			elem=arg1;
		}
	}
	if (typeof(arg1) == "boolean"){
		autohide=arg1;
	}
	if (typeof(arg1) == "number"){
		ms=arg1;
	}


	if (typeof(arg2) == "object"){
		if (Array.isArray(arg2)){
			buttons=arg2;
		}
		else{
			elem=arg2;
		}
	}
	if (typeof(arg2) == "boolean"){
		autohide=arg2;
	}
	if (typeof(arg2) == "number"){
		ms=arg2;
	}


	if (typeof(arg3) == "object"){
		if (Array.isArray(arg3)){
			buttons=arg3;
		}
		else{
			elem=arg3;
		}
	}
	if (typeof(arg3) == "boolean"){
		autohide=arg3;
	}
	if (typeof(arg3) == "number"){
		ms=arg3;
	}


	if (typeof(arg4) == "object"){
		if (Array.isArray(arg4)){
			buttons=arg4;
		}
		else{
			elem=arg4;
		}
	}
	if (typeof(arg4) == "boolean"){
		autohide=arg4;
	}
	if (typeof(arg4) == "number"){
		ms=arg4;
	}

	return {text: text, autohide: autohide, ms: ms, buttons: buttons}
}

async function NewWarning(text, elem, autohide=true, ms=5000, buttons=null){
	if (!elem){
		if (!notifications_element){
			elem = document.body;
		}
		else{
			elem = notifications_element
		}
	}
	div_el = await NewNotice("warning", text, buttons)
	elem.appendChild(div_el);
	await new Promise(resolve => setTimeout(resolve, 20));
	div_el.style.opacity = 1;
	div_el.style.transform = "scale(1)";

	$($("#notification_"+counter)).on('click', function(e) {
		closeMessage($(this).closest('.Message'));
	});

	if (autohide){
		hide_notification(counter, ms)
	}
	counter++;
	await new Promise(resolve => setTimeout(resolve, 400));
}
async function NewWarning2(args){
	text = args.text;
	if (!text){
		throw "The variable 'text' is not defined in the function NewWarning2";
	}
	elem = args.element || notifications_element || document.body;
	autohide = args.autohide
	if (args.autohide == undefined) autohide = true;
	ms = args.ms || 5000;
	buttons = args.buttons || null;

	await NewWarning(text, elem, autohide, ms, buttons)
}
async function NewError(text, elem, autohide=true, ms=5000, buttons=null){
	if (!elem){
		if (!notifications_element){
			elem = document.body;
		}
		else{
			elem = notifications_element
		}
	}
	div_el = await NewNotice("error", text, buttons)
	elem.appendChild(div_el);
	await new Promise(resolve => setTimeout(resolve, 20));
	div_el.style.opacity = 1;
	div_el.style.transform = "scale(1)";

	$($("#notification_"+counter)).on('click', function(e) {
		closeMessage($(this).closest('.Message'));
	});

	if (autohide){
		hide_notification(counter, ms)
	}
	counter++;
	await new Promise(resolve => setTimeout(resolve, 400));
}
async function NewError2(args){
	text = args.text;
	if (!text){
		throw "The variable 'text' is not defined in the function NewError2";
	}
	elem = args.element || notifications_element || document.body;
	autohide = args.autohide
	if (args.autohide == undefined) autohide = true;
	ms = args.ms || 5000;
	buttons = args.buttons || null;

	await NewError(text, elem, autohide, ms, buttons)
}
async function NewSuccess(text, elem, autohide=true, ms=5000, buttons=null){
	if (!elem){
		if (!notifications_element){
			elem = document.body;
		}
		else{
			elem = notifications_element
		}
	}
	div_el = await NewNotice("success", text, buttons)
	elem.appendChild(div_el);
	await new Promise(resolve => setTimeout(resolve, 20));
	div_el.style.opacity = 1;
	div_el.style.transform = "scale(1)";

	$($("#notification_"+counter)).on('click', function(e) {
		closeMessage($(this).closest('.Message'));
	});

	if (autohide){
		hide_notification(counter, ms)
	}
	counter++;
	await new Promise(resolve => setTimeout(resolve, 400));
}
async function NewSuccess2(args){
	text = args.text;
	if (!text){
		throw "The variable 'text' is not defined in the function NewSuccess2";
	}
	elem = args.element || notifications_element || document.body;
	autohide = args.autohide
	if (args.autohide == undefined) autohide = true;
	ms = args.ms || 5000;
	buttons = args.buttons || null;

	await NewSuccess(text, elem, autohide, ms, buttons)
}
async function NewNotice(what, text, buttons=null){
	div = document.createElement('div');
	if (what == "warning") div.className = 'Message Message--orange';
	if (what == "error") div.className = 'Message Message--red';
	if (what == "success") div.className = 'Message Message--green';
	div.id = "notification_" + counter;

	icon = document.createElement('div');
	icon.className = 'Message-icon';
	i = document.createElement('i');
	if (what == "warning") i.className = 'fa fa-exclamation';
	if (what == "error") i.className = 'fa fa-times';
	if (what == "success") i.className = 'fa fa-check';
	icon.appendChild(i);
	div.appendChild(icon);

	msg_body = document.createElement('div');
	msg_body.className = 'Message-body';
	p = document.createElement('p');
	p.innerHTML = text;
	msg_body.appendChild(p);
	if (buttons){
		for (i=0;i<buttons.length;i++){
			button = document.createElement('button');
			button.className = 'Message-button';
			if (typeof(buttons[i]) == "object"){
				button.innerHTML = buttons[i][0]
				button.onclick = buttons[i][1]
			}
			if (typeof(buttons[i]) == "string"){
				button.innerHTML = buttons[i]
			}
			msg_body.appendChild(button);
		}
	}
	div.appendChild(msg_body);

	but = document.createElement('button');
	but.className = 'Message-close';
	i = document.createElement('i');
	i.className = "fa fa-times"
	but.appendChild(i);

	div.appendChild(but);
	div.style.opacity = 0;
	div.style.transform = "scale(0)";
	return div;
}


function closeMessage(el, selector=false) {
	if (!selector){
		closeNotification(el.context)
	}
	el.addClass('is-hidden');
	setTimeout(function(){el.addClass('hide')}, 500);
}

function hide_notification(count, ms){
	setTimeout(function() {
		closeNotification(document.getElementById('notification_'+count))
		closeMessage($('#notification_'+count), true);
	}, ms);
}

async function closeNotification(el_){
	el_.style.opacity = 0;
	el_.style.transform = "scale(0)";
	await new Promise(resolve => setTimeout(resolve, 0));
}
