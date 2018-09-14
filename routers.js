const loginController = require('./controllers/loginController')
const homeController = require('./controllers/homeController')
const policyController = require('./controllers/policyController')
const auth = require('./auth')
const googleRedirectPath = process.env.AUTH_REDIRECT
module.exports = function(app) {

	app.get('/fakeLogin', function(req, res){
		req.session = { email : 'n.k@appman.co.th' }
		res.redirect('/')
	})

	app.get('/logout', function(req, res){
		req.session = null
		res.redirect('/')
	})

	app.get('/login', async function(req, res){
		loginController.loginPage(req, res)
	})

	app.get(googleRedirectPath, async function(req, res){
		console.log('back from google', req.query.code)
		loginController.storeAuthKey(req, res)
	})

	app.get('/', auth.isAuthorized, async function(req, res) {
		homeController(req, res)
	});

	app.get('/quickReport', auth.isAuthorized, async function(req, res) {
		let date = new Date();
		date.setDate(date.getDate() - 1);
		const isoDateString = date.toISOString().slice(0,date.toISOString().indexOf('T'))
		req.query.startDate = isoDateString
		req.query.endDate  = isoDateString
		req.query.isExport = 'true'
		console.log(req.query)
		homeController(req, res)
	});

	app.get('/detail/:policy_no', auth.isAuthorized, async function(req, res) {
		policyController.getPolicyDetail(req, res)
	});

	app.get('/file/:bucket/:id/:filename', auth.isAuthorized, async function(req, res) {
		policyController.getPolicyAttachFile(req, res)
	});
}