const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])

const got = require('got')

export default async (req, res) => {
  try {
    const { body: html, url } = await got(req.body.url)
    const metadata = await metascraper({ html, url })
    return res.status(200).json(metadata) 
  } catch (e) {
    console.log(e);
    return res.status(500).json({})
  }
}
