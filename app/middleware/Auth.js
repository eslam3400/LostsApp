let auth = (req, res, callBack) => {
  console.log(req.session)
  if (req.session.user == undefined || req.session.user == null) res.redirect('/login')
  else callBack()
}

module.exports = { auth }