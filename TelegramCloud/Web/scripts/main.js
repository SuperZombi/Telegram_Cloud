async function main(){
	await ask_theme();

	global_lang = await eel.get_global_lang()();
	if (!global_lang){
		/* Определить язык системы */
		var language = window.navigator ? (window.navigator.language ||
	                  window.navigator.systemLanguage ||
	                  window.navigator.userLanguage) : "ru";
		language = language.substr(0, 2).toUpperCase();
		if (language == "RU"){
			global_lang = language
		}
		else{
			global_lang = "EN"
		}
		eel.change_lang(global_lang);
	}

	setTimeout(function(){document.body.style.transition = "0.5s";},1000)
	notifications_element = document.getElementById('notifications')
	await eel.starting()();
	document.getElementById('path_str').innerHTML = await eel.get_saved_path()();
	setup_arrow();
	await gotopath(document.getElementById('path_str').innerHTML, auto=true);

	show_preview = await eel.show_preview_setting()();
	if (show_preview){
		document.getElementById('files_preview').checked = true;
	}

	load_lang();
	document.getElementById('lang_select').value = global_lang;

	update_lightball()
	memory_used()

	updated_check_on_load = await eel.get_updated_check_on_load()();
	if (updated_check_on_load){
		document.getElementById('updated_check').checked = true;
		if (await eel.auto_check_update()()){
			await Warning(LANGUAGES[global_lang].main.update_available, 4000)
		}
	}
}

async function memory_used(){
	memoryused = await eel.memory_used()();
	document.getElementById('memory_used_int').innerHTML = memoryused
}

async function ask_theme(){
	theme_unswer = await eel.check_theme()();
	if (theme_unswer){
		if (theme_unswer == "dark"){
			document.getElementById("theme-link").setAttribute("href", "styles/dark.css");
			theme = "dark";
		}
		else{
			document.getElementById("theme-link").setAttribute("href", "styles/light.css");
			theme = "light";
		}
	}
	else{
		/*Определить тему системы*/
		const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
		if (darkThemeMq.matches) {
    		document.getElementById("theme-link").setAttribute("href", "styles/dark.css");
			theme = "dark";
			eel.save_theme(theme);
		}
		else{
    		document.getElementById("theme-link").setAttribute("href", "styles/light.css");
			theme = "light";
			eel.save_theme(theme);			
		}
	}
}
function update_lightball(){
	if (theme == "dark"){
		document.getElementById("dark_mode").title = LANGUAGES[global_lang].main.dark_theme_on
		document.getElementById("dark_mode_img").src = "images/light.png";
	}
	else{
		document.getElementById("dark_mode").title = LANGUAGES[global_lang].main.dark_theme_off
		document.getElementById("dark_mode_img").src = "images/dark_light.png";
	}
}

theme = "light";
async function change_theme(){
	let lightTheme = "styles/light.css";
	let darkTheme = "styles/dark.css";

	var link = document.getElementById("theme-link");
	var currTheme = link.getAttribute("href");

    if(currTheme == lightTheme)
    {
   		currTheme = darkTheme;
   		theme = "dark";
   		document.getElementById("dark_mode").title = LANGUAGES[global_lang].main.dark_theme_on;
		document.getElementById("dark_mode_img").src = "images/light.png";
    }
    else
    {    
		currTheme = lightTheme;
		theme = "light";
		document.getElementById("dark_mode").title = LANGUAGES[global_lang].main.dark_theme_off
		document.getElementById("dark_mode_img").src = "images/dark_light.png";
    }
    link.setAttribute("href", currTheme);
    await eel.save_theme(theme);
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
		await Success(LANGUAGES[global_lang].main.no_updates)
	}
	document.body.style.cursor = "auto";
	document.getElementById('check_update').style.cursor = "pointer";
}
function hide_updates_menu(){
	showed_updates_menu = false;
	document.getElementById("updates_menu").style.display = "none";
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
	$(back).attr("title", LANGUAGES[global_lang].main.back);
	$(back).attr("onclick", "change_dir('back')");

	let back_img = document.createElement('img');
	$(back_img).attr("src", "images/more.png");
	back.appendChild(back_img);
	browser.appendChild(back);

	// Кнопка сортировки
	let sort = document.createElement('div');
	$(sort).attr("id", "sorting");
	$(sort).attr("title", LANGUAGES[global_lang].main.sort2);
	$(sort).attr("onclick", "show_sort_menu(event)");

	let sort_img = document.createElement('img');
	$(sort_img).attr("src", "images/sorting.png");
	sort.appendChild(sort_img);
	browser.appendChild(sort);

	// hr
	hr = document.createElement('hr');
	$(hr).attr("align", "center");
	browser.appendChild(hr);

	if (array['folders'].length == 0 && array['files'].length == 0){
		div = document.createElement('div');
		$(div).attr("id", "empty_brows");
		$(div).attr("align", "center");
		div.innerHTML = LANGUAGES[global_lang].main.search_empty
		browser.appendChild(div);
	}

	// Папки
	for (let i = 0; i < array['folders'].length; i++){
		main_div = document.createElement('div');
		$(main_div).attr("class", "folder element");
		$(main_div).attr("id", "folder:" + array['folders'][i]);
		$(main_div).attr("onclick", "select('folder','"+array['folders'][i]+"')");
		$(main_div).attr("ondblclick", "change_dir('open','"+array['folders'][i]+"')");

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
		$(img1).attr("title", LANGUAGES[global_lang].main.rename);
		$(img1).attr("onclick", "rename('folder','"+array['folders'][i]+"');");

		img2 = document.createElement('img');
		$(img2).attr("src", "images/trash.png");
		$(img2).attr("title", LANGUAGES[global_lang].main.delete);
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
			$(main_div).attr("onclick", "select('file','"+array['files'][i]+"')");
			$(main_div).attr("ondblclick", "show_details('"+array['files'][i]+"')");
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
			$(img1).attr("title", LANGUAGES[global_lang].main.rename);
			$(img1).attr("onclick", "rename('file','"+array['files'][i]+"');");

			img2 = document.createElement('img');
			$(img2).attr("src", "images/trash.png");
			$(img2).attr("title", LANGUAGES[global_lang].main.delete);
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
	ierarhy_array = array;
	if (array != null){
		await build_browser(array);
	}
	else{
		let browser = document.getElementById('FileBrowser')
		browser.innerHTML = "";
		div = document.createElement('div');
		$(div).attr("id", "empty_brows");
		$(div).attr("align", "center");
		div.innerHTML = LANGUAGES[global_lang].main.search_empty
		browser.appendChild(div);
	}
}


eel.expose(progres);
function progres(x, y, percents) {
	document.getElementById('progress_' + x).value = percents;
	document.getElementById('a_' + x).innerHTML = percents + "%";
	return stop_transmission;
}

async function upload(){
	path = document.getElementById('path_str').innerHTML;
	if (global_array.lenth != 0){
		stop_transmission = false;
		document.getElementById("upload_button").innerHTML = LANGUAGES[global_lang].main.cancel_upload
		document.getElementById("upload_button").onclick = function(){stop_transmission = true;}
		unswer = await eel.upload(global_array, path)();
		for (i=0;i<unswer.length;i++){await Warning(unswer[i])}
		array = await eel.read_path()();
		build_path();
		memory_used();
		setTimeout(function() {
			document.getElementById('progress_area').innerHTML = "";
			document.getElementById("path_text").value = ""
			document.getElementById("upload_button").innerHTML = LANGUAGES[global_lang].main.upload
			document.getElementById("upload_button").onclick = function(){get_src()}
		}, 300);
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
	$(img1).attr("title", LANGUAGES[global_lang].main.rename);
	$(img1).attr("onclick", "rename('"+what+"','"+old+"');");

	img2 = document.createElement('img');
	$(img2).attr("src", "images/trash.png");
	$(img2).attr("title", LANGUAGES[global_lang].main.delete);
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
				await Warning(LANGUAGES[global_lang].main.file_already_exist)
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
				await Warning(LANGUAGES[global_lang].main.folder_already_exist)
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
	button2.innerHTML = LANGUAGES[global_lang].main.no;
	$(button2).attr("onclick", "rename_"+what+"('"+current+"', False=true)");

	form.appendChild(input);
	form.appendChild(button);
	form.appendChild(button2);

	label.appendChild(form);

	img2 = document.createElement('img');
	$(img2).attr("src", "images/full.png");
	$(img2).attr("title", LANGUAGES[global_lang].main.show_full_path);
	$(img2).attr("id", "show_full_path");
	$(img2).attr("onclick", "show_full_path();");

	label.appendChild(img2);
	setTimeout(function() {extra_func = false;}, 500);
}
deleted_event = false;
async function delete_(what, current){
	extra_func = true;
	clear_select();
	deleted_event = true;
	if (confirm(LANGUAGES[global_lang].main.delete_q + current + "?")){
		if (what == "file"){
			await eel.delete_file(document.getElementById('path_str').innerHTML + current)();
			build_path();
		}
		if (what == "folder"){
			await eel.delete_folder(document.getElementById('path_str').innerHTML + current + "/")();
			build_path();			
		}
		memory_used();
	}
	setTimeout(function() {deleted_event = false;}, 100);
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
					setTimeout(function(){selected_objs = [];show_move_manu();}, 50)
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
					await Warning(LANGUAGES[global_lang].main.folder_already_exist2)
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
			document.getElementById('More').style.display = "inline-block";
			await new Promise(resolve => setTimeout(resolve, 100));
			document.getElementById('More').style.marginTop = "20px";
			document.getElementById('More').style.opacity = 1;
			document.getElementById('create_img').src = "images/delete.png";
			document.getElementById('Uploader').className = "disabled";
			document.getElementById('more_button').title = LANGUAGES[global_lang].main.less;
		}
		else{
			document.getElementById('More').style.opacity = 0;
			document.getElementById('More').style.marginTop = "-200px";
			document.getElementById('create_img').src = "images/add.png";	
			document.getElementById('Uploader').className = "";
			document.getElementById('name').value = "";
			document.getElementById('new_folder').style.display = "none";
			await new Promise(resolve => setTimeout(resolve, 140));
			document.getElementById('More').style.display = "none";
			document.getElementById('more_button').title = LANGUAGES[global_lang].main.more;
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
	if (auto){
		hide_search();
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
		else if (search_showed){
			hide_search();
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
	if (confirm(LANGUAGES[global_lang].main.delete_all_emptys)){
		await eel.delete_empty_folders(document.getElementById('path_str').innerHTML)();
		show_more();
		build_path();
	}
}

search_showed = false;
async function search_show(){
	if (!renaming_event){
		if (!extra_func){
			if (!search_showed){
				document.getElementById('background_disabled').style.pointerEvents =  "none";
				document.getElementById('background').style.filter = "blur(3px)";
				document.getElementById('search').style.display = "flex";
				document.getElementById('search_input').focus()
				await new Promise(resolve => setTimeout(resolve, 0));
				document.getElementById('search').style.opacity = 1;
				
				setTimeout(function() {search_showed = true;}, 300);
			}
		}
	}
}
async function hide_search(){
	if (search_showed){
		search_showed = false;
		document.getElementById('background_disabled').style.pointerEvents =  "auto";
		document.getElementById('background').style.filter = "blur(0px)";
		document.getElementById('search').style.opacity = 0;
		await new Promise(resolve => setTimeout(resolve, 300));
		document.getElementById("search_input").value = ""
		start_search()
		document.getElementById('search').style.display = "none";
	}
}
var timout_id;
function search_wait(e){
	if (timout_id) {
		clearTimeout(timout_id);
	}
	timout_id = setTimeout(function(){
		start_search();
	}, 400);
}
async function start_search(){
	text = document.getElementById("search_input").value
	if (text){
		array = await eel.search(text)();

		let browser = document.getElementById('Search_Browser')
		browser.innerHTML = "";

		if (array['folders'].length == 0 && array['files'].length == 0 ){
			p = document.createElement("p")
			p.id = "empty"
			p.innerHTML = LANGUAGES[global_lang].main.search_empty
			browser.appendChild(p);
		}

		// Папки
		for (let i = 0; i < array['folders'].length; i++){
			main_div = document.createElement('div');
			$(main_div).attr("class", "folder element");
			$(main_div).attr("onclick", "gotopath('"+array['folders'][i]+"', auto=true);");

			img = document.createElement('img');
			$(img).attr("src", "images/folder.png");

			div_text = document.createElement('div');
			div_text.innerHTML = array['folders'][i];
			$(div_text).attr("class", "element_name");
			$(div_text).attr("title", LANGUAGES[global_lang].main.go_to);
			
			main_div.appendChild(img);
			main_div.appendChild(div_text);

			browser.appendChild(main_div);
			document.getElementById("search").style.height = document.getElementById('Search_Browser').offsetHeight + 150 + "px"
		}

		if (array['folders'].length != 0 && array['files'].length != 0 ){
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

				path_to_file_temp = array['files'][i].split('/'); path_to_file = "";
				for (j=0;j<path_to_file_temp.length-1; j++){path_to_file+=path_to_file_temp[j]+"/"}

				$(main_div).attr("onclick", "gotopath('"+path_to_file+"', auto=true);");
				$(main_div).attr("id", "file:" + array['files'][i]);

				img = document.createElement('img');
				$(img).attr("src", await eel.file_type(array['files'][i])());

				div_text = document.createElement('div');
				div_text.innerHTML = array['files'][i];
				$(div_text).attr("class", "element_name");
				$(div_text).attr("title", LANGUAGES[global_lang].main.go_to);
				
				main_div.appendChild(img);
				main_div.appendChild(div_text);

				browser.appendChild(main_div);
				document.getElementById("search").style.height = document.getElementById('Search_Browser').offsetHeight + 150 + "px"
			}
		}
	}
	else{
		browser = document.getElementById('Search_Browser')
		browser.innerHTML = "";
		p = document.createElement("p")
		p.id = "empty"
		p.innerHTML = LANGUAGES[global_lang].main.search_empty
		browser.appendChild(p);
	}
	document.getElementById("search").style.height = document.getElementById('Search_Browser').offsetHeight + 150 + "px"
}

detail_showed = false;
async function show_details(file){
	if (!renaming_event){
		if (!extra_func){
			if (!detail_showed){
				document.getElementById('img_details').src = await eel.file_type(file)();
				document.getElementById('background_disabled').style.pointerEvents =  "none";
				document.getElementById('background').style.filter = "blur(5px)";
				document.getElementById('details').style.top = 0;
				document.getElementById('details').style.opacity = 1;
				document.getElementById('file_name').innerHTML = file;
				document.getElementById('file_size').innerHTML = await eel.file_size(document.getElementById('path_str').innerHTML + file)();
				setTimeout(function() {detail_showed = true;}, 500);
				if (show_preview){
					preview = await eel.show_preview(document.getElementById('path_str').innerHTML + file)();
					if (preview){
						document.getElementById('img_details').src = preview
					}
				}
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
		eel.delete_preview();
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
			await Error(LANGUAGES[global_lang].main.download_er+document.getElementById('file_name').innerHTML, false)
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

selected_objs = []
selected_event = false;
function select(what, name){
	if (!detail_showed && !search_showed && !showed_updates_menu && !renaming_event && !renaming_folder && !deleted_event){
		selected_event = true;
		for (i=0;i<selected_objs.length;i++){
			if ([what,name].join() == selected_objs[i].join()){
				selected_objs.splice(i, 1)
				document.getElementById(what+":"+name).classList.remove("selected_"+what);
				setTimeout(function() {selected_event = false;}, 50);
				show_move_manu()
				return
			}
		}
		selected_objs.push([what,name])
		document.getElementById(what+":"+name).classList.add("selected_"+what);
		setTimeout(function() {selected_event = false;}, 50);
		show_move_manu()
	}
}
function clear_select(){
	if (!selected_event || renaming_event || renaming_folder){
		if (!move_event){
			for (i=0;i<selected_objs.length;i++){
				document.getElementById(selected_objs[i][0]+":"+selected_objs[i][1]).classList.remove("selected_"+selected_objs[i][0]);
			}
			selected_objs = []
			show_move_manu()
		}
	}
}
async function show_move_manu(){
	if (selected_objs.length>0){
		if (!more_showed){
			document.getElementById("move_menu").style.display = "inline-block";
			await new Promise(resolve => setTimeout(resolve, 0));
			document.getElementById("move_menu").style.opacity = 1;
			document.getElementById("move_menu").style.transform = "scale(1)";
		}
	}
	else{
		document.getElementById("move_menu").style.opacity = 0;
		document.getElementById("move_menu").style.transform = "scale(0.4)";
		await new Promise(resolve => setTimeout(resolve, 100));
		document.getElementById("move_menu").style.display = "none";
		document.getElementById("new_path").style.display = 'none';
	}
}
move_event = false;
function move_menu(what=""){
	move_event = true;
	if (what){
		document.getElementById("move_path").value = document.getElementById("path_str").innerHTML
		document.getElementById("new_path").style.display = 'inline-block';
	}
	setTimeout(function() {move_event = false;}, 100);
}
shift_pressed = false;
function shift_down(e){if(e.keyCode==16){shift_pressed = true;}}
function shift_up(e){if(e.keyCode==16){shift_pressed = false;}}
async function up_or_down_key(e){
	if (!detail_showed && !search_showed && !showed_updates_menu && !settings_showed){
		if (shift_pressed){
			if (e.keyCode == 70){
				if (!show_event){
					search_show()
				}
			}
			if (e.keyCode == 78){
				if (!show_event){
					show_more()
					new_folder()
					document.getElementById('name').focus()
				}
			}
			if (ierarhy_array != null){
				if (ierarhy_array['folders'].length>0 || ierarhy_array['files'].length>0){
					if (selected_objs.length>0){
						temp_selected_objs = await eel.sort_this(selected_objs)();
						if (e.keyCode == 40){
							cur_el = [temp_selected_objs[temp_selected_objs.length-1][0],temp_selected_objs[temp_selected_objs.length-1][1]]
							//Вниз
							elem_pos = ierarhy_array[cur_el[0]+"s"].indexOf(cur_el[1])
							if (elem_pos == ierarhy_array[cur_el[0]+"s"].length-1){
								if (cur_el[0] == "folder"){
									if (ierarhy_array["files"].length>0){
										select("file", ierarhy_array["files"][0])
									}
								}
							}
							else{
								select(cur_el[0], ierarhy_array[cur_el[0]+"s"][elem_pos+1])
							}
							
						}
						if (e.keyCode == 38){
							cur_el = [temp_selected_objs[0][0],temp_selected_objs[0][1]]
							//Вверх
							elem_pos = ierarhy_array[cur_el[0]+"s"].indexOf(cur_el[1])
							if (elem_pos == 0){
								if (cur_el[0] == "file"){
									if (ierarhy_array["folders"].length>0){
										select("folder", ierarhy_array["folders"][ierarhy_array["folders"].length-1])
									}
								}
							}
							else{
								select(cur_el[0], ierarhy_array[cur_el[0]+"s"][elem_pos-1])
							}
						}
					}
					if (e.keyCode == 65){
						selected_objs = []
						for (j=0;j<ierarhy_array['folders'].length;j++){
							selected_objs.push(["folder",ierarhy_array['folders'][j]])
							document.getElementById("folder"+":"+ierarhy_array['folders'][j]).classList.add("selected_folder");
						}
						for (i=0;i<ierarhy_array['files'].length;i++){
							selected_objs.push(["file",ierarhy_array['files'][i]])
							document.getElementById("file"+":"+ierarhy_array['files'][i]).classList.add("selected_file");
						}
						show_move_manu()
					}
				}
			}
		}
		if (e.keyCode == 46){
			if (selected_objs.length>0){
				delete_selected()
			}
		}
	}
}
async function delete_selected(){
	if (confirm(LANGUAGES[global_lang].main.confirm_delete1+selected_objs.length+LANGUAGES[global_lang].main.confirm_delete2)){
		for (i=0;i<selected_objs.length;i++){
			if (selected_objs[i][0] == "file"){
				await eel.delete_file(document.getElementById('path_str').innerHTML + selected_objs[i][1])();
			}
			if (selected_objs[i][0] == "folder"){
				await eel.delete_folder(document.getElementById('path_str').innerHTML + selected_objs[i][1] + "/")();		
			}
		}
		build_path();
		memory_used();
		selected_objs = []
		show_move_manu()
	}	
}
async function move_more_files(){
	from = document.getElementById("path_str").innerHTML
	to = document.getElementById("move_path").value
	if (to[to.length-1] != "/"){
		to+="/"
	}
	if (from == to){
		return false;
	}
	else{
		for (j=0;j<selected_objs.length;j++){
			if (selected_objs[j][0]=="folder"){
				tmp_pth = from + selected_objs[j][1]

				tmp_ar = await eel.build_path(to)();
				move_mozna = true;
				
				for (let i = 0; i < tmp_ar['folders'].length; i++){
					if (tmp_ar['folders'][i] == selected_objs[j][1]){
						await Warning(LANGUAGES[global_lang].main.folder_exists1+selected_objs[j][1]+LANGUAGES[global_lang].main.folder_exists2)
						move_mozna = false;
						continue;
					}
				}
				
				if (move_mozna){
					await eel.rename_folder(tmp_pth+"/", to+selected_objs[j][1]+"/")();	
				}
			}
			else{
				tmp_pth = from + selected_objs[j][1]

				tmp_ar = await eel.build_path(to)();
				move_mozna = true;
				for (let i = 0; i < tmp_ar['files'].length; i++){
					if (tmp_ar['files'][i] == selected_objs[j][1]){
						await Warning(LANGUAGES[global_lang].main.file_exists1+selected_objs[j][1]+LANGUAGES[global_lang].main.folder_exists2)
						move_mozna = false;
						continue;
					}
				}

				if (move_mozna){
					await eel.rename_file(tmp_pth, to+selected_objs[j][1])();
				}
			}
			
		}
		build_path();
		selected_objs = []
		show_move_manu()
	}
}

settings_showed = false;
async function show_settings(){
	document.getElementById('settings').style.display = "block";
	await new Promise(resolve => setTimeout(resolve, 0));
	document.getElementById('background_disabled').style.pointerEvents =  "none";
	document.getElementById('background').style.filter = "blur(5px)";
	document.getElementById('settings').style.transform = "scale(1)";
	document.getElementById('settings').style.opacity = 1;
	settings_showed = true;
}
async function hide_settings(){
	if (Object.keys(setting_changed).length > 0){
		if (confirm(LANGUAGES[global_lang].main.dont_save)){}
		else{
			return
		}
	}
	document.getElementById('settings').style.transform = "scale(0)";
	document.getElementById('settings').style.opacity = 0;
	document.getElementById('background_disabled').style.pointerEvents =  "auto";
	document.getElementById('background').style.filter = "blur(0px)";
	await new Promise(resolve => setTimeout(resolve, 250));
	document.getElementById('settings').style.display = "none";
	reset_settings()
	settings_showed = false;
}

setting_changed = {}
async function save_settings(){
	keys = Object.keys(setting_changed)
	for (i=0;i<keys.length;i++){
		if (keys[i] == "files_preview"){
			show_preview = setting_changed["files_preview"]
			document.getElementById('files_preview').checked = setting_changed["files_preview"]
			await eel.save_preview_settings(setting_changed["files_preview"])
		}
		if (keys[i] == "updated_check_swith"){
			updated_check_on_load = setting_changed["updated_check_swith"]
			document.getElementById('updated_check').checked = setting_changed["updated_check_swith"]
			await eel.save_updated_check_on_load(setting_changed["updated_check_swith"])
		}
		if (keys[i] == "lang"){
			global_lang = setting_changed["lang"]
			document.getElementById('lang_select').checked = setting_changed["lang"]
			await change_lang()
		}
	}
	setting_changed = {}
	hide_settings()
}
function reset_settings(){
	document.getElementById('files_preview').checked = show_preview;
	document.getElementById('updated_check').checked = updated_check_on_load;
	document.getElementById('lang_select').value = global_lang;
	setting_changed = {}
	hide_settings_button()
}
async function reset_settings_default(){
	if (confirm(LANGUAGES[global_lang].main.reset_settings)){
		setting_changed = {}
		setting_changed = {"files_preview": true, "updated_check_swith": true}
		await save_settings()
	}
}
async function show_save_button(){
	document.getElementById('save_settings').style.display = "block";
	await new Promise(resolve => setTimeout(resolve, 0));
	document.getElementById('save_settings').style.transform = "scale(1)";
	document.getElementById('save_settings').style.opacity = 1;
}
async function hide_settings_button(){
	document.getElementById('save_settings').style.transform = "scale(0)";
	document.getElementById('save_settings').style.opacity = 0;
	await new Promise(resolve => setTimeout(resolve, 300));
	document.getElementById('save_settings').style.display = "none";
}


function files_preview_swith(){
	setting_changed['files_preview'] = document.getElementById('files_preview').checked;
	if (setting_changed['files_preview'] == show_preview){
		delete setting_changed['files_preview'];
		setTimeout(function() {
			if (Object.keys(setting_changed).length == 0){
				hide_settings_button();
			}
		}, 10)
	}
	else{
		show_save_button();
	}
}

function updated_check_swith(){
	setting_changed['updated_check_swith'] = document.getElementById('updated_check').checked;
	if (setting_changed['updated_check_swith'] == updated_check_on_load){
		delete setting_changed['updated_check_swith'];
		setTimeout(function() {
			if (Object.keys(setting_changed).length == 0){
				hide_settings_button();
			}
		}, 10)
	}
	else{
		show_save_button();
	}	
}

function show_settings_category(category){
	if (category == "general"){
		document.getElementById("general").style.display = "block";
		document.getElementById("other").style.display = "none";
		document.getElementById("personalization").style.display = "none";
	}
	if (category == "personalization"){
		document.getElementById("personalization").style.display = "block";
		document.getElementById("other").style.display = "none";	
		document.getElementById("general").style.display = "none";
	}
	if (category == "other"){
		document.getElementById("other").style.display = "block";	
		document.getElementById("general").style.display = "none";
		document.getElementById("personalization").style.display = "none";
	}
}

function lang_select_(){
	setting_changed['lang'] = document.getElementById('lang_select').value;
	if (setting_changed['lang'] == global_lang){
		delete setting_changed['lang'];
		setTimeout(function() {
			if (Object.keys(setting_changed).length == 0){
				hide_settings_button();
			}
		}, 10)
	}
	else{
		show_save_button();
	}
}

async function change_lang(){
	if (global_lang == "RU"){
		await eel.change_lang("RU");
	}
	if (global_lang == "EN"){
		await eel.change_lang("EN");
	}
	load_lang()
}

async function load_lang(){
	document.getElementById("Settings_header").innerHTML = LANGUAGES[global_lang].main.settings
	document.getElementById("general_header").innerHTML = LANGUAGES[global_lang].main.general_header
	document.getElementById("personalization_header").innerHTML = LANGUAGES[global_lang].main.personalization_header
	document.getElementById("other_header").innerHTML = LANGUAGES[global_lang].main.other_header
	
	document.getElementById("general_header2").innerHTML = LANGUAGES[global_lang].main.general_header
	document.getElementById("personalization_header2").innerHTML = LANGUAGES[global_lang].main.personalization_header
	document.getElementById("other_header2").innerHTML = LANGUAGES[global_lang].main.other_header

	document.getElementById("check_update").title = LANGUAGES[global_lang].main.check_update_title
	
	document.getElementById("files_preview_text").innerHTML = LANGUAGES[global_lang].main.files_preview
	document.getElementById("files_preview_title").title = LANGUAGES[global_lang].main.files_preview_description

	document.getElementById("dark_theme_title1").title = LANGUAGES[global_lang].main.dark_theme

	document.getElementById("reset_settings").innerHTML = LANGUAGES[global_lang].main.reset
	document.getElementById("reset_settings").title = LANGUAGES[global_lang].main.reset_description

	document.getElementById("updated_check_text").innerHTML = LANGUAGES[global_lang].main.updated_check

	document.getElementById("save_settings").innerHTML = LANGUAGES[global_lang].main.save

	////////////////

	document.getElementById("download").innerHTML = LANGUAGES[global_lang].main.download
	document.getElementById("gotofile_button").innerHTML = LANGUAGES[global_lang].main.open

	document.getElementById("search_title").innerHTML =  LANGUAGES[global_lang].main.search
	document.getElementById("search_input").placeholder = LANGUAGES[global_lang].main.search_description
	document.getElementById("empty").innerHTML = LANGUAGES[global_lang].main.search_empty

	document.getElementById("sortirovka").innerHTML = LANGUAGES[global_lang].main.sort
	document.getElementById("by_alphabet_text").innerHTML = LANGUAGES[global_lang].main.by_alphabet
	document.getElementById("by_date_text").innerHTML = LANGUAGES[global_lang].main.by_date

	////////////////

	document.getElementById("update_text").innerHTML = LANGUAGES[global_lang].main.update
	document.getElementById("curent_ver_text").innerHTML = LANGUAGES[global_lang].main.curent_ver
	document.getElementById("video_instruction").innerHTML = LANGUAGES[global_lang].main.video_inst
	document.getElementById("pereiti").innerHTML = LANGUAGES[global_lang].main.go_to
	document.getElementById("change_list_text").innerHTML = LANGUAGES[global_lang].main.change_list

	document.getElementById("more_button").title = LANGUAGES[global_lang].main.more
	document.getElementById("create").title = LANGUAGES[global_lang].main.create_folder	
	document.getElementById("name").placeholder = LANGUAGES[global_lang].main.create_folder

	document.getElementById("search_but").title = LANGUAGES[global_lang].main.search
	document.getElementById("clear").title = LANGUAGES[global_lang].main.delete_emptys


	document.getElementById("dark_mode").title = LANGUAGES[global_lang].main.dark_theme_off
	document.getElementById("settins_but").title = LANGUAGES[global_lang].main.settings
	
	document.getElementById("move_button").title = LANGUAGES[global_lang].main.move
	document.getElementById("move_path").placeholder = LANGUAGES[global_lang].main.move_path
	document.getElementById("move_files_disabled").value = LANGUAGES[global_lang].main.move_path_disabled
	document.getElementById("delete_button").title = LANGUAGES[global_lang].main.delete

	document.getElementById("upload_button").innerHTML = LANGUAGES[global_lang].main.upload
	document.getElementById("lang_text").innerHTML = LANGUAGES[global_lang].main.lang_text

	document.getElementById("memory_used_text").innerHTML = LANGUAGES[global_lang].main.memory_used
	memory_used()
	try{document.getElementById('empty_brows').innerHTML = LANGUAGES[global_lang].main.search_empty}catch{}
}
