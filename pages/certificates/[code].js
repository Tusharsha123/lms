import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import styles from "../../styles/CertificateView.module.css";

export default function CertificateView() {
  const router = useRouter();
  const { code } = router.query;
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificate = useCallback(async () => {
    // Only fetch if code exists
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/certificates/${code}`);

      if (!res.ok) {
        throw new Error("Certificate not found");
      }

      const data = await res.json();
      setCertificate(data);
    } catch (err) {
      console.error("Failed to fetch certificate:", err);
      setError(err.message || "Failed to load certificate");
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loading />;

  if (error || !certificate) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h1>Certificate Not Found</h1>
            <p>{error || "The certificate could not be found."}</p>
            <Link href="/">Go Home</Link>
          </div>
        </main>
      </>
    );
  }

  // Safety check for nested data to prevent crashes
  const userName = certificate.user?.name || "Student";
  const courseTitle = certificate.course?.title || "Course";
  const instructorName = certificate.course?.instructor?.name || "Instructor";

  return (
    <>
      <Head>
        <title key="title">Certificate - {courseTitle} | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.certificate}>
          <div className={styles.header}>
            <span className={styles.label}>CERTIFICATE OF COMPLETION</span>
          </div>

          <h1 className={styles.title}>Certificate</h1>

          <p className={styles.subtitle}>This is to certify that</p>
          <h2 className={styles.name}>{userName}</h2>

          <p className={styles.subtitle}>
            has successfully completed the course
          </p>
          <h3 className={styles.courseName}>"{courseTitle}"</h3>

          <p className={styles.date}>
            Completed on {formatDate(certificate.issuedAt)}
          </p>

          <div className={styles.signature}>
            <div className={styles.signatureLine}></div>
            <p>{instructorName}</p>
            <span>Course Instructor</span>
          </div>

          <p className={styles.code}>
            Certificate ID: {certificate.uniqueCode}
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/api/certificates/${code}?format=html`}
            target="_blank"
            className={styles.downloadBtn}
          >
            Download / Print
          </Link>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              } else {
                alert("Could not copy link");
              }
            }}
            className={styles.shareBtn}
          >
            Copy Link
          </button>
        </div>
      </main>
    </>
  );
}
