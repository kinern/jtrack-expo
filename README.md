# jtrack-expo
An Exercise Tracking App Using React Native, SQLite, And Expo

--- 

## Overview Of Screens

#### Calendar Screen
- Local weather toggle menu using OpenWeatherAPI.
- Clickable days on calendar to record time exercised.

### Options Screen
- Option to clear all data from database.
- Option to add test data to database.

#### Statistics Screen
- Line graph for recorded times.
- Horizontal scroll to view whole month.

## Features To Add
- Timer for recording and adding exercise duration for the current day.
- Allow user to set location weather forcast is gathered from (defaults to local area).
- Change background of today modal to match the weather forcast.
- Update styles for screens.
- Option to change degrees from F to C.
- Option to import and export SQLite database.

---

## Screenshots

<p float="left">
  <img src="https://github.com/kinern/jtrack-expo/blob/master/images/calendar_screen.png?raw=true"  height="400" alt="calendar screen"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/kinern/jtrack-expo/blob/master/images/calendar_screen_toggle.png?raw=true" height="400" alt="calendar screen"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/kinern/jtrack-expo/blob/master/images/options_screen.png?raw=true" height="400" alt="calendar screen"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/kinern/jtrack-expo/blob/master/images/stats_screen.png?raw=true" height="400" alt="calendar screen"/>
</p>

## How to use

- Use command "yarn" or "npm install" to setup.
- Use command "expo start" to run expo on your browser.
- In order to use on a physical device, you will need to download the expo app. Use "Scan QR Code" to load the application. 
- If there are problems loading Jtrack on the expo app then you may need to switch from LAN to Tunnel setting.
- You will need an emulator already installed on your computer in order to test on android or ios emulator or physical device.
- Currently this app has been tested in the browser and on an android physical device.

