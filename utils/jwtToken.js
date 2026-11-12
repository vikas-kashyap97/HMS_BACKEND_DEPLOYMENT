const DAY_MS = 24 * 60 * 60 * 1000;

export const authCookieOptions = () => {
  const isProduction = process.env.NODE_ENV !== "development";
  return {
    httpOnly: true,
    // Cross-site cookies (front-ends on other domains) require Secure + None.
    // In local development over plain http fall back to Lax.
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };
};

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  const days = Number(process.env.COOKIE_EXPIRE) || 7;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      ...authCookieOptions(),
      expires: new Date(Date.now() + days * DAY_MS),
    })
    // The token is only delivered via the httpOnly cookie; returning it in the
    // body would expose it to any XSS on the front-end. The user object is
    // serialized through the schema's toJSON, which strips the password hash.
    .json({
      success: true,
      message,
      user,
    });
};

export const clearToken = (res, cookieName, message) =>
  res
    .status(200)
    .clearCookie(cookieName, authCookieOptions())
    .json({ success: true, message });
