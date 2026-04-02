const courses = [
  {
    id: "frontend",
    title: "Frontend Temelleri",
    lessons: ["HTML Giriş", "CSS Düzen", "JavaScript Başlangıç"]
  },
  {
    id: "backend",
    title: "Backend Temelleri",
    lessons: ["HTTP & API", "Node.js", "Veritabanı Mantığı"]
  },
  {
    id: "ai",
    title: "Yapay Zeka 101",
    lessons: ["ML Kavramları", "Model Eğitimi", "Prompt Tasarımı"]
  }
];

const state = {
  activeCourseId: null,
  completedLessons: JSON.parse(localStorage.getItem("dtLmsCompleted") || "{}")
};

const courseList = document.getElementById("courseList");
const lessonList = document.getElementById("lessonList");
const courseTitle = document.getElementById("courseTitle");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resetBtn = document.getElementById("resetBtn");

function persist() {
  localStorage.setItem("dtLmsCompleted", JSON.stringify(state.completedLessons));
}

function getCompletedSet(courseId) {
  if (!state.completedLessons[courseId]) {
    state.completedLessons[courseId] = [];
  }
  return new Set(state.completedLessons[courseId]);
}

function updateProgress(course) {
  const completed = getCompletedSet(course.id);
  const percent = Math.round((completed.size / course.lessons.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `%${percent} tamamlandı`;
}

function renderLessons(course) {
  const completed = getCompletedSet(course.id);
  lessonList.innerHTML = "";

  course.lessons.forEach((lesson, index) => {
    const item = document.createElement("button");
    item.className = "lesson-item";
    item.type = "button";
    item.innerHTML = `<span>${index + 1}. ${lesson}</span><span>${completed.has(lesson) ? "✅" : "⬜"}</span>`;
    item.addEventListener("click", () => {
      const fresh = getCompletedSet(course.id);
      if (fresh.has(lesson)) {
        fresh.delete(lesson);
      } else {
        fresh.add(lesson);
      }
      state.completedLessons[course.id] = Array.from(fresh);
      persist();
      renderLessons(course);
      updateProgress(course);
    });
    lessonList.appendChild(item);
  });

  updateProgress(course);
}

function setActiveCourse(courseId) {
  state.activeCourseId = courseId;
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;

  courseTitle.textContent = course.title;
  renderLessons(course);

  document.querySelectorAll(".course-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.courseId === courseId);
  });
}

function renderCourses() {
  courseList.innerHTML = "";
  courses.forEach((course) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "course-btn";
    btn.textContent = course.title;
    btn.dataset.courseId = course.id;
    btn.addEventListener("click", () => setActiveCourse(course.id));
    courseList.appendChild(btn);
  });
}

resetBtn.addEventListener("click", () => {
  if (!state.activeCourseId) return;
  state.completedLessons[state.activeCourseId] = [];
  persist();
  setActiveCourse(state.activeCourseId);
});

renderCourses();
setActiveCourse(courses[0].id);
