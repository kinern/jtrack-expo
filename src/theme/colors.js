const weatherColors = {
    clearBlue: '#81bce3',
    cloudBlue : '#d5e5eb',
    fogYellow: '#faf2d4',
    rainBlue: '#6092b5',
    snowPurple : '#d4c5f0'

}

const colors = {
    highlight: 'white',
    dark: '#1b1140',
    medium: '#7c57b3',
    light: '#ddc2ed',
    contrastDark: '#7a5f3e',
    contrastMedium: '#cfc6a9',
    contrastLight: '#f5f1d7',
    inactiveLight: 'lightgray',
    inactiveDark: 'gray',
    weather: {
        'Thunderstorm': weatherColors.fogYellow,
        'Drizzle': weatherColors.rainBlue,
        'Rain': weatherColors.rainBlue,
        'Snow': weatherColors.snowPurple,
        'Mist': weatherColors.cloudBlue,
        'Smoke': weatherColors.fogYellow,
        'Haze': weatherColors.cloudBlue,
        'Dust': weatherColors.fogYellow,
        'Fog': weatherColors.fogYellow,
        'Sand': weatherColors.fogYellow,
        'Ash': weatherColors.cloudBlue,
        'Squall': weatherColors.fogYellow,
        'Tornado': weatherColors.fogYellow,
        'Clear': weatherColors.clearBlue,
        'Clouds': weatherColors.cloudBlue
    }
};

export default colors;