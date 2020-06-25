#!/usr/bin/python3
import argparse

RED_LUM = 0.30
GREEN_LUM = 0.59
BLUE_LUM = 0.11

INTENSITY_FACTOR = 0.75
LIGHT_FACTOR = 0
LUMINOSITY_FACTOR = 0.25

LIGHT_SEL_FACTOR = 0.15
LIGHT_BS_FACTOR = 0.40
LIGHT_TS_FACTOR = 0.20

DARK_SEL_FACTOR = 0.15
DARK_BS_FACTOR = 0.30
DARK_TS_FACTOR = 0.50

HI_SEL_FACTOR = 0.15
HI_BS_FACTOR = 0.40
HI_TS_FACTOR = 0.60

LO_SEL_FACTOR = 0.15
LO_BS_FACTOR = 0.60
LO_TS_FACTOR = 0.50

DARK_THRESHOLD = 0.2
LIGHT_THRESHOLD = 0.93
FOREGROUND_THRESHOLD = 0.7

def brightness(color):
    (red, green, blue) = color
    intensity = (red + green + blue) / 3
    luminosity = int(RED_LUM * red + GREEN_LUM * green + BLUE_LUM * blue)
    maxprimary = max(red, green, blue)
    minprimary = min(red, green, blue)
    light = (minprimary + maxprimary) / 2
    return (intensity * INTENSITY_FACTOR + light * LIGHT_FACTOR + luminosity * LUMINOSITY_FACTOR) / 255

def calculate_colors_for_dark_bg(bg, bri):
    (red, green, blue) = bg
    if bri > FOREGROUND_THRESHOLD:
        fg = (0, 0, 0)
    else:
        fg = (255, 255, 255)
    sel = (red + DARK_SEL_FACTOR * (255 - red),
            green + DARK_SEL_FACTOR * (255 - green),
            blue + DARK_SEL_FACTOR * (255 - blue))
    bs = (red + DARK_BS_FACTOR * (255 - red),
            green + DARK_BS_FACTOR * (255 - green),
            blue + DARK_BS_FACTOR * (255 - blue))
    ts = (red + DARK_TS_FACTOR * (255 - red),
            green + DARK_TS_FACTOR * (255 - green),
            blue + DARK_TS_FACTOR * (255 - blue))
    return (bg, fg, sel, bs, ts)

def calculate_colors_for_medium_bg(bg, bri):
    (red, green, blue) = bg
    if bri > FOREGROUND_THRESHOLD:
        fg = (0, 0, 0)
    else:
        fg = (255, 255, 255)
    f = LO_SEL_FACTOR + bri * (HI_SEL_FACTOR - LO_SEL_FACTOR)
    sel = (red - red * f,
            green - green * f,
            blue - blue * f)
    f = LO_BS_FACTOR + bri * (HI_BS_FACTOR - LO_BS_FACTOR)
    bs = (red - red * f,
            green - green * f,
            blue - blue * f)
    f = LO_TS_FACTOR + bri * (HI_TS_FACTOR - LO_TS_FACTOR)
    ts = (red + (255 - red) * f,
            green + (255 - green) * f,
            blue + (255 - blue) * f)
    return (bg, fg, sel, bs, ts)

def calculate_colors_for_light_bg(bg, bri):
    (red, green, blue) = bg
    if bri > FOREGROUND_THRESHOLD:
        fg = (0, 0, 0)
    else:
        fg = (255, 255, 255)
    sel = (red - LIGHT_SEL_FACTOR * red,
            green - LIGHT_SEL_FACTOR * green,
            blue - LIGHT_SEL_FACTOR * blue)
    bs = (red - LIGHT_BS_FACTOR * red,
            green - LIGHT_BS_FACTOR * green,
            blue - LIGHT_BS_FACTOR * blue)
    ts = (red - LIGHT_TS_FACTOR * red,
            green - LIGHT_TS_FACTOR * green,
            blue - LIGHT_TS_FACTOR * blue)
    return (bg, fg, sel, bs, ts)

def calculate_colors(color):
    bri = brightness(color)
    if bri < DARK_THRESHOLD:
        colors = calculate_colors_for_dark_bg(color, bri)
    elif bri > LIGHT_THRESHOLD:
        colors = calculate_colors_for_light_bg(color, bri)
    else:
        colors = calculate_colors_for_medium_bg(color, bri)
    return tuple(tuple(int(c) for c in color) for color in colors)

def parse_color(color):
    if color.startswith('Black'):
        return (0, 0, 0)
    if color.startswith('White'):
        return (255, 255, 255)
    r = int(color[1:3], 16)
    g = int(color[5:7], 16)
    b = int(color[9:11], 16)
    return (r, g, b)

def format_color(color):
    (r, g, b) = color
    return "#{:02X}{:02X}{:02X}".format(r, g, b)

parser = argparse.ArgumentParser(description='Convert CDE palettes to CSS')
parser.add_argument('file', metavar='FILE',
                    help='Path of input palette file (*.dp)')
parser.add_argument('-c', '--colors', type=int, choices=[2, 4, 8], default=8)

args = parser.parse_args()

with open(args.file) as f:
    lines = f.readlines()
    active = parse_color(lines[0])
    inactive = parse_color(lines[1])
    background = parse_color(lines[2])
    input = parse_color(lines[3])
    window = parse_color(lines[4])
    dialog = parse_color(lines[5])
    seven = parse_color(lines[6])
    eight = parse_color(lines[7])

    active = calculate_colors(active)
    inactive = calculate_colors(inactive)
    input = calculate_colors(input)
    window = calculate_colors(window)
    dialog = calculate_colors(dialog)

    if args.colors == 4:
        window = inactive
        dialog = inactive
    elif args.colors == 2:
        active = input
        inactive = calculate_colors(background)
        input = inactive
        window = inactive
        dialog = inactive

    print(':root {')
    print('  --focus: ' + format_color(active[0]) + ';')
    print()
    print('  --desktop-bg: ' + format_color(background) + ';')
    print()
    print('  --button-bg: ' + format_color(window[0]) + ';')
    print('  --button-fg: ' + format_color(window[1]) + ';')
    print('  --button-active-bg: ' + format_color(window[2]) + ';')
    print('  --button-active-fg: ' + format_color(window[1]) + ';')
    print('  --button-dark: ' + format_color(window[3]) + ';')
    print('  --button-light: ' + format_color(window[4]) + ';')
    print()
    print('  --input-bg: ' + format_color(input[0]) + ';')
    print('  --input-fg: ' + format_color(input[1]) + ';')
    print('  --input-dark: ' + format_color(input[3]) + ';')
    print('  --input-light: ' + format_color(input[4]) + ';')
    print()
    print('  --dialog-button-bg: ' + format_color(dialog[0]) + ';')
    print('  --dialog-button-fg: ' + format_color(dialog[1]) + ';')
    print('  --dialog-button-active-bg: ' + format_color(dialog[2]) + ';')
    print('  --dialog-button-active-fg: ' + format_color(dialog[1]) + ';')
    print('  --dialog-button-dark: ' + format_color(dialog[3]) + ';')
    print('  --dialog-button-light: ' + format_color(dialog[4]) + ';')
    print()
    print('  --title-bar-bg: ' + format_color(inactive[0]) + ';')
    print('  --title-bar-fg: ' + format_color(inactive[1]) + ';')
    print('  --title-bar-dark: ' + format_color(inactive[3]) + ';')
    print('  --title-bar-light: ' + format_color(inactive[4]) + ';')
    print()
    print('  --title-bar-active-bg: ' + format_color(active[0]) + ';')
    print('  --title-bar-active-fg: ' + format_color(active[1]) + ';')
    print('  --title-bar-active-dark: ' + format_color(active[3]) + ';')
    print('  --title-bar-active-light: ' + format_color(active[4]) + ';')
    print('}')

