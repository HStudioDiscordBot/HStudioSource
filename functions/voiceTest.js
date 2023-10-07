const { generateDependencyReport }= require('@discordjs/voice')

module.exports = (client) => {
    console.log(generateDependencyReport());
}