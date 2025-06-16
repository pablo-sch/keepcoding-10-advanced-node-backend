export function changeLocale(req, res, next) {
  const locale = req.params.locale;

  // set a cookie to the response
  res.cookie("nodepop-locale", locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  // redirect to the same page
  res.redirect("back");
}
