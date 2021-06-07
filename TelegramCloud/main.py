from pyrogram import Client
from pyrogram.errors import FloodWait, BadRequest, UnknownError
from tkinter import Tk
from tkinter.filedialog import askopenfilenames, asksaveasfilename
import time
import eel
import os, sys
from bs4 import BeautifulSoup
import requests
import shutil
from PIL import Image
import cv2

phone = ""
started = False
previews_show = True
preview_only_images = False
updated_check_on_load = True
global_lang = "RU"
PATH = []
current_path = "/"
current_sort = "by_alphabet"
__version__ = 1.5

CONTENT_TYPES = ["text", "audio", "document", "photo", "sticker", "video", "video_note", "voice", "location", "contact",
                 "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo",
                 "group_chat_created", "supergroup_chat_created", "channel_chat_created", "migrate_to_chat_id",
                 "migrate_from_chat_id", "pinned_message"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'}


def resource_path(relative_path):
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

def executable_path(to_where="folder"):
	_path = os.path.abspath(__file__)
	
	if to_where == "file":
		return _path

	_path = _path.split("\\")
	_path = _path[0:-1]

	final_path = ""
	for i in range(len(_path)):
		final_path += _path[i]
		if i != len(_path)-1:
			final_path += "\\"

	return final_path

def load_langs():
	global LANGUAGES
	with open(resource_path("Web\\languages.json"), 'r', encoding = 'utf-8') as file:
		lines = file.read().split("=")
		lines = '{"'+lines[0].replace(" ",'')+'":'+lines[1]+"}"
		lines = lines.replace("/", '')
		LANGUAGES = eval(lines)['LANGUAGES']
load_langs()

@eel.expose
def get_global_lang():
	global global_lang
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			global_lang = lines["lang"]
			return lines["lang"]

	except:
		return

@eel.expose
def change_lang(lang):
	global global_lang
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["lang"] = lang
	global_lang = lang
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)	

@eel.expose
def get_updated_check_on_load():
	global updated_check_on_load
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			updated_check_on_load = lines["updated_check_on_load"]
			return lines["updated_check_on_load"]

	except:
		return True

@eel.expose
def save_updated_check_on_load(val):
	global updated_check_on_load
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["updated_check_on_load"] = val
	updated_check_on_load = val
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)

@eel.expose
def show_preview_setting():
	global previews_show
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			previews_show = lines["show_preview"]
			return lines["show_preview"]

	except:
		return True

@eel.expose
def save_preview_settings(val):
	global previews_show
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["show_preview"] = val
	previews_show = val
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)

@eel.expose
def get_preview_only_images():
	global preview_only_images
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			preview_only_images = lines["preview_only_images"]
			return lines["preview_only_images"]

	except:
		return False

@eel.expose
def save_preview_only_images(val):
	global preview_only_images
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["preview_only_images"] = val
	preview_only_images = val
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)	

def save_sorting():
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["sort_by"] = current_sort
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)

@eel.expose
def sort_by(what):
	global current_sort
	if what == current_sort:
		current_sort = str(what) + "_reverse"
	else:
		current_sort = what
	save_sorting()

@eel.expose()
def get_curent_arrow():
	global current_sort
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			current_sort = lines["sort_by"]

	except:
		current_sort = "by_alphabet"
	return current_sort

@eel.expose()
def check_updates():
	if global_lang == "RU":
		link = 'https://github.com/SuperZombi/Telegram_Cloud'
	else:
		link = 'https://github.com/SuperZombi/Telegram_Cloud/blob/main/README_EN.md'
		
	response = requests.get(link)
	soup = BeautifulSoup(response.content, 'html.parser')
	git_ver = float(soup.select('#user-content-version')[0].find('code').get_text())
	if __version__ != git_ver:
		change_list = soup.select('#user-content-change_list')[0]
		return {'new_updates': True, 'old_version': str(__version__), 'new_version': str(git_ver), 'change_list': str(change_list)}
	else:
		return {'new_updates': False}


@eel.expose()
def auto_check_update():
	return check_updates()['new_updates']

@eel.expose
def create_config(api_id, api_hash, phone_number):
	global phone
	phone = phone_number
	with open(executable_path()+'\\config.ini', 'w') as file:
		file.write('[pyrogram]\napi_id = ' + str(api_id) + "\napi_hash = "+ str(api_hash))


@eel.expose
def starting():
	global phone, started, app
	first_time = False
	if not started:
		if phone == "":
			app = Client("TelegramCloud")
		else:
			first_time = True
			app = Client("TelegramCloud", phone_number=phone)
		started = True
		app.start()
		if first_time:
			app.send_message('TelegCloudyBot', "/start")

@eel.expose
def check_theme():
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())
			return lines["theme"]

	except:
		return

@eel.expose
def save_theme(theme_name):
	try:
		with open('settings.json', 'r', encoding = 'utf-8') as file:
			lines = eval(file.read())

	except FileNotFoundError:
		lines = {}

	lines["theme"] = theme_name
	with open('settings.json', 'w', encoding = 'utf-8') as file:
		x = str(lines)
		x = x.replace("'", '"')
		file.write(x)

@eel.expose
def get_path():
	root = Tk()
	root.withdraw()
	root.wm_attributes('-topmost', 1)
	files = askopenfilenames(parent=root)
	return files

async def progress(current, total, client):
	global x, y, stop_transmit
	stop_transm = eel.progres(x, y, round(current * 100 / total, 1))()
	if stop_transm:
		print(LANGUAGES[global_lang]["python"]["download_cancel"])
		stop_transmit = True
		client.stop_transmission()
	print(str(x) + "/" + str(y) + " : " + str(round(current * 100 / total, 1)) + "%")


def file_exists(file):
	global PATH
	for i in PATH:
		if i == file:
			return True
	return False


@eel.expose
def read_path():
	global PATH
	PATH = []
	try:
		with open('path.bd', 'r', encoding = 'utf-8') as file:
			F = file.readlines()
			for i in F:
				PATH.append(eval(i)[0])

		return PATH
	except:
		None

def create_preview(file):
	index = file.split(".")[-1].lower()
	type_of_file = ""
	for i in file_types:
		for x in i:
			if x == index:
				type_of_file = file_types_str[file_types.index(i)]
				break
	if type_of_file == "image":
		print(LANGUAGES[global_lang]["python"]["generating_preview"])
		try:
			os.makedirs("Temp")
		except:
			None
		img = Image.open(file)
		img = img.resize((int(400*img.width/img.height), 400))
		img.save('Temp\\resized_image.'+index)
		return 'Temp\\resized_image.'+index
	if not preview_only_images:
		if type_of_file == "video":
			print(LANGUAGES[global_lang]["python"]["generating_preview"])
			try:
				os.makedirs("Temp")
			except:
				None
			vidcap = cv2.VideoCapture(file)
			success,image = vidcap.read()
			cv2.imwrite("Temp\\frame.png", image)
			img = Image.open("Temp\\frame.png")
			img = img.resize((int(400*img.width/img.height), 400))
			img.save('Temp\\resized_image.png')
			return 'Temp\\resized_image.png'
	return

@eel.expose
def upload(array, path):
	logs = []
	global x, y, PATH, stop_transmit
	stop_transmit = False
	x = 1
	y = len(array)
	read_path()
	for i in array:
		splited = i.split('/')
		name = splited[-1]
		path_ = str(path) + str(name)

		if file_exists(path_):
			tmp_ = i.split("/")[-1]
			logs.append(LANGUAGES[global_lang]["python"]["file"] + str(tmp_) + LANGUAGES[global_lang]["python"]["already_exist"])
			print("  "+LANGUAGES[global_lang]["python"]["file"] + str(i) + LANGUAGES[global_lang]["python"]["already_exist"])
			x+=1
			continue

		print(i)
		f = open(str(i), "rb")
		
		message = app.send_document('TelegCloudyBot', f, progress=progress, progress_args=(app,))
		if stop_transmit:
			return logs
		msg_id = message.message_id
		if previews_show:
			f2 = create_preview(i)
			if f2:
				f2_ = open(str(f2), "rb")
				preview = app.send_document('TelegCloudyBot', f2_)
				try:
					shutil.rmtree("Temp\\")
				except:
					None
				preview_msg_id = preview.message_id
				preview_file_id = preview.document.file_id
		for i in CONTENT_TYPES:
			try:
				media = message[i]
				file_id = media['file_id']
				size = media['file_size']
				if previews_show:
					if f2:
						msg = {'file_id': file_id, 'file_size': size, 'message_id': msg_id, 'preview_message_id': preview_msg_id, 'preview_file_id': preview_file_id}
					else:
						msg = {'file_id': file_id, 'file_size': size, 'message_id': msg_id}
				else:
					msg = {'file_id': file_id, 'file_size': size, 'message_id': msg_id}
				break
			except:
				None

		with open('path.bd', 'a', encoding = 'utf-8') as file:
			file.write(str([path_, msg]) + "\n")

		x+=1

	return logs
		

@eel.expose
def get_saved_path():
	global current_path
	return current_path

@eel.expose
def save_current_path(path):
	global current_path
	current_path = path


@eel.expose
def build_path(path):
	global current_sort
	array = read_path()
	if array:
		temp_path = path.split("/")[1:-1]
		c = []
		for i in array:
			temp = i.split("/")[1:]
			if len(temp_path) == 0:
				c.append(temp)
			else:
				for x in range(len(temp)-1):
					try:
						if temp_path[x] == temp[x]:
							if x == len(temp_path)-1:
								c.append(temp)
						else:
							break
					except:
						break

		folders = []
		files = []
		for i in c:
			for x in range(len(temp_path)):
				i.pop(0)

			if len(i) == 1:
				if i[0] != "":
					files.append(i[0])
			else:
				if not i[0] in folders:
					folders.append(i[0])

		if current_sort == "by_alphabet":
			return {'folders': sorted(folders), 'files': sorted(files)}
		if current_sort == "by_alphabet_reverse":
			folders = sorted(folders)
			folders.reverse()
			files = sorted(files)
			files.reverse()
			return {'folders': folders, 'files': files}
		if current_sort == "by_date":
			return {'folders': folders, 'files': files}
		if current_sort == "by_date_reverse":
			folders.reverse()
			files.reverse()
			return {'folders': folders, 'files': files}

@eel.expose
def create_folder(path):
	with open('path.bd', 'a', encoding = 'utf-8') as file:
		file.write(str([path]) + "\n")

@eel.expose
def delete_file(path):
	PATH = read_path()
	with open('path.bd', 'r', encoding = 'utf-8') as file:
		F = file.readlines()

	id_ = eval(F[PATH.index(path)])[1]['message_id']
	try:
		app.delete_messages('TelegCloudyBot', id_)
	except:

		print(LANGUAGES[global_lang]["python"]["error_1"] + str(path) + LANGUAGES[global_lang]["python"]["error_2"])
	try:
		id_pre = eval(F[PATH.index(path)])[1]['preview_message_id']
		app.delete_messages('TelegCloudyBot', id_pre)
	except:
		None
	F.pop(PATH.index(path))
	str_ = ""
	for i in F:
		str_ += str(i)

	with open('path.bd', 'w', encoding = 'utf-8') as file:
		file.write(str_)

@eel.expose
def delete_folder(path):
	array = read_path()

	temp_path = path.split("/")[1:-1]
	c = []
	for i in array:
		temp = i.split("/")[1:]
		if len(temp_path) == 0:
			c.append(temp)
		else:
			for x in range(len(temp)-1):
				try:
					if temp_path[x] == temp[x]:
						if x == len(temp_path)-1:
							c.append(temp)
					else:
						break
				except:
					break

	temp_str = []
	for i in range(len(c)):
		temp = "/"
		for x in c[i]:
			temp += str(x) + "/"
		temp = temp[:-1]
		temp_str.append(temp)


	with open('path.bd', 'r', encoding = 'utf-8') as file:
		F = file.readlines()

	PATH = array

	for i in temp_str:
		try:
			id_ = eval(F[PATH.index(i)])[1]['message_id']
			try:
				app.delete_messages('TelegCloudyBot', id_)
			except:
				print(LANGUAGES[global_lang]["python"]["error_1"] + str(i) + LANGUAGES[global_lang]["python"]["error_2"])
			try:
				id_pre = eval(F[PATH.index(i)])[1]['preview_message_id']
				app.delete_messages('TelegCloudyBot', id_pre)	
			except:
				None
		except:
			#this is folder (not a file)
			None
		
		F.pop(PATH.index(i))
		PATH.pop(PATH.index(i))

	str_ = ""
	for x in F:
		str_ += str(x)

	with open('path.bd', 'w', encoding = 'utf-8') as file:
		file.write(str_)
	


@eel.expose
def rename_file(old, new):
	PATH = read_path()
	with open('path.bd', 'r', encoding = 'utf-8') as file:
		F = file.readlines()

	temp_el = eval(F[PATH.index(old)])
	temp_el[0] = new

	F[PATH.index(old)] = str(temp_el) + "\n"

	str_ = ""
	for i in F:
		str_ += str(i)

	with open('path.bd', 'w', encoding = 'utf-8') as file:
		file.write(str_)


@eel.expose
def rename_folder(old, new):
	array = read_path()

	temp_path = old.split("/")[1:-1]
	c = []
	for i in array:
		temp = i.split("/")[1:]
		if len(temp_path) == 0:
			c.append(temp)
		else:
			for x in range(len(temp)-1):
				try:
					if temp_path[x] == temp[x]:
						if x == len(temp_path)-1:
							c.append(temp)
					else:
						break
				except:
					break

	temp_str = []
	for i in range(len(c)):
		temp = "/"
		for x in c[i]:
			temp += str(x) + "/"
		temp = temp[:-1]
		temp_str.append(temp)

	new_arr = []
	for i in temp_str:
		x = i.split(old)
		new_arr.append(str(new) + x[1])


	with open('path.bd', 'r', encoding = 'utf-8') as file:
		F = file.readlines()

	PATH = array
	for i in range(len(temp_str)):
		temp_el = eval(F[PATH.index(temp_str[i])])
		temp_el[0] = new_arr[i]

		F[PATH.index(temp_str[i])] = str(temp_el) + "\n"

	str_ = ""
	for i in F:
		str_ += str(i)

	with open('path.bd', 'w', encoding = 'utf-8') as file:
		file.write(str_)


def srawn(array1, array2):
	for i in range(len(array1)):
		try:
			if array1[i] != array2[i]:
				return False
		except:
			None
	return True

@eel.expose
def delete_empty_folders(path):
	PATH = read_path()

	temp_path = path.split("/")[1:-1]
	c = []
	for i in PATH:
		temp = i.split("/")[1:]
		if temp[-1] == "":
			if srawn(temp, temp_path):
				if path != i:
					c.append(i)

	if len(c) != 0:
		with open('path.bd', 'r', encoding = 'utf-8') as file:
			F = file.readlines()

		for i in c:
			F.pop(PATH.index(i))
			PATH.pop(PATH.index(i))

		str_ = ""
		for x in F:
			str_ += str(x)

		with open('path.bd', 'w', encoding = 'utf-8') as file:
			file.write(str_)


archives = [
	'rar', 'zip', 'tar', 'gz'
]
audio = [
	'au', 'mp3', 'mp2', 'wav', 'midi', 'wma', 'flac', 'aac', 'ogg' 
]
image = [
	'gif', 'jpg', 'jpeg', 'png', 'svg', 'ico', 'webp', 'bmp', 'tif'
]
video = [
	'mp4', 'mpeg', 'mov', 'webm', 'avi', 'movie', 'mkv', 'mpg', 'flv', 'wmv'
]
code = [
	'php', 'scala', 'java', 'cpp', 'cs', 'js', 'json', 'css', 'csv', 'html', 'c', 'h', 'py', 'xml', 'xsl', 'bat'
]
binary = [
	'bin', 'dll', 'exe', 'o', 'pyc', 'pyo'
]
document = [
	'doc', 'pdf', 'xls', 'ppt', 'txt'
]

file_types = [archives, audio, image, video, code, binary, document]
file_types_str = ['archive', 'audio', 'image', 'video', 'code', 'binary', 'document']
file_types_image = ["images/archive.png", "images/audio.png", "images/image.png", "images/video.png", "images/code.png", "images/binary.png", "images/document.png"]


@eel.expose
def file_type(name):
	default = "images/file.png"
	try:
		index = name.split(".")[-1].lower()
	except:
		return default
	for i in file_types:
		for x in i:
			if x == index:
				return file_types_image[file_types.index(i)]
	return default

@eel.expose
def download_dir(file):
	type_ = file_type(file)
	type_name = type_.split('/')[-1].split(".")[0].title()
	try:
		type_format = '*.' + file.split(".")[-1]
	except:
		type_format = "*.*"

	root = Tk()
	root.withdraw()
	root.wm_attributes('-topmost', 1)

	askfile = asksaveasfilename(parent=root, initialfile=file.split("/")[-1], filetypes=[(type_name, type_format), ("All files", "*.*")])
	
	if askfile == "" or askfile == None:
		return None

	if askfile.split(".")[-1] == file.split(".")[-1]:
		return askfile
	else:
		return askfile + "." + file.split(".")[-1]

def progress2(current, total):
	global file_size
	x = round(current * 100 / file_size, 1)
	if x > 100:
		x = 100
	eel.change_progress(x)
	print(str(x) + "%")


@eel.expose
def download(file, directory):
	global file_size
	PATH = read_path()

	with open('path.bd', 'r', encoding = 'utf-8') as file_:
		F = file_.readlines()

	temp = eval(F[PATH.index(file)])[1]
	file_id = temp['file_id']
	file_size = temp['file_size']
	print(file)
	try:
		app.download_media(file_id, file_name=directory, progress=progress2)
		return True
	except:
		None
	return False

@eel.expose
def opendir(dir_):
	arr = dir_.split("/")
	str_ = ""
	for i in range(len(arr)):
		if i != len(arr)-1:
			str_ += arr[i] + "\\"
		else:
			str_ += arr[i]
	os.system(f'explorer /select, "{str_}"')


def size_str(bytes_size):
	if bytes_size > 1000000000:
		return str(round(bytes_size/1073741824, 2)) + LANGUAGES[global_lang]["python"]["GB"]
	elif bytes_size > 399999:
		return str(round(bytes_size/1048576, 2)) + LANGUAGES[global_lang]["python"]["MB"]
	elif bytes_size > 999:
		return str(int(bytes_size/1024)) + LANGUAGES[global_lang]["python"]["KB"]
	else:
		return str(bytes_size) + LANGUAGES[global_lang]["python"]["bites"]

@eel.expose
def file_size(file):
	PATH = read_path()
	with open('path.bd', 'r', encoding = 'utf-8') as file_:
		F = file_.readlines()

	temp = eval(F[PATH.index(file)])[1]
	return size_str(temp['file_size'])

@eel.expose
def search(text):
	PATH = read_path()
	array = {"files":[], "folders":[]}
	text = text.lower()
	if PATH:
		for i in PATH:
			if text in i.lower():
				temp = i.split("/")
				if len(temp[-1]) > 0:
					if text in temp[-1].lower():
						array["files"].append(i)
				else:
					if text in temp[-2].lower():
						array["folders"].append(i)
	return array

@eel.expose
def sort_this(array):
	folders = []
	files = []
	for i in array:
		if i[0] == "file":
			files.append(i)
		if i[0] == "folder":
			folders.append(i)

	if current_sort == "by_alphabet":
		folders = sorted(folders)
		files = sorted(files)
		for i in files:
			folders.append(i)
		return folders
	if current_sort == "by_alphabet_reverse":
		folders = sorted(folders)
		folders.reverse()
		files = sorted(files)
		files.reverse()
		for i in files:
			folders.append(i)
		return folders
	if current_sort == "by_date":
		for i in files:
			folders.append(i)
		return folders
	if current_sort == "by_date_reverse":
		folders.reverse()
		files.reverse()
		for i in files:
			folders.append(i)
		return folders

@eel.expose
def show_preview(file):
	if preview_only_images:
		index = file.split(".")[-1]
		for i in file_types:
			for x in i:
				if x == index:
					type_of_file = file_types_str[file_types.index(i)]
					break
		if type_of_file != "image":
			return

	PATH = read_path()
	with open('path.bd', 'r', encoding = 'utf-8') as file_:
		F = file_.readlines()

	temp = eval(F[PATH.index(file)])[1]
	try:
		msg_pre_id = temp['preview_file_id']
		app.download_media(msg_pre_id, file_name="Web\\Temp\\file_preview."+file.split(".")[-1])
		return "Temp\\file_preview."+file.split(".")[-1]
	except:
		return

@eel.expose
def delete_preview():
	try:
		shutil.rmtree("Web\\Temp\\")
	except:
		None

@eel.expose
def memory_used():
	full_size = 0
	try:
		with open('path.bd', 'r', encoding = 'utf-8') as file_:
			F = file_.readlines()
		for i in F:
			file_size = eval(i)[1]['file_size']
			full_size += file_size
	except:
		None
	return size_str(full_size)


eel.init(resource_path("Web"))

if os.path.exists(executable_path()+'\\config.ini'):
	if not os.path.exists(resource_path("")+'config.ini'):
		shutil.copy(executable_path()+'\\config.ini', resource_path(""))
	if not os.path.exists(resource_path("")+'TelegramCloud.session'):
		shutil.copy(executable_path()+'\\TelegramCloud.session', resource_path(""))
	if not os.path.exists(resource_path("")+'path.bd'):
		try:
			shutil.copy(executable_path()+'\\path.bd', resource_path(""))
		except:
			None
	if not os.path.exists(resource_path("")+'settings.json'):
		try:
			shutil.copy(executable_path()+'\\settings.json', resource_path(""))
		except:
			None


	if check_theme() == "dark":
		eel.start("dark.html")
	else:
		eel.start("main.html")
else:
	eel.start("login.html")
