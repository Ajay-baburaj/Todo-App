import Task from '../model/taskSchema.js'
import Count from '../model/countSchema.js'
import { generateToken } from '../helpers/jwtHelper.js'
const maxAge = 24 * 60 * 60;

export const loginGet = (req, res) => {
    res.render('login')
}

export const loginPost = (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (email === process.env.email && password === process.env.password) {
            const token = generateToken({ email: email }, process.env.secret, "15m")
            const refreshToken = generateToken({ email: email }, process.env.refresh_secret, "2d")
            res.cookie("refreshToken", refreshToken, { httpOnly: true, maxage: maxAge * 1000, withCredentials: true })
            res.cookie("accessToken", token, { httpOnly: true, maxage: maxAge * 1000, withCredentials: true })
            res.status(201).json({ status: true, msg: "log in successfull", user: process.env.email, accessToken: token })
        } else {
            if (email != process.env.email) {
                res.status(401).json({ status: false, emailError: true, msg: "Incorrect email" })
            }
            if (password != process.env.password) {
                res.status(401).json({ status: false, passwordError: true, msg: "Incorrect password" })
            }
        }

    } catch (err) {
        next(err)
    }

}

export const home = async (req, res, next) => {
    try {
      const [pendingData, completedData, cancelledData, deletedCount] = await Promise.all([
        Task.find({ status: "pending" }).sort({ priority: -1 }),
        Task.find({ status: "completed" }).sort({ priority: -1 }),
        Task.find({ status: "cancelled" }).sort({ priority: -1 }),
        Count.find({})
      ]);
  
      res.render("home", { pendingData, completedData, cancelledData, deletedCount: deletedCount[0].count })
  
    } catch (err) {
        if (err.name === "MongoError") {
            next(new Error("A database error occurred"));
          } else {
            next(err);
          }
        }
    }
  

    export const addTask = (req, res, next) => {
        const { task, priority } = req.body;
        Task.create({
          task,
          priority: parseInt(priority),
        })
          .then(() => {
            res.status(201).json({ status: true });
          })
          .catch((err) => {
            next(err);
          });
      };
      

export const cancelTask = async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { status: 'cancelled' }).then((response) => {
            res.status(201).json({ status: true })
        }).catch((err) => {
            next(err)
        })
    } catch (err) {
        next(err)
    }

}

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id).then((response) => {
        Count.updateOne({ name: "deleteCount" }, { $inc: { count: 1 } }, { upsert: true })
            .then(() => {
                res.status(201).json({ status: true })
            }).catch((err) => {
                next(err)
            });

    }).catch((err) => {
        next(err)
    })
}

export const completeTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { status: 'completed' }).then((response) => {
        res.status(201).json({ status: true })
    }).catch((err) => {
        next(err)
    })
}

export const logout = (req, res) => {
    res.clearCookie('accessToken')
    res.status(201).json({ status: true })
}    
