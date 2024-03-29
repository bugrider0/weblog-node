import { Request, Response } from "express";

import { User } from "../models/User";

/**
 * @description    Signup/Register Page
 * @pages          pages/signup
 * @layout         loginSignup
 */
export const signupController = (_: Request, res: Response) => {
  res.render("pages/signup", {
    pageTitle: "Signup",
    layout: "loginSignup",
    errors: [],
  });
};

/**
 * @description    Authenticate Users And Add to DB
 * @pages          pages/signup
 * @layout         loginSignup
 * @module         UserSchema
 */
export const handleSignup = async (_: Request, res: Response) => {
  // Errors
  const errors = [];

  try {
    await User.userValidation(_.body);

    /**
     * Handle Duplicate Email Error
     */
    const { email } = _.body;
    const duplicateUserByEmail = await User.findOne({ email });
    if (duplicateUserByEmail) {
      errors.push({
        name: "email",
        message: "این ایمیل قبلا ثبت شده",
      });
      return res.render("pages/signup", {
        pageTitle: "Signup",
        layout: "loginSignup",
        errors,
      });
    }
    /**
     * Create a New User on Database
     */
    await User.create(_.body);

    /**
     * flash
     */
    _.flash("successMessage", "خووووووش اومدی.");

    /**
     * if Form Valid - Redirect to Login Page
     */
    res.redirect("/users/login");
  } catch (err: any) {
    /**
     * Push Errors to a Array and then Show it's
     * Errors Controller
     */
    if (err.inner !== undefined) {
      err.inner.map((e: any) => {
        errors.push({
          name: e.path,
          message: e.message,
        });
      });
    }
    /**
     * ReRender Register Page for Show Errors
     */
    res.render("pages/signup", {
      pageTitle: "Signup",
      layout: "loginSignup",
      errors,
    });
  }
};
