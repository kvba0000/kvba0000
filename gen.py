if __name__ != "__main__": exit(1)

import gifos
from random import randint, choice
from datetime import date
from colorama import Fore, Style, Back
import urllib.request

class Colors:
    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    BROWN = "\033[0;33m"
    BLUE = "\033[0;34m"
    PURPLE = "\033[0;35m"
    CYAN = "\033[0;36m"
    LIGHT_RED = "\033[1;31m"
    LIGHT_GREEN = "\033[1;32m"
    YELLOW = "\033[1;33m"
    LIGHT_BLUE = "\033[1;34m"
    LIGHT_PURPLE = "\033[1;35m"
    LIGHT_CYAN = "\033[1;36m"
    LIGHT_WHITE = "\033[1;37m"

# Fun little config here
username = "kvba0000" # Github Username (for fetching most of the stuff)
tagline = "meowpa.ws" # Second text after rainbow animation

main_color = Fore.RED

# \/ Self-explanatory
prompt = f"{Style.BRIGHT}{main_color}-[{Fore.WHITE}{username}{main_color}@{Fore.WHITE}readme{main_color}]>{Style.RESET_ALL} "
dob = (27, 5, 2005) # Date of birth


# Less fun pile of code down there

FONT = "./fonts/Hack-Regular.ttf"

def genMidCol(text): return (t.num_cols - len(text) + 1) // 2
def getGithubAvatar(username, size=200):
    """
    Function to retrieve the GitHub avatar for a given username with an optional size parameter.
    
    :param username: The GitHub username for which the avatar is to be retrieved
    :param size: The size of the avatar (default is 200)
    :return: The file path where the avatar is saved
    """
    p = f"av_{username}.png"
    urllib.request.urlretrieve(f"https://github.com/{username}.png?size={size}", p)
    return p


d = date.today()

t = gifos.Terminal(750, 500, 10, 10, font_file=FONT, font_size=15)
t.set_fps(15)
t.set_loop_count(-1)

github = gifos.utils.fetch_github_stats(username)

y = gifos.utils.calc_age(*dob)
# RIP neofetch
github_neofetch = [ 
    [f"{username}@readme", None],
    ["Name", "Kuba"],
    ["Location", "Poland"],
    ["Uptime", f"{y.years} years, {y.months} months and {y.days} days"],
    ["OS", "[Linux Mint, Windows 10, Android 13]"],
    ["", ""],
    ["Contact", None],
    ["E-Mail", "hi@kuba.lol"],
    ["Discord", ".kb."],
    ["Telegram", "kvba0000"],
    ["Signal", "kvba.1000"],
    ["", ""],
    [f"GitHub ({username})", None],
    ["Total Stars", github.total_stargazers],
    ["Pull Requests", f"{github.total_pull_requests_made} ({github.total_pull_requests_merged})"],
    ["Languages", f"[{', '.join(map(lambda x: f'{x[0]}', github.languages_sorted[:3]))}]"]
]

def generate_neofetch(row_num):
    """
    Generate neofetch information and paste it in the fake terminal.
    :param row_num: the row number where neofetch fill start printing
    """
    x = 3
    y = row_num
    t.paste_image(getGithubAvatar(username, 300), y+2,x)
    x += 36
    for [k, v] in github_neofetch:
        [kStyle, vStyle] = [Fore.WHITE, Fore.BLACK+Back.WHITE] if v == None else [Style.BRIGHT+Fore.WHITE, Style.RESET_ALL+main_color]
        if v == None:
            t.gen_text(f"{kStyle}{k}{Style.RESET_ALL}", y, x, contin=True, count=0)
            t.gen_text(vStyle+("-"*(len(k)+2))+Style.RESET_ALL, y+1, x, contin=True, count=0)
            y+=2
        else:
            t.gen_text(" " if k=="" and v=="" else f"{kStyle}{k}: {vStyle}{v}{Style.RESET_ALL}", y, x, contin=True, count=0)
            y+=1


# Basically most of the animations are below :3


t.gen_text("", 1, count=10)
t.toggle_show_cursor(False)

t.gen_text(f"Github {d.day}.{d.month} readme tty1", 1, count=6)
t.gen_text(f"kvba (c) {d.year}", 2, count=12)
t.toggle_show_cursor(True)
t.gen_text("",2, count=12)

t.gen_text(f"login:{Fore.RED} ", 4, count=12)
t.gen_typing_text(username, 4, contin=True, speed=2)
t.delete_row(4)
t.gen_text(f"{Fore.RESET}login:{Fore.GREEN} {username}{Fore.RESET}", 4, count=0)

t.gen_text(f"{Fore.RESET}password:{Fore.RED} ", 5, count=8)
passwd = "*"*randint(8,10)
t.gen_typing_text(passwd, 5, contin=True, speed=3)
t.delete_row(5)
t.gen_text(f"{Fore.RESET}password:{Fore.GREEN} {passwd}{Fore.RESET}", 5, count=0)
t.gen_text("\n", 6, count=12)

# Scramble text
effect_text = f"Welcome, {github.account_name}!"
el = gifos.effects.text_scramble_effect_lines(effect_text, 2, include_special=True)

mid_row = (t.num_rows + 1) // 2
mid_col = genMidCol(effect_text)
cols = list(filter(lambda x: not x.startswith("__"), dir(Colors)))

t.toggle_show_cursor(False)
for i in range(len(el)):
    t.delete_row(mid_row + 1)
    t.gen_text(f"{Colors.GREEN}{el[i]}", mid_row + 1, mid_col + 1)

for _ in range(1):
    def gen(width):
        c = choice(cols)
        for _ in range(2): t.gen_text(f"{getattr(Colors, c)}{effect_text}", mid_row + 1, mid_col + 1 + width)
    for i in range(0, -5, -1): gen(i)
    for i in range(-5, 5, 1): gen(i)
    for i in range(5, 0, -1): gen(i)

tt = " "
text_mid_col = genMidCol(tt)
t.gen_text(tt, mid_row + 1, text_mid_col + 1)

text = " ".join([*effect_text])
text_mid_col = genMidCol(text)
t.gen_text(Colors.BLUE+text, mid_row + 1, text_mid_col + 1, count=24)

tt = "meowpa.ws"
text = " ".join([*tt])
text_mid_col = genMidCol(text)
t.gen_text(Colors.BLUE+text, mid_row + 1, text_mid_col + 1, count=24)

tt = " "
text_mid_col = genMidCol(tt)
t.gen_text(tt, mid_row + 1, text_mid_col + 1)

tt = "Press any key to continue..."
text = " ".join([*tt])
text_mid_col = genMidCol(text)
t.toggle_show_cursor(True)
t.gen_text(Colors.BLUE+text, mid_row + 1, text_mid_col + 1, count=48)

t.set_prompt(prompt)

t.clear_frame()
t.clone_frame(5)

t.gen_prompt(1, count=24)
t.gen_typing_text(f"{Colors.RED}fastfetch", 1, contin=True)
t.delete_row(1)
t.gen_text(f"{prompt}{Colors.GREEN}fastfetch", 1, count=0)
t.gen_text("\n", 2, count=24)

generate_neofetch(3)

t.gen_prompt(t.num_rows, count=24)
t.gen_typing_text("hi :3", t.num_rows, contin=True, speed=3)
t.gen_text("", t.num_rows, contin=True, count=256)


t.gen_gif()
