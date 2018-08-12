//% color=#fabe58 icon="\uf108" block="Grove OLED"
namespace oled96 {
    //% blockId=oled96_init_display
    //% block="initialize display"
    export function initDisplay(): void {
        cmd(DISPLAY_OFF);
        cmd(0x20);
        cmd(0x00);
        cmd(COM_SCAN_DEC);
        cmd(0xA1);
        cmd(DISPLAY_ON);
        cmd(NORMAL_DISPLAY);
        clearDisplay();
    }

    //% blockId=oled96_clear_display
    //% block="clear display"
    export function clearDisplay() {
        cmd(DISPLAY_OFF);   //display off
        for (let j = 0; j < 8; j++) {
            setTextXY(j, 0);
            {
                for (let i = 0; i < 16; i++)  //clear all columns
                {
                    putChar(' ');
                }
            }
        }
        cmd(DISPLAY_ON);    //display on
        setTextXY(0, 0);
    }

    //% blockId=oled96_set_text
    //% block="set display cursor to|row %row|and column %column"
    export function setTextXY(row: number, column: number) {
        let r = row;
        let c = column;
        if (row > 7) {
            r = 7;
        }
        if (column > 15) {
            c = 15;
        }

        cmd(0xB0 + r);            //set page address
        cmd(0x00 + (8 * c & 0x0F));  //set column lower address
        cmd(0x10 + ((8 * c >> 4) & 0x0F));   //set column higher address
    }

    function putChar(c: string) {
        let c1 = c.charCodeAt(0);
        if (c1 < 32 || c1 > 127) //Ignore non-printable ASCII characters. This can be modified for multilingual font.
        {
            c1 = 0x20; //Space
        }
        for (let i = 0; i < 8; i++) {
            pins.i2cWriteNumber(0x3c, 0x4000 + basicFont[c1 - 32][i], NumberFormat.UInt16BE);
        }
    }

    //% blockId=oled96_write_string
    //% block="write %s|to display"
    export function writeString(s: string) {
        for (let c of s) {
            putChar(c);
        }
    }

    //% blockId=oled96_normal_display
    //% block="set display to white on black"
    export function normalDisplay() {
        cmd(NORMAL_DISPLAY);
    }

    //% blockId=oled96_invert_display
    //% block="set display to black on white"
    export function invertDisplay() {
        cmd(INVERT_DISPLAY);
    }

    //% blockId=oled96_flip_screen
    //% block="flip display"
    export function flipScreen() {
        cmd(DISPLAY_OFF);
        cmd(COM_SCAN_INC);
        if (flipped) {
            cmd(0xA1)
        } else {
            cmd(0xA0);
        }
        cmd(DISPLAY_ON);
    }

    //% blockId=oled96_set_brightness
    //% block="set display brightness|to %brightness"
    export function setDisplayBrightness(brightness: number) {
        let b = brightness
        if (b < 0) {
            b = 0;
        }
        if (b > 255) {
            b = 255;
        }
        cmd(0x81);
        cmd(b);
    }

    //% blockId=oled96_send_command
    //% block="send command %c|to display"
    export function cmd(c: number) {
        pins.i2cWriteNumber(0x3c, c, NumberFormat.UInt16BE);
    }
}

let flipped = false;

const DISPLAY_OFF = 0xAE;
const DISPLAY_ON = 0xAF;
const SET_DISPLAY_CLOCK_DIV = 0xD5;
const SET_MULTIPLEX = 0xA8;
const SET_DISPLAY_OFFSET = 0xD3;
const SET_START_LINE = 0x00;
const CHARGE_PUMP = 0x8D;
const EXTERNAL_VCC = false;
const MEMORY_MODE = 0x20;
const SEG_REMAP = 0xA1; // using 0xA0 will flip screen
const COM_SCAN_DEC = 0xC8;
const COM_SCAN_INC = 0xC0;
const SET_COM_PINS = 0xDA;
const SET_CONTRAST = 0x81;
const SET_PRECHARGE = 0xd9;
const SET_VCOM_DETECT = 0xDB;
const DISPLAY_ALL_ON_RESUME = 0xA4;
const NORMAL_DISPLAY = 0xA6;
const COLUMN_ADDR = 0x21;
const PAGE_ADDR = 0x22;
const INVERT_DISPLAY = 0xA7;
const ACTIVATE_SCROLL = 0x2F;
const DEACTIVATE_SCROLL = 0x2E;
const SET_VERTICAL_SCROLL_AREA = 0xA3;
const RIGHT_HORIZONTAL_SCROLL = 0x26;
const LEFT_HORIZONTAL_SCROLL = 0x27;
const VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL = 0x29;
const VERTICAL_AND_LEFT_HORIZONTAL_SCROLL = 0x2A;

const basicFont: number[][] = [
    [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // " "
    [0x00, 0x00, 0x5F, 0x00, 0x00, 0x00, 0x00, 0x00], // "!"
    [0x00, 0x00, 0x07, 0x00, 0x07, 0x00, 0x00, 0x00], // """
    [0x00, 0x14, 0x7F, 0x14, 0x7F, 0x14, 0x00, 0x00], // "#"
    [0x00, 0x24, 0x2A, 0x7F, 0x2A, 0x12, 0x00, 0x00], // "$"
    [0x00, 0x23, 0x13, 0x08, 0x64, 0x62, 0x00, 0x00], // "%"
    [0x00, 0x36, 0x49, 0x55, 0x22, 0x50, 0x00, 0x00], // "&"
    [0x00, 0x00, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00], // "'"
    [0x00, 0x1C, 0x22, 0x41, 0x00, 0x00, 0x00, 0x00], // "("
    [0x00, 0x41, 0x22, 0x1C, 0x00, 0x00, 0x00, 0x00], // ")"
    [0x00, 0x08, 0x2A, 0x1C, 0x2A, 0x08, 0x00, 0x00], // "*"
    [0x00, 0x08, 0x08, 0x3E, 0x08, 0x08, 0x00, 0x00], // "+"
    [0x00, 0xA0, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00], // ","
    [0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00], // "-"
    [0x00, 0x60, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00], // "."
    [0x00, 0x20, 0x10, 0x08, 0x04, 0x02, 0x00, 0x00], // "/"
    [0x00, 0x3E, 0x51, 0x49, 0x45, 0x3E, 0x00, 0x00], // "0"
    [0x00, 0x00, 0x42, 0x7F, 0x40, 0x00, 0x00, 0x00], // "1"
    [0x00, 0x62, 0x51, 0x49, 0x49, 0x46, 0x00, 0x00], // "2"
    [0x00, 0x22, 0x41, 0x49, 0x49, 0x36, 0x00, 0x00], // "3"
    [0x00, 0x18, 0x14, 0x12, 0x7F, 0x10, 0x00, 0x00], // "4"
    [0x00, 0x27, 0x45, 0x45, 0x45, 0x39, 0x00, 0x00], // "5"
    [0x00, 0x3C, 0x4A, 0x49, 0x49, 0x30, 0x00, 0x00], // "6"
    [0x00, 0x01, 0x71, 0x09, 0x05, 0x03, 0x00, 0x00], // "7"
    [0x00, 0x36, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00], // "8"
    [0x00, 0x06, 0x49, 0x49, 0x29, 0x1E, 0x00, 0x00], // "9"
    [0x00, 0x00, 0x36, 0x36, 0x00, 0x00, 0x00, 0x00], // ":"
    [0x00, 0x00, 0xAC, 0x6C, 0x00, 0x00, 0x00, 0x00], // ";"
    [0x00, 0x08, 0x14, 0x22, 0x41, 0x00, 0x00, 0x00], // "<"
    [0x00, 0x14, 0x14, 0x14, 0x14, 0x14, 0x00, 0x00], // "="
    [0x00, 0x41, 0x22, 0x14, 0x08, 0x00, 0x00, 0x00], // ">"
    [0x00, 0x02, 0x01, 0x51, 0x09, 0x06, 0x00, 0x00], // "?"
    [0x00, 0x32, 0x49, 0x79, 0x41, 0x3E, 0x00, 0x00], // "@"
    [0x00, 0x7E, 0x09, 0x09, 0x09, 0x7E, 0x00, 0x00], // "A"
    [0x00, 0x7F, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00], // "B"
    [0x00, 0x3E, 0x41, 0x41, 0x41, 0x22, 0x00, 0x00], // "C"
    [0x00, 0x7F, 0x41, 0x41, 0x22, 0x1C, 0x00, 0x00], // "D"
    [0x00, 0x7F, 0x49, 0x49, 0x49, 0x41, 0x00, 0x00], // "E"
    [0x00, 0x7F, 0x09, 0x09, 0x09, 0x01, 0x00, 0x00], // "F"
    [0x00, 0x3E, 0x41, 0x41, 0x51, 0x72, 0x00, 0x00], // "G"
    [0x00, 0x7F, 0x08, 0x08, 0x08, 0x7F, 0x00, 0x00], // "H"
    [0x00, 0x41, 0x7F, 0x41, 0x00, 0x00, 0x00, 0x00], // "I"
    [0x00, 0x20, 0x40, 0x41, 0x3F, 0x01, 0x00, 0x00], // "J"
    [0x00, 0x7F, 0x08, 0x14, 0x22, 0x41, 0x00, 0x00], // "K"
    [0x00, 0x7F, 0x40, 0x40, 0x40, 0x40, 0x00, 0x00], // "L"
    [0x00, 0x7F, 0x02, 0x0C, 0x02, 0x7F, 0x00, 0x00], // "M"
    [0x00, 0x7F, 0x04, 0x08, 0x10, 0x7F, 0x00, 0x00], // "N"
    [0x00, 0x3E, 0x41, 0x41, 0x41, 0x3E, 0x00, 0x00], // "O"
    [0x00, 0x7F, 0x09, 0x09, 0x09, 0x06, 0x00, 0x00], // "P"
    [0x00, 0x3E, 0x41, 0x51, 0x21, 0x5E, 0x00, 0x00], // "Q"
    [0x00, 0x7F, 0x09, 0x19, 0x29, 0x46, 0x00, 0x00], // "R"
    [0x00, 0x26, 0x49, 0x49, 0x49, 0x32, 0x00, 0x00], // "S"
    [0x00, 0x01, 0x01, 0x7F, 0x01, 0x01, 0x00, 0x00], // "T"
    [0x00, 0x3F, 0x40, 0x40, 0x40, 0x3F, 0x00, 0x00], // "U"
    [0x00, 0x1F, 0x20, 0x40, 0x20, 0x1F, 0x00, 0x00], // "V"
    [0x00, 0x3F, 0x40, 0x38, 0x40, 0x3F, 0x00, 0x00], // "W"
    [0x00, 0x63, 0x14, 0x08, 0x14, 0x63, 0x00, 0x00], // "X"
    [0x00, 0x03, 0x04, 0x78, 0x04, 0x03, 0x00, 0x00], // "Y"
    [0x00, 0x61, 0x51, 0x49, 0x45, 0x43, 0x00, 0x00], // "Z"
    [0x00, 0x7F, 0x41, 0x41, 0x00, 0x00, 0x00, 0x00], // "["
    [0x00, 0x02, 0x04, 0x08, 0x10, 0x20, 0x00, 0x00], // "\"
    [0x00, 0x41, 0x41, 0x7F, 0x00, 0x00, 0x00, 0x00], // "]"
    [0x00, 0x04, 0x02, 0x01, 0x02, 0x04, 0x00, 0x00], // "^"
    [0x00, 0x80, 0x80, 0x80, 0x80, 0x80, 0x00, 0x00], // "_"
    [0x00, 0x01, 0x02, 0x04, 0x00, 0x00, 0x00, 0x00], // "`"
    [0x00, 0x20, 0x54, 0x54, 0x54, 0x78, 0x00, 0x00], // "a"
    [0x00, 0x7F, 0x48, 0x44, 0x44, 0x38, 0x00, 0x00], // "b"
    [0x00, 0x38, 0x44, 0x44, 0x28, 0x00, 0x00, 0x00], // "c"
    [0x00, 0x38, 0x44, 0x44, 0x48, 0x7F, 0x00, 0x00], // "d"
    [0x00, 0x38, 0x54, 0x54, 0x54, 0x18, 0x00, 0x00], // "e"
    [0x00, 0x08, 0x7E, 0x09, 0x02, 0x00, 0x00, 0x00], // "f"
    [0x00, 0x18, 0xA4, 0xA4, 0xA4, 0x7C, 0x00, 0x00], // "g"
    [0x00, 0x7F, 0x08, 0x04, 0x04, 0x78, 0x00, 0x00], // "h"
    [0x00, 0x00, 0x7D, 0x00, 0x00, 0x00, 0x00, 0x00], // "i"
    [0x00, 0x80, 0x84, 0x7D, 0x00, 0x00, 0x00, 0x00], // "j"
    [0x00, 0x7F, 0x10, 0x28, 0x44, 0x00, 0x00, 0x00], // "k"
    [0x00, 0x41, 0x7F, 0x40, 0x00, 0x00, 0x00, 0x00], // "l"
    [0x00, 0x7C, 0x04, 0x18, 0x04, 0x78, 0x00, 0x00], // "m"
    [0x00, 0x7C, 0x08, 0x04, 0x7C, 0x00, 0x00, 0x00], // "n"
    [0x00, 0x38, 0x44, 0x44, 0x38, 0x00, 0x00, 0x00], // "o"
    [0x00, 0xFC, 0x24, 0x24, 0x18, 0x00, 0x00, 0x00], // "p"
    [0x00, 0x18, 0x24, 0x24, 0xFC, 0x00, 0x00, 0x00], // "q"
    [0x00, 0x00, 0x7C, 0x08, 0x04, 0x00, 0x00, 0x00], // "r"
    [0x00, 0x48, 0x54, 0x54, 0x24, 0x00, 0x00, 0x00], // "s"
    [0x00, 0x04, 0x7F, 0x44, 0x00, 0x00, 0x00, 0x00], // "t"
    [0x00, 0x3C, 0x40, 0x40, 0x7C, 0x00, 0x00, 0x00], // "u"
    [0x00, 0x1C, 0x20, 0x40, 0x20, 0x1C, 0x00, 0x00], // "v"
    [0x00, 0x3C, 0x40, 0x30, 0x40, 0x3C, 0x00, 0x00], // "w"
    [0x00, 0x44, 0x28, 0x10, 0x28, 0x44, 0x00, 0x00], // "x"
    [0x00, 0x1C, 0xA0, 0xA0, 0x7C, 0x00, 0x00, 0x00], // "y"
    [0x00, 0x44, 0x64, 0x54, 0x4C, 0x44, 0x00, 0x00], // "z"
    [0x00, 0x08, 0x36, 0x41, 0x00, 0x00, 0x00, 0x00], // "{"
    [0x00, 0x00, 0x7F, 0x00, 0x00, 0x00, 0x00, 0x00], // "|"
    [0x00, 0x41, 0x36, 0x08, 0x00, 0x00, 0x00, 0x00], // "}"
    [0x00, 0x02, 0x01, 0x01, 0x02, 0x01, 0x00, 0x00] // "~"
];
