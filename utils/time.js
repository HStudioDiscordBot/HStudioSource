function msToSec(milliseconds) {
    return Math.ceil(milliseconds / 1000);
}

function convertToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsFinal = remainingSeconds % 60;

    if (hours > 0) {
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSecondsFinal).padStart(2, '0')}`;
        return formattedTime;
    } else {
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecondsFinal).padStart(2, '0')}`;
        return formattedTime;
    }
}

module.exports = {
    msToSec,
    convertToHHMMSS,
}