import prisma from "../prismaClient.js";
import { getCoursesSchema, courseIdSchema, createCourseSchema, updateCourseSchema } from "../validator/course.js";

export const getCourses = async (req, res) => {
  const result = getCoursesSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const { page = 1, limit = 10 } = result.data;
  
  try {
    const courses = await prisma.course.findMany({
      skip: (page - 1) * limit,
      take: limit
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  const result = courseIdSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course", error: err.message });
  }
};

export const createCourse = async (req, res) => {
  const result = createCourseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  try {
    const course = await prisma.course.create({
      data: result.data
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  const idResult = courseIdSchema.safeParse({ id: req.params.id });
  const bodyResult = updateCourseSchema.safeParse(req.body);
  
  if (!idResult.success) {
    return res.status(400).json({ errors: idResult.error.errors });
  }
  if (!bodyResult.success) {
    return res.status(400).json({ errors: bodyResult.error.errors });
  }
  
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: bodyResult.data
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course", error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  const result = courseIdSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course", error: err.message });
  }
};

export const assignCourse = async (req, res) => {
  if (!req.body || !req.body.userId || !req.body.courseId) {
    return res.status(400).json({ 
      message: "userId and courseId are required" 
    });
  }
  
  const { userId, courseId } = req.body;
  
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId)
      },
      include: {
        user: { select: { email: true, role: true } },
        course: { select: { title: true } }
      }
    });
    
    // E003 - Course Assigned Event
    console.log(`[E003] Course Assigned - User: ${enrollment.user.email}, Course: ${enrollment.course.title}, Time: ${new Date().toISOString()}`);
    
    res.json({
      message: "Course assigned successfully",
      enrollment
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign course", error: err.message });
  }
};