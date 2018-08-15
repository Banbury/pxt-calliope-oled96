# MakeCode blocks for the Grove OLED 0.96" display

This is a library of MakeCode blocks for controlling the [Grove - OLED Display 0.96"](https://www.seeedstudio.com/Grove-OLED-Display-0.96%26quot%3B-p-781.html) with the SSD1308 chip from Seeed.
It's a port of the C++ library provided by Seeed to Typescript with some minor improvements.

This library is meant for the Calliope Mini.

## Usage

Connect the Calliope Mini to the left Grove connector.

In MakeCode open the Advanced folder and click `Add Package`. Copy the URL of this repository to the search box and press enter. Then select `calliope-oled96`.

A new folder `Grove OLED` should appear in the package list.

Always use `initialize display` at the start of your program to reset the screen.

The display has a width of 16 characters and a height of eight lines. Strings that are longer than 16 character flow into the next line.
