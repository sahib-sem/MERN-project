import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  const user_id = req.user.id;

  if (user_id !== req.params.id) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    next(error);
    return;
  }

  try {
    if (req.body.password) {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 12);
      req.body.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );


    

    const updated_user = user._doc;
    
    if (updated_user.password){
        updated_user.password = undefined;
    }

    console.log(user);
    res.status(200).json({
      success: true,
      user: updated_user,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {

  const user_id = req.user.id;

  if (user_id !== req.params.id) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    next(error);
    return;
  }

  try {
    const user = await User.findByIdAndDelete(user_id);

    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    next(err);
  }


}