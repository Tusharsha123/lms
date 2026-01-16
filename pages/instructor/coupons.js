import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import styles from "../../styles/Coupons.module.css";

export default function Coupons() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 10,
    maxUses: "",
    expiresAt: "",
    courseId: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchCourses();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/instructor/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({
          code: "",
          discountPercent: 10,
          maxUses: "",
          expiresAt: "",
          courseId: "",
        });
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to create coupon");
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++)
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({ ...formData, code });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Coupons | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Coupon Codes</h1>
          <Button onClick={() => setShowModal(true)}>+ Create Coupon</Button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Course</th>
              <th>Uses</th>
              <th>Expires</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <code>{coupon.code}</code>
                </td>
                <td>{coupon.discountPercent}%</td>
                <td>{coupon.course?.title || "All courses"}</td>
                <td>
                  {coupon.usedCount}
                  {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                </td>
                <td>
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString()
                    : "Never"}
                </td>
                <td
                  className={coupon.isActive ? styles.active : styles.inactive}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6}>No coupons created yet</td>
              </tr>
            )}
          </tbody>
        </table>

        {showModal && (
          <Modal onClose={() => setShowModal(false)} title="Create Coupon">
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.codeInput}>
                <Input
                  label="Coupon Code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generateCode}
                >
                  Generate
                </Button>
              </div>
              <Input
                label="Discount Percent"
                type="number"
                min={1}
                max={100}
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercent: parseInt(e.target.value),
                  })
                }
                required
              />
              <Input
                label="Max Uses (leave empty for unlimited)"
                type="number"
                min={1}
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData({ ...formData, maxUses: e.target.value })
                }
              />
              <Input
                label="Expires At (optional)"
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
              />
              <div className={styles.field}>
                <label>Apply to Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                >
                  <option value="">All my courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Create Coupon</Button>
            </form>
          </Modal>
        )}
      </main>
    </>
  );
}
