import { supabaseAdmin } from './supabaseAdmin.js';

// Courses
export async function getCourses() {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCourseById(id) {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourse(courseData) {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert(courseData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourse(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id) {
  const { error } = await supabaseAdmin
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Lessons
export async function getLessonsByCourseId(courseId) {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getLessonById(id) {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLesson(lessonData) {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .insert(lessonData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLesson(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLesson(id) {
  const { error } = await supabaseAdmin
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Profiles
export async function getProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}