import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - LMS Platform</title>
        <meta name="description" content="Learn more about LMS Platform and our mission to make coding education accessible to everyone." />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>About Us</h1>
            <p className={styles.heroSubtitle}>
              Our mission is to provide high-quality, accessible, and affordable coding education to empower individuals to build their future.
            </p>
          </div>
        </section>

        <section className={styles.features}>
          <h2>Our Story</h2>
          <p>
            Founded in 2026, LMS Platform started as a small project to create a better way for people to learn to code. We believe in learning by doing, which is why our platform is built around interactive coding exercises and real-world projects.
          </p>
          <p>
            Today, we are a global community of learners, instructors, and developers dedicated to building the future of online education.
          </p>
        </section>
      </main>
    </>
  );
}
