// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')({
                            browsers: ['ie>=8','>1% in CN', 'Firefox < 20' ]//['ie>=8','>1% in CN']
                        })
    ]
}