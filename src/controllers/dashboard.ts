import { Request, Response } from "express";
import { Types } from "mongoose";

import { Blog } from "../models/Blog";

/**
 * @description    Show Dashbord
 * @pages          pages/admin/dashboard
 * @layout         dashboard
 */
declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
      fullName: string;
      email: string;
      password: string;
      createDate: DateConstructor | number;
    }
  }
}
export const dashboardController = (_: Request, res: Response) => {
  res.render("pages/admin/dashboard", {
    pageTitle: "Dashboard",
    message: "Dashboard",
    layout: "dashboard",
    userFullName: _.user!.fullName,
  });
};

/**
 * @description    Show New Post
 * @pages          pages/admin/addPost
 * @layout         dashboard
 */
export const newPost = (_: Request, res: Response) => {
  res.render("pages/admin/addPost", {
    pageTitle: "NewPost",
    layout: "dashboard",
    userFullName: _.user!.fullName,
    path: "/newpost",
  });
};

/**
 * @description    Handle New Post
 */
export const handleNewPost = async (_: Request, res: Response) => {
  try {
    await Blog.create({ ..._.body, userId: _.user!.id });
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description    Show Blogs
 */
export const blogs = async (_: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ userId: _.user!.id });

    res.render("pages/admin/blogs", {
      pageTitle: "Blogs",
      layout: "layout",
      userFullName: _.user!.fullName,
      blogs,
    });
  } catch (err) {
    console.log(err);
  }
};
