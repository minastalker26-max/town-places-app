function ensureAuthenticated(req, res, next) {
  if (req.session.userId || req.isAuthenticated?.()) return next();
  return res.redirect("/login");
}

function ensureAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  return res.redirect("/admin/login");
}

module.exports = { ensureAuthenticated, ensureAdmin };
