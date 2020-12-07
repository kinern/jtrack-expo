# jtrack-expo
An Exercise Tracking App Using React Native, SQLite, And Expo

--- 

## Overview Of Screens

#### Calendar Screen
- Local weather toggle menu using OpenWeatherAPI.
- Clickable days on calendar to record time exercised.

#### Options Screen
- Option to clear all data from database.
- Option to add test data to database.

#### Statistics Screen
- Line graph for recorded times.
- Horizontal scroll to view whole month.

## Changes To Make
- Move daily time to main calendar screen.
- Add a timer button to record exercise time.
- Add 6 month graph to stats page.
- Add average per day to stats page.
- Add daily goal setting.
- Change today button to just weather and add icon image to button.

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

Note: Requires an OpenWeatherMapAPI key to gather local weather data.
- Use command "yarn" or "npm install" to setup.
- Create a new file called api.js outside of the app folder.
- Add "export const weather_api_key = *api key*;" to the api.js folder and save.
- Use command "expo start" to run expo on your browser.

Notes for Expo:
- In order to use on a physical device, you will need to download the expo app. Use "Scan QR Code" to load the application. 
- If there are problems loading Jtrack on the expo app then you may need to switch from LAN to Tunnel setting.
- You will need an emulator already installed on your computer in order to test on android or ios emulator or physical device.
- Currently this app has been tested in the browser and on an android physical device.

