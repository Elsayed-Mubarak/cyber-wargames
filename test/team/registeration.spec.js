const app = require('../../app')
const config = require('../../config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Student = require('../../components/student/student.model')
const { expect } = require('chai')

test('POST: /api/team/signup.json', async () => {
  const addNewStudent = await Student.create({
    name: 'abdo',
    militaryId: '566657887624543',
    password: '@Isec2020',
    squadNumber: 71,
  })
  await supertest(app)
    .post('/api/team.signup.json')
    .expect(200)
    .then((res) => {
      expect(res.body.token).toEqual(
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjcwMzA5OTkxNCwiZXhwIjoxNjU4OTEzOTE1MDAwMDAwLCJpYXQiOjE2MjczNzc5MTUwMDAwMDAsIl9pZCI6IjYwZmZkMGZiMGNhM2QyMmVhNGQ5ZTcwNyIsInJvbGUiOiJ1c2VyIiwidV9pZCI6Ijg1MDk4NzM2NDg3MTIzNiJ9.aB49nCMcO6kp0wOVKUDzsDgxgDt2-YFLjWbgtitGzFBd9UVN1gLP3pLW58lQ_wysrgKB8tUSnSviz9-Itr9ioVgXWON4gRYlBtqGd6Ltkx114TEBPge8OONDRW0KH9T-Ai-u2vOmBuP_hv5Rk1OHsmJ9zSkJUMZ1FpX4zs8FnDgzTQr_uZ5zCeMU3jieX6SdT-68zTqHbNmQl5UnqmDKEZdEj-mbKFT29kYT7zsPSmSA41Z3JDMT1avxdFl_aMV6KxT3PwYKoQ3eeQtd5LLr7G13Np62B6AYlk_RhAgMsOlNZAP9fy4GROXbBDzJ9-IoYaQM31nGSmidP-h3IF6lgw',
      )
    })
})
