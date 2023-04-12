function appendHeader(req, res, next) {
    const token = req.cookies.accessToken
    req.headers['Authorization'] = `Bearer ${token}`;
  
    next();
  }
  
export default appendHeader;  