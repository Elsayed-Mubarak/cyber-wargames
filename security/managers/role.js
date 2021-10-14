module.exports = {
    isRoleAllowed (req, allowedRoles) {
      const allowed = allowedRoles.find(e => e === req.userData.role);
      return !!(allowed);
    }
  };