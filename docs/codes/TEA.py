import sys
import tkinter as tk
import tkinter.ttk as ttk
import tkinter.colorchooser as tkColor
from PIL import Image, ImageTk, ImageGrab
from tkinter.filedialog import askopenfilename, asksaveasfilename

# -------------------- Create Objects --------------------
fontList = sorted(
    [
        "Terminal",
        "Fixedsys",
        "Modern",
        "Roman",
        "Script",
        "Courier",
        "MS Serif",
        "MS Sans Serif",
        "Small Fonts",
        "Marlett",
        "Arial",
        "Arabic Transparent",
        "Arial Baltic",
        "Arial CE",
        "Arial CYR",
        "Arial Greek",
        "Arial TUR",
        "Arial Black",
        "Bahnschrift Light",
        "Bahnschrift SemiLight",
        "Bahnschrift",
        "Bahnschrift SemiBold",
        "Bahnschrift Light SemiCondensed",
        "Bahnschrift SemiLight SemiConde",
        "Bahnschrift SemiCondensed",
        "Bahnschrift SemiBold SemiConden",
        "Bahnschrift Light Condensed",
        "Bahnschrift SemiLight Condensed",
        "Bahnschrift Condensed",
        "Bahnschrift SemiBold Condensed",
        "Calibri",
        "Calibri Light",
        "Cambria",
        "Cambria Math",
        "Candara",
        "Candara Light",
        "Comic Sans MS",
        "Consolas",
        "Constantia",
        "Corbel",
        "Corbel Light",
        "Courier New",
        "Courier New Baltic",
        "Courier New CE",
        "Courier New CYR",
        "Courier New Greek",
        "Courier New TUR",
        "Ebrima",
        "Franklin Gothic Medium",
        "Gabriola",
        "Gadugi",
        "Georgia",
        "Impact",
        "Ink Free",
        "Javanese Text",
        "Leelawadee UI",
        "Leelawadee UI Semilight",
        "Lucida Console",
        "Lucida Sans Unicode",
        "맑은 고딕",
        "맑은 고딕 Semilight",
        "Microsoft Himalaya",
        "Microsoft JhengHei",
        "Microsoft JhengHei UI",
        "Microsoft JhengHei Light",
        "Microsoft JhengHei UI Light",
        "Microsoft New Tai Lue",
        "Microsoft PhagsPa",
        "Microsoft Sans Serif",
        "Microsoft Tai Le",
        "Microsoft YaHei",
        "Microsoft YaHei UI",
        "Microsoft YaHei Light",
        "Microsoft YaHei UI Light",
        "Microsoft Yi Baiti",
        "MingLiU-ExtB",
        "PMingLiU-ExtB",
        "MingLiU_HKSCS-ExtB",
        "Mongolian Baiti",
        "MS Gothic",
        "MS UI Gothic",
        "MS PGothic",
        "MV Boli",
        "Myanmar Text",
        "Nirmala UI",
        "Nirmala UI Semilight",
        "Palatino Linotype",
        "Segoe MDL2 Assets",
        "Segoe Print",
        "Segoe Script",
        "Segoe UI",
        "Segoe UI Black",
        "Segoe UI Emoji",
        "Segoe UI Historic",
        "Segoe UI Light",
        "Segoe UI Semibold",
        "Segoe UI Semilight",
        "Segoe UI Symbol",
        "SimSun",
        "NSimSun",
        "SimSun-ExtB",
        "Sitka Small",
        "Sitka Text",
        "Sitka Subheading",
        "Sitka Heading",
        "Sitka Display",
        "Sitka Banner",
        "Sylfaen",
        "Symbol",
        "Tahoma",
        "Times New Roman",
        "Times New Roman Baltic",
        "Times New Roman CE",
        "Times New Roman CYR",
        "Times New Roman Greek",
        "Times New Roman TUR",
        "Trebuchet MS",
        "Verdana",
        "Webdings",
        "Wingdings",
        "Yu Gothic",
        "Yu Gothic UI",
        "Yu Gothic UI Semibold",
        "Yu Gothic Light",
        "Yu Gothic UI Light",
        "Yu Gothic Medium",
        "Yu Gothic UI Semilight",
        "바탕",
        "바탕체",
        "궁서",
        "궁서체",
        "굴림",
        "굴림체",
        "돋움",
        "돋움체",
        "HoloLens MDL2 Assets",
        "Agency FB",
        "Algerian",
        "Book Antiqua",
        "Arial Narrow",
        "Arial Rounded MT Bold",
        "Baskerville Old Face",
        "Bauhaus 93",
        "Bell MT",
        "Bernard MT Condensed",
        "Bodoni MT",
        "Bodoni MT Black",
        "Bodoni MT Condensed",
        "Bodoni MT Poster Compressed",
        "Bookman Old Style",
        "Bradley Hand ITC",
        "Britannic Bold",
        "Berlin Sans FB",
        "Berlin Sans FB Demi",
        "Broadway",
        "Brush Script MT",
        "Bookshelf Symbol 7",
        "Californian FB",
        "Calisto MT",
        "Castellar",
        "Century Schoolbook",
        "Centaur",
        "Century",
        "Chiller",
        "Colonna MT",
        "Cooper Black",
        "Copperplate Gothic Bold",
        "Copperplate Gothic Light",
        "Curlz MT",
        "Dubai",
        "Dubai Light",
        "Dubai Medium",
        "Elephant",
        "Engravers MT",
        "Eras Bold ITC",
        "Eras Demi ITC",
        "Eras Light ITC",
        "Eras Medium ITC",
        "Felix Titling",
        "Forte",
        "Franklin Gothic Book",
        "Franklin Gothic Demi",
        "Franklin Gothic Demi Cond",
        "Franklin Gothic Heavy",
        "Franklin Gothic Medium Cond",
        "Freestyle Script",
        "French Script MT",
        "Footlight MT Light",
        "Garamond",
        "Gigi",
        "Gill Sans MT",
        "Gill Sans MT Condensed",
        "Gill Sans Ultra Bold Condensed",
        "Gill Sans Ultra Bold",
        "Gloucester MT Extra Condensed",
        "Gill Sans MT Ext Condensed Bold",
        "Century Gothic",
        "Goudy Old Style",
        "Goudy Stout",
        "HY그래픽M",
        "HY궁서B",
        "HY견고딕",
        "HY중고딕",
        "HY견명조",
        "HY신명조",
        "HY목각파임B",
        "HY엽서L",
        "HY엽서M",
        "HY얕은샘물M",
        "Harlow Solid Italic",
        "Harrington",
        "Haettenschweiler",
        "휴먼옛체",
        "휴먼편지체",
        "휴먼아미체",
        "휴먼매직체",
        "휴먼둥근헤드라인",
        "High Tower Text",
        "Imprint MT Shadow",
        "Informal Roman",
        "Blackadder ITC",
        "Edwardian Script ITC",
        "Kristen ITC",
        "Jokerman",
        "Juice ITC",
        "Kunstler Script",
        "Wide Latin",
        "Lucida Bright",
        "Lucida Calligraphy",
        "Leelawadee",
        "Lucida Fax",
        "Lucida Handwriting",
        "Lucida Sans",
        "Lucida Sans Typewriter",
        "Magneto",
        "Maiandra GD",
        "Matura MT Script Capitals",
        "Mistral",
        "Modern No. 20",
        "Microsoft Uighur",
        "Monotype Corsiva",
        "MT Extra",
        "새굴림",
        "Niagara Engraved",
        "Niagara Solid",
        "OCR A Extended",
        "Old English Text MT",
        "Onyx",
        "MS Outlook",
        "Palace Script MT",
        "Papyrus",
        "Parchment",
        "Perpetua",
        "Perpetua Titling MT",
        "Playbill",
        "Poor Richard",
        "Pristina",
        "Rage Italic",
        "Ravie",
        "MS Reference Sans Serif",
        "MS Reference Specialty",
        "Rockwell Condensed",
        "Rockwell",
        "Rockwell Extra Bold",
        "Script MT Bold",
        "Showcard Gothic",
        "Snap ITC",
        "Stencil",
        "Tw Cen MT",
        "Tw Cen MT Condensed",
        "Tw Cen MT Condensed Extra Bold",
        "Tempus Sans ITC",
        "Viner Hand ITC",
        "Vivaldi",
        "Vladimir Script",
        "Wingdings 2",
        "Wingdings 3",
        "휴먼모음T",
        "휴먼엑스포",
        "MecSoft_Font-1",
        "한컴산 뜻돋움",
        "함초롬돋움",
        "함초롬돋움 확장",
        "함초롬바탕 확장",
        "함초롬바탕 확장B",
        "HyhwpEQ",
        "HancomEQN",
        "NewJumja",
        "한컴 고딕",
        "Haan Wing2",
        "Free 3 of 9",
        "Montserrat Medium",
        "Montserrat",
    ]
)
lastx, lasty = 0, 0
bgColor, fontColor, fontSize, fontType = "white", "black", 12, "Arial"
italicCheck, boldCheck = False, False
penSize, penColor, cvColor = 5, "black", "white"
widgetState = None

# -------------------- Text Editing --------------------
def fontSettings():
    if boldCheck and italicCheck:
        note.config(font=(fontType, fontSize, "bold", "italic"), fg=fontColor, bg=bgColor)
    elif boldCheck:
        note.config(font=(fontType, fontSize, "bold"), fg=fontColor, bg=bgColor)
    elif italicCheck:
        note.config(font=(fontType, fontSize, "italic"), fg=fontColor, bg=bgColor)
    else:
        note.config(font=(fontType, fontSize), fg=fontColor, bg=bgColor)


def changeFontType(event):
    global fontType
    fontType = fontTypeCb.get()
    fontSettings()


def changeFontSize(event):
    global fontSize
    fontSize = int(fontSizeCb.get())
    fontSettings()


def changeFontColor():
    global fontColor
    fontColor = tkColor.askcolor()[1]
    fontColorButton.config(fg=fontColor)
    fontSettings()


def changeBgColor():
    global bgColor
    bgColor = tkColor.askcolor()[1]
    bgColorButton.config(fg=bgColor)
    fontSettings()


def changeBold():
    global boldCheck
    boldCheck = not boldCheck
    fontSettings()


def changeItalic():
    global italicCheck
    italicCheck = not italicCheck
    fontSettings()


def newNote():
    global widgetState
    widgetState = "note"
    canvas.grid_remove()
    canvasSettingsFrame.grid_remove()
    noteSettingsFrame.grid(row=0, column=0, sticky="nesw")
    fontSettings()
    note.delete("1.0", tk.END)
    note.grid(row=1, column=0, sticky="nesw")


# -------------------- Drawing Canvas --------------------
def changePenSize(event):
    global penSize
    penSize = int(penSizeCb.get())


def changePenColor():
    global penColor
    penColor = tkColor.askcolor()[1]
    penColorButton.config(fg=penColor)


def changeCvColor():
    global cvColor
    cvColor = tkColor.askcolor()[1]
    canvas.config(bg=cvColor)
    cvColorButton.config(fg=cvColor)


def xy(event):
    global lastx, lasty
    lastx, lasty = event.x, event.y


def addLine(event):
    global lastx, lasty
    canvas.create_line((lastx, lasty, event.x, event.y), fill=penColor, width=penSize)
    lastx, lasty = event.x, event.y


def newCanvas():
    global widgetState
    widgetState = "canvas"
    note.grid_remove()
    noteSettingsFrame.grid_remove()
    canvas.delete("all")
    canvasSettingsFrame.grid(row=0, column=0, sticky="nesw")
    canvas.config(bg=cvColor)
    canvas.grid(row=1, column=0, sticky="nesw")
    canvas.bind("<Button-1>", xy)
    canvas.bind("<B1-Motion>", addLine)


# -------------------- Miscellaneous --------------------
def openText():
    newNote()
    filepath = askopenfilename(filetypes=[("Text Files", "*.txt"), ("All Files", "*.*")])
    if not filepath:
        return
    with open(filepath, "r", encoding="UTF8") as input_file:
        note.insert(tk.END, input_file.read())
    window.title(f"T.E.A. (Text Editor Advanced) - {filepath}")


def openImage():
    newCanvas()
    filepath = askopenfilename(filetypes=[("Image Files", "*.jpg"), ("All Files", "*.*")])
    if not filepath:
        return
    window.tkimage = tkimage = ImageTk.PhotoImage(Image.open(filepath))
    canvas.create_image(0, 0, anchor="nw", image=tkimage)
    window.title(f"T.E.A. (Text Editor Advanced) - {filepath}")


def saveAs():
    if widgetState == None:
        return
    elif widgetState == "canvas":
        grabImage(canvas)
        return
    filepath = asksaveasfilename(defaultextension="txt", filetypes=[("Text Files", "*.txt"), ("All Files", "*.*")])
    if not filepath:
        return
    with open(filepath, "w") as output_file:
        text = note.get(1.0, tk.END)
        output_file.write(text)
    window.title(f"T.E.A. (Text Editor Advanced) - {filepath}")


def grabImage(widget):
    filepath = asksaveasfilename(defaultextension="jpg", filetypes=[("Image Files", "*.jpg"), ("All Files", "*.*")])
    if not filepath:
        return
    x, y = window.winfo_rootx() + widget.winfo_x(), window.winfo_rooty() + widget.winfo_y()
    x1, y1 = x + widget.winfo_width(), y + widget.winfo_height()
    ImageGrab.grab().crop((x, y, x1, y1)).save(filepath)


def setWindowPos(yPosition, xPosition):
    if yPosition == "full":
        window.geometry("{}x{}+{}+{}".format(screenWidth, screenHeight, 0, 0))
        return
    windowWidth, windowHeight = window.winfo_width(), window.winfo_height()
    x, y = 0, 0
    if xPosition == "center":
        x = (screenWidth - windowWidth) / 2
    elif xPosition == "right":
        x = screenWidth - windowWidth
    if yPosition == "mid":
        y = (screenHeight - windowHeight) / 2
    elif yPosition == "bottom":
        y = screenHeight - windowHeight
    window.geometry("{}x{}+{}+{}".format(windowWidth, windowHeight, int(x), int(y)))


# -------------------- Window --------------------
window = tk.Tk()
screenWidth, screenHeight = window.winfo_screenwidth(), window.winfo_screenheight()
window.title("T.E.A. (Text Editor Advanced)")
window.geometry("800x450+500+200")
window.rowconfigure(1, weight=1)
window.columnconfigure(0, weight=1)
note = tk.Text(window)
canvas = tk.Canvas(window)

# -------------------- Note --------------------
noteSettingsFrame = tk.Frame(window)
noteSettingsFrame.rowconfigure(0, weight=1)
noteSettingsFrame.columnconfigure(5, weight=1)
# 글꼴
selectFontType = tk.StringVar(window)
selectFontType.set("Font Type")
fontTypeCb = ttk.Combobox(noteSettingsFrame, textvariable=selectFontType, values=fontList, width=15)
fontTypeCb.grid(row=0, column=0, padx=5, pady=3)
fontTypeCb.bind("<<ComboboxSelected>>", changeFontType)
# 글자 크기
selectFontSize = tk.StringVar(window)
selectFontSize.set("Font Size")
fontSizeCb = ttk.Combobox(noteSettingsFrame, textvariable=selectFontSize, values=list(range(2, 101, 2)), width=8)
fontSizeCb.grid(row=0, column=1, padx=5, pady=3)
fontSizeCb.bind("<<ComboboxSelected>>", changeFontSize)
# 글자 색
fontColorButton = tk.Button(noteSettingsFrame, text="Font Color", command=changeFontColor)
fontColorButton.grid(row=0, column=2, padx=5, pady=3)
# 배경 색
bgColorButton = tk.Button(noteSettingsFrame, text="Background Color", command=changeBgColor)
bgColorButton.grid(row=0, column=3, padx=5, pady=3)
# bold
boldCheckbutton = tk.Checkbutton(noteSettingsFrame, text="Bold", command=changeBold)
boldCheckbutton.grid(row=0, column=4, padx=5, pady=3)
# italic
italicCheckbutton = tk.Checkbutton(noteSettingsFrame, text="Italic", command=changeItalic)
italicCheckbutton.grid(row=0, column=5, padx=5, pady=3, sticky="nsw")

# -------------------- Canvas --------------------
canvasSettingsFrame = tk.Frame(window)
canvasSettingsFrame.rowconfigure(0, weight=1)
canvasSettingsFrame.columnconfigure(3, weight=1)
# 펜 굵기
selectPenSize = tk.StringVar(window)
selectPenSize.set("Pen Size")
penSizeCb = ttk.Combobox(canvasSettingsFrame, textvariable=selectPenSize, values=list(range(1, 50)), width=8)
penSizeCb.grid(row=0, column=0, padx=5, pady=3)
penSizeCb.bind("<<ComboboxSelected>>", changePenSize)
# 펜 색깔
penColorButton = tk.Button(canvasSettingsFrame, text="Pen Color", command=changePenColor)
penColorButton.grid(row=0, column=1, padx=5, pady=3)
# 캔버스 색깔
cvColorButton = tk.Button(canvasSettingsFrame, text="Canvas Color", command=changeCvColor)
cvColorButton.grid(row=0, column=2, padx=5, pady=3, sticky="we")


# -------------------- Menu Bar --------------------
menubar = tk.Menu(window)
# file 메뉴
fileMenu = tk.Menu(menubar, tearoff=False)
# file - new 메뉴
newMenu = tk.Menu(menubar, tearoff=False)
newMenu.add_command(label="New Note", command=newNote)
newMenu.add_command(label="New Canvas", command=newCanvas)
fileMenu.add_cascade(label="New", menu=newMenu)
# file - open 메뉴
openMenu = tk.Menu(menubar, tearoff=False)
openMenu.add_command(label="Open Text", command=openText)
openMenu.add_command(label="Open Image", command=openImage)
fileMenu.add_cascade(label="Open", menu=openMenu)
# file - save as 버튼
fileMenu.add_command(label="Save As...", command=saveAs)
fileMenu.add_separator()
# file - exit 버튼
fileMenu.add_command(label="Exit", command=sys.exit)

# -------------------- setPosition --------------------
setPosMenu = tk.Menu(menubar, tearoff=False)
setPosMenu.add_command(label="Full Screen", command=lambda: setWindowPos("full", "full"))
setPosMenu.add_command(label="Top Left", command=lambda: setWindowPos("top", "left"))
setPosMenu.add_command(label="Top Center", command=lambda: setWindowPos("top", "center"))
setPosMenu.add_command(label="Top Right", command=lambda: setWindowPos("top", "right"))
setPosMenu.add_separator()
setPosMenu.add_command(label="Mid Left", command=lambda: setWindowPos("mid", "left"))
setPosMenu.add_command(label="Center", command=lambda: setWindowPos("mid", "center"))
setPosMenu.add_command(label="Mid Right", command=lambda: setWindowPos("mid", "right"))
setPosMenu.add_separator()
setPosMenu.add_command(label="Bottom Left", command=lambda: setWindowPos("bottom", "left"))
setPosMenu.add_command(label="Bottom Center", command=lambda: setWindowPos("bottom", "center"))
setPosMenu.add_command(label="Bottom Right", command=lambda: setWindowPos("bottom", "right"))

# -------------------- Etc. --------------------
menubar.add_cascade(label="File", menu=fileMenu)
menubar.add_cascade(label="Set Position", menu=setPosMenu)
window.config(menu=menubar)
window.mainloop()
