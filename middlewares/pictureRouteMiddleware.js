const skipWhenApplicationType = (middleware) => {
  return (req, res, next) => {
    if (req.body.type === "application") return next();
    return middleware(req, res, next);
  };
};

module.exports = skipWhenApplicationType;
