function isYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
}

function isHStudioPlayUrl(url) {
    const pattern = /^(https?:\/\/)?(play\.hstudio\.hewkawar\.xyz)\/.+$/;
    return pattern.test(url);
}

module.exports = {
    isYouTubeUrl,
    isHStudioPlayUrl
}