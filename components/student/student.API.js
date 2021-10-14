const express = require('express')
const Security = require('../../security')
const catchAsync = require('../../utils/catchAsync')
const router = express.Router({ caseSensitive: false })

const {
  signup,
  login,
  updatePassword,
  viewProfile,
  updateName,
  dashboard,
  generateCredentials,
  logout,
  createAdmin,
  getAllAdmins,
  deleteStudent,
  addFieldName,
  getfieldsName,
  addSquadNumber,
  deleteAdmin,
  getStudentsBySquadNumber,
  deleteSquad,
  getSquadNumbers,
  updateStudent,
  resetPassword,
} = require('./controllers')

router.post('/signup.json', catchAsync(signup))
router.post('/login.json', catchAsync(login))
router.patch("/update-password", Security.auth(["user", "admin", "superadmin"]), catchAsync(updatePassword));
router.patch('/name', Security.auth(['user', 'admin', 'superadmin']), catchAsync(updateName));

router.get(
  '/profile',
  Security.auth(['user', 'admin', 'superadmin']),
  catchAsync(viewProfile),
);

router.get(
  '/profile/:id',
  Security.auth(['user', 'admin', 'superadmin']),
  catchAsync(viewProfile),
);

router.get(
  '/dashboard',
  Security.auth(['user', 'admin', 'superadmin']),
  catchAsync(dashboard),
);

router.post('/logout', catchAsync(logout));
router.get('/generate-credentials.json', catchAsync(generateCredentials));

router.get(
  '/squads',
  catchAsync(getSquadNumbers),
)

router.post('/admin', Security.auth(['superadmin']), catchAsync(createAdmin));
router.get('/admin', Security.auth(['admin', 'superadmin']), catchAsync(getAllAdmins));


router.post(
  '/admin/squad-number',
  Security.auth(['superadmin', 'admin']),
  catchAsync(addSquadNumber),
)
router.post(
  '/admin/field',
  Security.auth(['superadmin', 'admin']),
  addFieldName,
)
router.get(
  '/admin/field',
  getfieldsName,
)
router.delete(
  '/:studentId',
  Security.auth(['admin', 'superadmin']),
  catchAsync(deleteStudent),
)

router.delete(
  '/admin/:adminId',
  Security.auth(['superadmin']),
  catchAsync(deleteAdmin),
)

router.post('/squad', Security.auth(['superadmin']), catchAsync(deleteSquad))

router.post('/squad-students', Security.auth(['superadmin', 'admin', 'user']), catchAsync(getStudentsBySquadNumber))


router.put('/:studentId', Security.auth(['admin', 'superadmin']), catchAsync(updateStudent));
router.post(
  '/change-password/:studentId',
  Security.auth(['admin', 'superadmin']),
  catchAsync(resetPassword),
)

module.exports = router
