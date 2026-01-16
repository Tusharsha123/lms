import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Button from "../../components/Button";
import Card from "../../components/Card";
import RatingStars from "../../components/RatingStars";
import ReviewCard from "../../components/ReviewCard";
import ReviewForm from "../../components/ReviewForm";
import PriceTag from "../../components/PriceTag";
import WishlistButton from "../../components/WishlistButton";
import ProgressBar from "../../components/ProgressBar";
import Loading from "../../components/Loading";
import styles from "../../styles/CourseDetail.module.css";

export default function CourseDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id, success, enrolled } = router.query;

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (id && session) {
      fetchEnrollment();
      fetchProgress();
    }
  }, [id, session]);

  useEffect(() => {
    if (enrolled === "true" || success === "true") {
      fetchEnrollment();
    }
  }, [enrolled, success]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${id}`);
      const data = await res.json();
      setCourse(data);
      setLessons(data.lessons || []);
    } catch (error) {
      console.error("Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?courseId=${id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);

      if (session) {
        const myReview = data.reviews?.find(
          (r) => r.user?.id === session.user.id
        );
        setUserReview(myReview || null);
      }
    } catch (error) {
      console.error("Failed to fetch reviews");
    }
  };

  const fetchEnrollment = async () => {
    try {
      const res = await fetch("/api/enrollments");
      const data = await res.json();
      const userEnrollment = data.find((e) => e.courseId === id);
      setEnrollment(userEnrollment || null);
    } catch (error) {
      console.error("Failed to fetch enrollment");
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/progress?courseId=${id}`);
      const data = await res.json();
      setProgress(data);
    } catch (error) {
      console.error("Failed to fetch progress");
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/courses/${id}`);
      return;
    }

    if (course.price > 0) {
      router.push(`/checkout/${id}`);
      return;
    }

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });

      if (res.ok) {
        fetchEnrollment();
      }
    } catch (error) {
      console.error("Failed to enroll");
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id, rating, comment }),
      });

      if (res.ok) {
        setShowReviewForm(false);
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Delete this review?")) return;

    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review");
    }
  };

  if (loading) return <Loading />;

  if (!course) {
    return (
      <main className={styles.main}>
        <p>Course not found</p>
      </main>
    );
  }

  const isInstructor = session?.user?.id === course.instructorId;

  return (
    <>
      <Head>
        <title>{course.title} | LMS Platform</title>
        <meta name="description" content={course.description} />
      </Head>

      {(enrolled === "true" || success === "true") && (
        <div className={styles.successBanner}>
          🎉 Successfully enrolled! Start learning now.
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/courses">Courses</Link> / {course.category}
            </div>
            <h1>{course.title}</h1>
            <p className={styles.description}>{course.description}</p>

            <div className={styles.meta}>
              <RatingStars
                rating={avgRating}
                showCount
                count={reviews.length}
              />
              <span className={styles.students}>
                {course._count?.enrollments || 0} students
              </span>
              <span className={styles.level}>{course.level}</span>
            </div>

            <div className={styles.instructor}>
              <span>Created by</span>
              <strong>{course.instructor?.name || "Unknown"}</strong>
            </div>

            {course.duration && (
              <div className={styles.duration}>
                <span>📚 {lessons.length} lessons</span>
                <span>⏱️ {course.duration} hours</span>
              </div>
            )}
          </div>

          <div className={styles.heroSidebar}>
            <Card className={styles.enrollCard}>
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className={styles.thumbnail}
                />
              )}

              <div className={styles.enrollContent}>
                <div className={styles.priceRow}>
                  <PriceTag price={course.price} size="large" />
                  {session && !enrollment && !isInstructor && (
                    <WishlistButton courseId={id} />
                  )}
                </div>

                {enrollment ? (
                  <div className={styles.enrolled}>
                    <ProgressBar
                      progress={
                        progress?.percentComplete || enrollment.progress || 0
                      }
                    />
                    <Link
                      href={`/lessons/${lessons[0]?.id}`}
                      className={styles.continueBtn}
                    >
                      {progress?.percentComplete > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </Link>
                  </div>
                ) : isInstructor ? (
                  <Link href={`/courses/${id}/edit`} className={styles.editBtn}>
                    Edit Course
                  </Link>
                ) : (
                  <Button onClick={handleEnroll} className={styles.enrollBtn}>
                    {course.price > 0 ? "Buy Now" : "Enroll for Free"}
                  </Button>
                )}

                <ul className={styles.features}>
                  <li>✓ Full lifetime access</li>
                  <li>✓ Access on mobile and desktop</li>
                  <li>✓ Certificate of completion</li>
                  {course.price > 0 && <li>✓ 30-day money-back guarantee</li>}
                </ul>
              </div>
            </Card>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "lessons" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("lessons")}
          >
            Lessons ({lessons.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "reviews" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
          <Link href={`/courses/${id}/discussions`} className={styles.tab}>
            Discussions
          </Link>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              <h2>About this course</h2>
              <p>{course.description}</p>

              <h3>What you'll learn</h3>
              <ul className={styles.learningPoints}>
                <li>Master the fundamentals and advanced concepts</li>
                <li>Build real-world projects</li>
                <li>Best practices and industry standards</li>
                <li>Hands-on coding exercises</li>
              </ul>
            </div>
          )}

          {activeTab === "lessons" && (
            <div className={styles.lessonList}>
              {lessons.length === 0 ? (
                <p>No lessons yet</p>
              ) : (
                lessons.map((lesson, index) => {
                  const lessonProgress = progress?.progress?.find(
                    (p) => p.lessonId === lesson.id
                  );
                  return (
                    <div key={lesson.id} className={styles.lessonItem}>
                      <div className={styles.lessonNumber}>
                        {lessonProgress?.completed ? "✓" : index + 1}
                      </div>
                      <div className={styles.lessonInfo}>
                        <h4>{lesson.title}</h4>
                        {lesson.duration && <span>{lesson.duration} min</span>}
                      </div>
                      {enrollment && (
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className={styles.startBtn}
                        >
                          {lessonProgress?.completed ? "Review" : "Start"}
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className={styles.reviewsSection}>
              <div className={styles.reviewsHeader}>
                <div className={styles.ratingOverview}>
                  <span className={styles.bigRating}>
                    {avgRating.toFixed(1)}
                  </span>
                  <RatingStars rating={avgRating} size="large" />
                  <span>{reviews.length} reviews</span>
                </div>

                {enrollment && !userReview && (
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </Button>
                )}
              </div>

              {showReviewForm && (
                <div className={styles.reviewFormContainer}>
                  <ReviewForm onSubmit={handleReviewSubmit} />
                </div>
              )}

              <div className={styles.reviewsList}>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwner={review.user?.id === session?.user?.id}
                    onDelete={() => handleDeleteReview(review.id)}
                  />
                ))}
                {reviews.length === 0 && (
                  <p className={styles.noReviews}>
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
