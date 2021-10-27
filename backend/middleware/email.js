// Regex pour email
module.exports = (req, res, next) => {
    const verifEmail = (email) => {
        let regexEmail =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
        let isRegexTrue = regexEmail.test(email)
        isRegexTrue ? next() : res.status(400).json({ message: 'Merci de choisir une adresse mail valide !' });
    }
    verifEmail(req.body.email)
  };