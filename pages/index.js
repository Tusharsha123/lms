import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Card from "../components/Card";
import RatingStars from "../components/RatingStars";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    instructors: 0,
  });

  useEffect(() => {
    // Redirect unauthenticated users to landing page
    if (!session) {
      router.push("/landing");
      return;
    }
    fetchFeaturedCourses();
  }, [session, router]);

  const fetchFeaturedCourses = async () => {
    try {
      const res = await fetch("/api/courses?limit=6");
      const data = await res.json();
      setFeaturedCourses(data.courses || data || []);
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const features = [
    {
      icon: "🎯",
      title: "Interactive Coding",
      description:
        "Practice with our built-in code editor supporting 10+ languages",
    },
    {
      icon: "📜",
      title: "Certificates",
      description:
        "Earn certificates upon course completion to showcase your skills",
    },
    {
      icon: "💬",
      title: "Community",
      description:
        "Engage with instructors and peers through discussion forums",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Track your learning journey with detailed progress analytics",
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "Unlock badges and achievements as you learn",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description: "Safe and secure payment processing with Stripe",
    },
  ];

  const categories = [
    { name: "Web Development", icon: "🌐", count: 0 },
    { name: "Mobile Development", icon: "📱", count: 0 },
    { name: "Data Science", icon: "📊", count: 0 },
    { name: "DevOps", icon: "⚙️", count: 0 },
    { name: "Design", icon: "🎨", count: 0 },
    { name: "Business", icon: "💼", count: 0 },
  ];

  return (
    <>
      <Head>
        <title>LMS Platform - Learn to Code Online</title>
        <meta
          name="description"
          content="Master coding with interactive courses, hands-on projects, and expert instructors."
        />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              Master Coding with
              <br />
              <span className={styles.highlight}>Interactive Learning</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Learn from expert instructors with hands-on coding exercises,
              real-world projects, and a supportive community.
            </p>
            <div className={styles.heroCta}>
              <Link href="/courses" className={styles.primaryBtn}>
                Browse Courses
              </Link>
              {!session && (
                <Link href="/auth/signup" className={styles.secondaryBtn}>
                  Get Started Free
                </Link>
              )}
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Courses</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Languages</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.codePreview}>
              <div className={styles.codeHeader}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <pre className={styles.code}>
                {`function learnToCode() {
  const skills = [];
  
  while (learning) {
    skills.push(newSkill);
    confidence++;
  }
  
  return success;
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2>Why Choose Our Platform?</h2>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section className={styles.courses}>
          <div className={styles.sectionHeader}>
            <h2>Featured Courses</h2>
            <Link href="/courses" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.courseGrid}>
            {featuredCourses.slice(0, 6).map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <Card className={styles.courseCard}>
                  <div className={styles.courseThumbnail}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} />
                    ) : (
                      <div className={styles.placeholderThumb}>📚</div>
                    )}
                    <span className={styles.courseLevel}>{course.level}</span>
                  </div>
                  <div className={styles.courseContent}>
                    <h3>{course.title}</h3>
                    <p className={styles.courseInstructor}>
                      {course.instructor?.name || "Instructor"}
                    </p>
                    <div className={styles.courseMeta}>
                      <RatingStars rating={4.5} size="small" />
                      <span className={styles.coursePrice}>
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className={styles.categories}>
          <h2>Browse by Category</h2>
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Link
                href={`/courses?category=${category.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
                key={index}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already learning on our platform.</p>
            <div className={styles.ctaButtons}>
              {session ? (
                <Link href="/courses" className={styles.primaryBtn}>
                  Browse Courses
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup" className={styles.primaryBtn}>
                    Sign Up Free
                  </Link>
                  <Link href="/courses" className={styles.secondaryBtn}>
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Become Instructor */}
        <section className={styles.instructor}>
          <div className={styles.instructorContent}>
            <h2>Share Your Knowledge</h2>
            <p>
              Become an instructor and teach millions of students worldwide.
            </p>
            <ul className={styles.instructorBenefits}>
              <li>💰 Earn money from your courses</li>
              <li>🌍 Reach students globally</li>
              <li>📊 Track your earnings and analytics</li>
              <li>🎯 Build your personal brand</li>
            </ul>
            <Link href="/auth/signup" className={styles.instructorBtn}>
              Start Teaching Today
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>📚 LMS Platform</h4>
            <p>Learn coding with interactive courses and hands-on practice.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link href="/courses">All Courses</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Support</h4>
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 LMS Platform. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
