export function isAdmin(req, res, next) {
  if (req.user.tipo !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Acesso negado: apenas admin",
    });
  }

  next();
}
