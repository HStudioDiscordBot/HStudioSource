const { generateDependencyReport }= require('@discordjs/voice')
const config = require('../config.json')

module.exports = (client) => {
    if (config.setting.generateDependencyReport) {
        console.log(generateDependencyReport());
    }
}