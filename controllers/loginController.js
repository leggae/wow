const _ = require('lodash')
const googleUtils = require('../src/google-util')
const loginPage = async function (req, res) {
    const googleURL = googleUtils.urlGoogle() || 'a'
    const renderData = {}
    res.render('Html', { data: { renderData, googleURL, page: 'login' } });
}
const storeAuthKey = async function (req, res) {
    const code = req.query.code
    req.session = Object.assign (req.session, await googleUtils.getGoogleAccountFromCode(code))
    res.redirect('/')
}
module.exports = {
    loginPage,
    storeAuthKey
}