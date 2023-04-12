

const verifylogin = (req, res, next) => {
    if (req.cookies.accessToken) {
        res.redirect("/")
    } else {
        next()
    }
}

export default verifylogin