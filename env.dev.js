const pkg = require('./package.json')
const fs = require('fs')

fs.writeFileSync("./client/libs/system.info.js", `window.systemInfo = {
    "version": "${pkg.version}"
};`)

if (!fs.existsSync('./client/userspace')) {
    fs.mkdirSync('./client/userspace')
}