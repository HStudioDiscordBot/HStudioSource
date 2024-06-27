function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    isValidURL
}