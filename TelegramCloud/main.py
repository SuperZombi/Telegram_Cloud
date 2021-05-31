from pyrogram import Client
from pyrogram.errors import FloodWait, BadRequest, UnknownError
from tkinter import Tk
from tkinter.filedialog import askopenfilenames, asksaveasfilename
import time
from os import startfile
import eel
from os.path import exists
from bs4 import BeautifulSoup
import requests

phone = ""
started = False
PATH = []
current_path = "/"
current_sort = "by_alphabet"
__version__ = 1.3

CONTENT_TYPES = ["text", "audio", "document", "photo", "sticker", "video", "video_note", "voice", "location", "contact",
                 "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo",
                 "group_chat_created", "supergroup_chat_created", "channel_chat_created", "migrate_to_chat_id",
                 "migrate_from_chat_id", "pinned_message"]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'}

@eel.expose
def sort_by(what):
	global current_sort
	if what == current_sort:
		current_sort = str(what) + "_reverse"
	else:
		current_sort = what

@eel.expose()
def get_curent_arrow():
	return current_sort

@eel.expose()
def check_updates():
	response = requests.get('https://github.com/SuperZombi/Telegram_Cloud')
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
	with open('config.ini', 'w') as file:
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

	except FileNotFoundError:
		return False

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

def progress(current, total):
	global x, y
	eel.progres(x, y, round(current * 100 / total, 1))
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


@eel.expose
def upload(array, path):
	logs = []
	global x, y, PATH
	x = 1
	y = len(array)
	read_path()
	for i in array:
		splited = i.split('/')
		name = splited[-1]
		path_ = str(path) + str(name)

		if file_exists(path_):
			tmp_ = i.split("/")[-1]
			logs.append("Файл " + str(tmp_) + " уже существует!")
			print("  Файл " + str(i) + " уже существует!")
			x+=1
			continue

		print(i)
		f = open(str(i), "rb")
		
		message = app.send_document('TelegCloudyBot', f, progress=progress)
		msg_id = message.message_id
		for i in CONTENT_TYPES:
			try:
				media = message[i]
				file_id = media['file_id']
				size = media['file_size']
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
		print("Ошибка! Файл '" + str(path) + "' не был удален с сервера!")
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
				print("Ошибка! Файл '" + str(i) + "' не был удален с сервера!")
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
file_types_image = ["images/archive.png", "images/audio.png", "images/image.png", "images/video.png", "images/code.png", "images/binary.png", "images/document.png"]


@eel.expose
def file_type(name):
	default = "images/file.png"
	try:
		index = name.split(".")[-1]
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
	arr = dir_.split("/")[:-1]
	str_ = ""
	for i in arr:
		str_ += i + "\\"
	startfile(str_)


def size_str(bytes_size):
	if bytes_size > 1000000000:
		return str(round(bytes_size/1073741824, 2)) + " ГБ"
	elif bytes_size > 399999:
		return str(round(bytes_size/1048576, 2)) + " МБ"
	elif bytes_size > 999:
		return str(int(bytes_size/1024)) + " КБ"
	else:
		return str(bytes_size) + " байт"

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
	for i in PATH:
		if text in i:
			temp = i.split("/")
			if len(temp[-1]) > 0:
				if text in temp[-1]:
					array["files"].append(i)
			else:
				if text in temp[-2]:
					array["folders"].append(i)
	return array

eel.init("Web")

if exists('config.ini'):
	eel.start("main.html")

else:
	eel.start("login.html")
