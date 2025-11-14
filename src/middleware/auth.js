module.exports = function fakeAuth(req, res, next) {
  const userId = req.header("x-user-id");
  const userEmail = req.header("x-user-email");
  const userName = req.header("x-user-name");

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = {
    uid: userId,
    email: userEmail || "",
    name: userName || ""
  };

  next();
};
