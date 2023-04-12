import express from 'express'
const router = express.Router()
import verify from '../middlewares/verifyUser.js'
import verifylogin from '../middlewares/verifyLogin.js'
import { addTask, cancelTask, completeTask, deleteTask, home, loginGet, loginPost, logout } from '../controller/taskController.js'



router.route('/')
    .get(verify,home)

router.route('/login')
    .get(verifylogin,loginGet)
    .post(loginPost)

router.route('/add/task')
    .post(verify,addTask)

router.route('/complete/task/:id')
    .patch(verify,completeTask )

router.route('/cancel/task/:id')
    .patch(verify,cancelTask)

router.route('/delete/task/:id')
    .delete(verify,deleteTask )


router.route('/logout')
    .get(logout)


export default router


