const withSvgr = require('next-svgr')

module.exports = withSvgr({
  async redirects () {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: false
      }
    ]
  }
})
