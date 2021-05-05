async function main(){
	await eel.starting()();
	document.getElementById('path_str').innerHTML = await eel.get_saved_path()();
	setup_arrow();
	await gotopath(document.getElementById('path_str').innerHTML, auto=true);
}

async function setup_arrow(){
	curent_arrow = await eel.get_curent_arrow()();
	if (curent_arrow == "by_alphabet"){
		document.getElementById("by_alphabet_arrow").innerHTML = "&darr;";
		document.getElementById("by_date_arrow").innerHTML = "";
	}
	if (curent_arrow == "by_alphabet_reverse"){
		document.getElementById("by_alphabet_arrow").innerHTML = "&uarr;";
		document.getElementById("by_date_arrow").innerHTML = "";
	}
	if (curent_arrow == "by_date"){
		document.getElementById("by_alphabet_arrow").innerHTML = "";
		document.getElementById("by_date_arrow").innerHTML = "&darr;";
	}
	if (curent_arrow == "by_date_reverse"){
		document.getElementById("by_alphabet_arrow").innerHTML = "";
		document.getElementById("by_date_arrow").innerHTML = "&uarr;";
	}
}

showed_updates_menu = false;
async function check_updates(){
	document.body.style.cursor = "wait";
	document.getElementById('check_update').style.cursor = "wait";
	unswer = await eel.check_updates()();
	if (unswer['new_updates']){
		showed_updates_menu = true;
		document.getElementById("updates_menu").style.display = "block";
		document.getElementById("new_version").innerHTML = unswer['new_version'];
		document.getElementById("old_version").innerHTML = unswer['old_version'];
		document.getElementById("change_list").innerHTML = unswer['change_list'];
	}
	else{
		alert("Нет обновлений!")
	}
	document.body.style.cursor = "auto";
	document.getElementById('check_update').style.cursor = "pointer";
}
function hide_updates_menu(){
	showed_updates_menu = false;
	document.getElementById("updates_menu").style.display = "none";
}
async function goto_git_hub(){
	eel.goto_git_hub()();
}

function build_progress(elem, id){
	let p = document.createElement('p');
	$(p).attr("class", "progress_text");
	p.innerHTML = elem;

	let bar = document.createElement('progress');
	$(bar).attr("id", "progress_" + id);
	$(bar).attr("max", 100);
	$(bar).attr("value", 0);

	let a = document.createElement('a');
	$(a).attr("id", "a_" + id);

	p.appendChild(bar);
	p.appendChild(a);
	progress_area.appendChild(p);
}

var srcEvent = false;
async function get_src(){
	if (!srcEvent){
		srcEvent = true;
		var array = await eel.get_path()();
		if (array.length == 0 || array == "" || array == null){
			;
		}
		else{
			global_array = array;
			progress_area = document.getElementById('progress_area');
			progress_area.innerHTML = "";

			names = new Array();
			var i = 1;
			array.forEach(function(file){
				splited = file.split('/');
				name = splited[splited.length-1];
				if (names.length == 0){
					names.push("'" + name + "'");
				}
				else{
					names.push(" '" + name + "'");
				}
				build_progress(name, i)
				i+=1;
			}
			)
			if (array.length == 1){
				document.getElementById("path_text").value = array[0];
			}
			else{
				document.getElementById("path_text").value = names;
			}
		}

		setTimeout(function() {srcEvent = false;}, 10);
		upload();
	}
}

eel.expose(progres);
function progres(x, y, percents) {
	document.getElementById('progress_' + x).value = percents;
	document.getElementById('a_' + x).innerHTML = percents + "%";
}


function clip_path(){
	x = 2
	while (document.getElementById('Path').offsetWidth > 320){
		path_area = document.getElementById('Path');
		path_area.innerHTML = "";

		a1 = document.createElement('a');
		a1.innerHTML = "...";
		$(a1).attr("class", "path_link");
		$(a1).attr("onclick", "gotopath('/');");
		path_area.appendChild(a1);

		a2 = document.createElement('a');
		a2.innerHTML = "/";
		path_area.appendChild(a2);

		arr = document.getElementById('path_str').innerHTML.split('/');
		for (let i = x; i < arr.length; i++){
			if (arr[i] != ""){
				main_a = document.createElement('a');

				main_a.innerHTML = arr[i];
				$(main_a).attr("class", "path_link");
				str = "/";
				for (let y = 1; y < i; y++){
					str += arr[y] + "/";
				}
				$(main_a).attr("onclick", "gotopath('"+str+arr[i]+"/');");

				path_area.appendChild(main_a);

				a = document.createElement('a');
				a.innerHTML = "/";
				path_area.appendChild(a);
			}
		}
		x += 1;
	}
}

async function build_browser(array){
	let browser = document.getElementById('FileBrowser')
	browser.innerHTML = "";

	// Кнопка Назад
	let back = document.createElement('div');
	$(back).attr("id", "back");
	$(back).attr("class", "element");
	$(back).attr("title", "< Назад");
	$(back).attr("onclick", "change_dir('back')");

	let back_img = document.createElement('img');
	$(back_img).attr("src", "images/more.png");
	back.appendChild(back_img);
	browser.appendChild(back);

	// Кнопка сортировки
	let sort = document.createElement('div');
	$(sort).attr("id", "sorting");
	$(sort).attr("title", "Сортировка");
	$(sort).attr("onclick", "show_sort_menu(event)");

	let sort_img = document.createElement('img');
	$(sort_img).attr("src", "images/sorting.png");
	sort.appendChild(sort_img);
	browser.appendChild(sort);

	// hr
	hr = document.createElement('hr');
	$(hr).attr("align", "center");
	browser.appendChild(hr);

	// Папки
	for (let i = 0; i < array['folders'].length; i++){
		main_div = document.createElement('div');
		$(main_div).attr("class", "folder element");
		$(main_div).attr("id", "folder:" + array['folders'][i]);
		$(main_div).attr("onclick", "change_dir('open','"+array['folders'][i]+"')");

		img = document.createElement('img');
		$(img).attr("src", "images/folder.png");

		div_text = document.createElement('div');
		div_text.innerHTML = array['folders'][i];
		$(div_text).attr("class", "element_name");
		$(div_text).attr("title", array['folders'][i]);
		
		main_div.appendChild(img);
		main_div.appendChild(div_text);

		// Функции
		div = document.createElement('div');
		$(div).attr("class", "functions");
		
		img1 = document.createElement('img');
		$(img1).attr("src", "images/draw.png");
		$(img1).attr("title", "Переименовать");
		$(img1).attr("onclick", "rename('folder','"+array['folders'][i]+"');");

		img2 = document.createElement('img');
		$(img2).attr("src", "images/trash.png");
		$(img2).attr("title", "Удалить");
		$(img2).attr("onclick", "delete_('folder','"+array['folders'][i]+"');");

		div.appendChild(img1);
		div.appendChild(img2);


		main_div.appendChild(div);
		browser.appendChild(main_div);
	}

	if (array['folders'].length != 0){
		// hr
		hr = document.createElement('hr');
		$(hr).attr("align", "center");
		browser.appendChild(hr);
	}

	// Файлы
	for (let i = 0; i < array['files'].length; i++){
		if (array['files'][i] != ""){
			main_div = document.createElement('div');
			$(main_div).attr("class", "file element");
			$(main_div).attr("onclick", "show_details('"+array['files'][i]+"')");
			$(main_div).attr("id", "file:" + array['files'][i]);

			img = document.createElement('img');
			$(img).attr("src", await eel.file_type(array['files'][i])());

			div_text = document.createElement('div');
			div_text.innerHTML = array['files'][i];
			$(div_text).attr("class", "element_name");
			$(div_text).attr("title", array['files'][i]);
			
			main_div.appendChild(img);
			main_div.appendChild(div_text);

			// Функции
			div = document.createElement('div');
			$(div).attr("class", "functions");
			
			img1 = document.createElement('img');
			$(img1).attr("src", "images/draw.png");
			$(img1).attr("title", "Переименовать");
			$(img1).attr("onclick", "rename('file','"+array['files'][i]+"');");

			img2 = document.createElement('img');
			$(img2).attr("src", "images/trash.png");
			$(img2).attr("title", "Удалить");
			$(img2).attr("onclick", "delete_('file','"+array['files'][i]+"');");

			div.appendChild(img1);
			div.appendChild(img2);


			main_div.appendChild(div);
			browser.appendChild(main_div);
		}
	}
}

async function build_path(){
	path = document.getElementById('path_str').innerHTML;
	clip_path();
	array = await eel.build_path(path)();
	if (array != null){
		await build_browser(array);
	}
}


async function upload(){
	path = document.getElementById('path_str').innerHTML;
	if (global_array.lenth != 0){
		await eel.upload(global_array, path)();
		array = await eel.read_path()();
		build_path();
		setTimeout(function() {
			document.getElementById('progress_area').innerHTML = "";
			document.getElementById("path_text").value = ""},
			100);
	}
}

async function rebuild(old, what){
	label = document.getElementById(what+":"+old);
	label.innerHTML = "";

	img = document.createElement('img');
	if (what == "file"){
		$(img).attr("src", await eel.file_type(old)());
	}
	else{
		$(img).attr("src", "images/folder.png");		
	}

	div_text = document.createElement('div');
	div_text.innerHTML = old;
	$(div_text).attr("class", "element_name");
	$(div_text).attr("title", old);
			
	label.appendChild(img);
	label.appendChild(div_text);

	// Функции
	div = document.createElement('div');
	$(div).attr("class", "functions");
	
	img1 = document.createElement('img');
	$(img1).attr("src", "images/draw.png");
	$(img1).attr("title", "Переименовать");
	$(img1).attr("onclick", "rename('"+what+"','"+old+"');");

	img2 = document.createElement('img');
	$(img2).attr("src", "images/trash.png");
	$(img2).attr("title", "Удалить");
	$(img2).attr("onclick", "delete_('"+what+"','"+old+"');");

	div.appendChild(img1);
	div.appendChild(img2);

	label.appendChild(div);
}

async function rename_file(old, False=false){
	if (False){
		rebuild(old, 'file');
	}
	else if (old == document.getElementById('rename_').value){
		rebuild(old, 'file');
	}
	else{
		if (!full_path){
			new_name = document.getElementById('path_str').innerHTML + document.getElementById('rename_').value;
		}
		else{
			new_name = document.getElementById('rename_').value;
		}
		arr = new_name.split("/");
		path = "/";
		for (let i = 1; i < arr.length-1; i++){
			path += arr[i] + "/";
		}
		name = arr[arr.length-1]

		tmp_ar = await eel.build_path(path)();
		
		for (let i = 0; i < tmp_ar['files'].length; i++){
			if (tmp_ar['files'][i] == name){
				alert("Этот файл уже существует в этой папке!");
				return;
			}
		}

		await eel.rename_file(document.getElementById('path_str').innerHTML + old, new_name)();
		build_path();
		
	}
	full_path = false;
	setTimeout(function() {renaming_event = false;}, 100);
}
async function rename_folder(old, False=false){
	renaming_event = false;
	if (False){
		rebuild(old, 'folder');
	}
	else if (old == document.getElementById('rename_').value){
		rebuild(old, 'folder');
	}
	else{
		new_name = document.getElementById('rename_').value;
		str = "";
		arr = document.getElementById('path_str').innerHTML.split('/');
		for (let i = 1; i < arr.length; i++){
			str += "/" + arr[i];
		}
		tmp_ar = await eel.build_path(str)();
		
		for (let i = 0; i < tmp_ar['folders'].length; i++){
			if (tmp_ar['folders'][i] == new_name){
				alert("Эта папка уже существует в этой папке!");
				return;
			}
		}
	
		if (!full_path){
			new_name = document.getElementById('path_str').innerHTML + document.getElementById('rename_').value + "/";	
		}
		else{
			new_name = document.getElementById('rename_').value + "/";
		}
		
		old_path = document.getElementById('path_str').innerHTML + old + "/";
		await eel.rename_folder(old_path, new_name)();
		build_path();
	}
	
	full_path = false;
	setTimeout(function() {renaming_folder = false;}, 100);

}

full_path = false;
function show_full_path(){
	if (!full_path){
		full_path = true;
		now = document.getElementById('rename_').value;
		document.getElementById('rename_').value = document.getElementById('path_str').innerHTML + now;
		document.getElementById('show_full_path').style.display = "none";
		document.getElementById('rename_').style.width = "190px";
	}
}


extra_func = false;
renaming_folder = false;
renaming_event = false;
now_renaming = "";
now_renaming_type = "";
async function rename(what, current){
	if (renaming_event){
		rebuild(now_renaming, now_renaming_type);
	}
	now_renaming = current;
	now_renaming_type = what;
	extra_func = true;
	renaming_event = true;
	renaming_folder = false;
	if (what == "folder"){renaming_folder = true;}

	label = document.getElementById(what+":" + current);
	label.innerHTML = "";

	$(label).attr("class", what+" element");
	$(label).attr("id", what+":" + current);

	img = document.createElement('img');
	if (what == "file"){
		$(img).attr("src", await eel.file_type(current)());
	}
	else{
		$(img).attr("src", "images/folder.png");		
	}
	label.appendChild(img);

	form = document.createElement('form');
	$(form).attr("onsubmit", "rename_"+what+"('"+current+"'); return false;");

	input = document.createElement('input');
	input.required = true;
	$(input).attr("id", "rename_");
	$(input).attr("value", current);
	$(input).attr("style", "width: 155px;");

	button = document.createElement('input')
	$(button).attr("type", "submit");
	$(button).attr("value", "OK");

	button2 = document.createElement('button')
	button2.innerHTML = "НЕТ";
	$(button2).attr("onclick", "rename_"+what+"('"+current+"', False=true)");

	form.appendChild(input);
	form.appendChild(button);
	form.appendChild(button2);

	label.appendChild(form);

	img2 = document.createElement('img');
	$(img2).attr("src", "images/full.png");
	$(img2).attr("title", "Показать полный путь");
	$(img2).attr("id", "show_full_path");
	$(img2).attr("onclick", "show_full_path();");

	label.appendChild(img2);
	setTimeout(function() {extra_func = false;}, 500);
}
async function delete_(what, current){
	extra_func = true;
	if (confirm("Удалить " + current + "?")){
		if (what == "file"){
			await eel.delete_file(document.getElementById('path_str').innerHTML + current)();
			build_path();
		}
		if (what == "folder"){
			await eel.delete_folder(document.getElementById('path_str').innerHTML + current + "/")();
			build_path();			
		}
	}
	setTimeout(function() {extra_func = false;}, 500);
}

function change_dir(how, new_path=""){
	if (!renaming_event){
		if (!extra_func){
			if (!renaming_folder){
				if (how == "open"){
					path_area = document.getElementById('Path');
					main_a = document.createElement('a');

					main_a.innerHTML = new_path;
					$(main_a).attr("class", "path_link");
					$(main_a).attr("onclick", "gotopath('"+document.getElementById('path_str').innerHTML+new_path+"/');");

					path_area.appendChild(main_a);

					a = document.createElement('a');
					a.innerHTML = "/";
					path_area.appendChild(a);

					document.getElementById('path_str').innerHTML = document.getElementById('path_str').innerHTML + new_path + "/";
					build_path();
				}
				if (how == "back"){
					if (document.getElementById('path_str').innerHTML != "/"){
						path_area = document.getElementById('Path');
						path_area.innerHTML = "";

						a = document.createElement('a');
						$(a).attr("style", "padding: 4px;");
						$(a).attr("class", "path_link");
						$(a).attr("onclick", "gotopath('/');");
						path_area.appendChild(a);

						a = document.createElement('a');
						a.innerHTML = "/";
						path_area.appendChild(a);

						str = "/";
						arr = document.getElementById('path_str').innerHTML.split('/');
						for (let i = 1; i < arr.length-2; i++){

							main_a = document.createElement('a');

							main_a.innerHTML = arr[i];
							$(main_a).attr("class", "path_link");
							$(main_a).attr("onclick", "gotopath('"+str+arr[i]+"/');");

							path_area.appendChild(main_a);

							a = document.createElement('a');
							a.innerHTML = "/";
							path_area.appendChild(a);


							str += arr[i] + "/";
						}
						document.getElementById('path_str').innerHTML = str;
						build_path();
					}
				}
				eel.save_current_path(document.getElementById('path_str').innerHTML)();
			
			}
		}
	}
}

show_event = false;
async function new_folder(what=""){
	if (what == "create"){
		name = document.getElementById('name').value;
		if (array != null){
			temp_arr = array['folders'];
			for(var i = 0; i < temp_arr.length; i++) {
				if (temp_arr[i] == name){
					alert("Эта папка уже существует!");
					return;
				}
			}
		}
		await eel.create_folder(document.getElementById('path_str').innerHTML + name + "/")();
		show_more();
		await build_path();
		new_folder();
	}
	else{
		if (!show_event){
			document.getElementById('new_folder').style.display = "inline-block";
			setTimeout(function() {show_event = true;}, 100);
		}
		if (show_event){
			document.getElementById('name').value = "";
			document.getElementById('new_folder').style.display = "none";
			setTimeout(function() {show_event = false;}, 100);
		}
	}
}

more_showed = false;
more_showed_event = false;
async function show_more(){
	if (!more_showed_event){
		more_showed_event = true;
		more_showed = !more_showed;
		if (more_showed){
			document.getElementById('More').style.marginTop = "20px";
			await new Promise(resolve => setTimeout(resolve, 100));
			document.getElementById('More').style.opacity = 1;
			document.getElementById('create_img').src = "images/delete.png";
			document.getElementById('Uploader').className = "disabled";
			document.getElementById('more_button').title = "Скрыть";
		}
		else{
			document.getElementById('More').style.opacity = 0;
			await new Promise(resolve => setTimeout(resolve, 80));
			document.getElementById('More').style.marginTop = "-200px";
			document.getElementById('create_img').src = "images/add.png";	
			document.getElementById('Uploader').className = "";
			document.getElementById('name').value = "";
			document.getElementById('new_folder').style.display = "none";
			document.getElementById('more_button').title = "Больше";
			show_event = false;
		}
		setTimeout(function() {more_showed_event = false;}, 100);
	}
}

function gotopath(path, auto=false){
	if (!auto){
		if (document.getElementById('path_str').innerHTML == path){
			return;
		}
		document.getElementById('path_str').innerHTML = path;
		eel.save_current_path(document.getElementById('path_str').innerHTML)();
	}
	build_path();

	path_area = document.getElementById('Path');
	path_area.innerHTML = "";

	a = document.createElement('a');
	$(a).attr("style", "padding: 4px;");
	$(a).attr("class", "path_link");
	$(a).attr("onclick", "gotopath('/');");
	path_area.appendChild(a);

	a = document.createElement('a');
	a.innerHTML = "/";
	path_area.appendChild(a);

	arr = path.split('/');
	for (let i = 1; i < arr.length-1; i++){
		main_a = document.createElement('a');

		main_a.innerHTML = arr[i];
		$(main_a).attr("class", "path_link");
		str = "/";
		for (let y = 1; y < i; y++){
			str += arr[y] + "/";
		}
		$(main_a).attr("onclick", "gotopath('"+str+arr[i]+"/');");

		path_area.appendChild(main_a);

		a = document.createElement('a');
		a.innerHTML = "/";
		path_area.appendChild(a);
	}
	clip_path();
}


function escape(event){
	if (event.keyCode == 27){
		if (detail_showed){
			hide_details();
		}
		else if (showed_updates_menu){
			hide_updates_menu();
		}
		else if (showed_sort_menu){
			hide_sort_menu();
		}
		else if (show_event){
			document.getElementById('new_folder').style.display = "none";
			show_event = false;
		}
		else if (more_showed){
			show_more();
		}
		else if (renaming_event){
			rebuild(now_renaming, now_renaming_type);
			renaming_event = false;
		}
		else{
			change_dir('back');
		}
	}
}

async function delete_empty_folders(){
	if (confirm("Вы уверены, что хотите удалить все пустые папки в этой директории?")){
		await eel.delete_empty_folders(document.getElementById('path_str').innerHTML)();
		show_more();
		build_path();
	}
}


detail_showed = false;
async function show_details(file){
	if (!renaming_event){
		if (!extra_func){
			if (!detail_showed){
				document.getElementById('background_disabled').style.pointerEvents =  "none";
				document.getElementById('background').style.filter = "blur(5px)";
				document.getElementById('details').style.top = 0;
				document.getElementById('details').style.opacity = 1;
				document.getElementById('file_name').innerHTML = file;
				document.getElementById('file_size').innerHTML = await eel.file_size(document.getElementById('path_str').innerHTML + file)();
				document.getElementById('img_details').src = await eel.file_type(file)();
				setTimeout(function() {detail_showed = true;}, 500);
			}
		}
	}
}
function hide_details(){
	if (detail_showed){
		detail_showed = false;
		document.getElementById('background_disabled').style.pointerEvents =  "auto";
		document.getElementById('background').style.filter = "blur(0px)";
		document.getElementById('details').style.top = "-200%";
		document.getElementById('details').style.opacity = 0;

		document.getElementById('progress_area2').style.display = "none";
	}
}

function show_progress_2(){
	progress_area = document.getElementById('progress_area2');
	progress_area.style.display = "block";
	document.getElementById('gotofile_button').style.display = "none";
	document.getElementById('progress_bar2').value = 0;
	document.getElementById('progress_text2').innerHTML = "0%";
}
eel.expose(change_progress);
function change_progress(value){
	document.getElementById('progress_bar2').value = value;
	document.getElementById('progress_text2').innerHTML = value + "%";
}
async function openFile(){
	await eel.opendir(dir)();
}

async function download(){
	file = document.getElementById('path_str').innerHTML + document.getElementById('file_name').innerHTML;
	dir = await eel.download_dir(file)();
	if (dir != null){
		await show_progress_2();
		unwser = await eel.download(file, dir)();
		if (unwser){
			document.getElementById('gotofile_button').style.display = "inline-block";
		}
		if (!unwser){
			alert("Ошибка! Не удалось скачать файл!");
		}
	}
}

showed_sort_menu = false;
async function show_sort_menu(e){
	if (!showed_sort_menu){
		document.getElementById("sort_menu").style.display = "block";
		await new Promise(resolve => setTimeout(resolve, 0));
		x = e.clientX
		y = e.clientY
		document.getElementById("sort_menu").style.top = y + "px";
		document.getElementById("sort_menu").style.left = x + "px";
		document.getElementById("sort_menu").style.transform = "scale(1)"
		setTimeout(function() {showed_sort_menu = true;}, 50)
	}
}
function hide_sort_menu(){
	if (showed_sort_menu){
		document.getElementById("sort_menu").style.display = "none";
		document.getElementById("sort_menu").style.transform = "scale(0)"
		showed_sort_menu = false;
	}
}

async function sort_by(what){
	await eel.sort_by(what);
	setup_arrow();
	build_path();
}
