module.exports = function fakeAuth(req, res, next) {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = {
    uid: userId,
    email: req.header("x-user-email") || "",
    name: req.header("x-user-name") || "",   // <-- ADD THIS
  };

  next();
};
