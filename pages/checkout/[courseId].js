import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Button from '../../components/Button';
import CouponInput from '../../components/CouponInput';
import PriceTag from '../../components/PriceTag';
import Loading from '../../components/Loading';
import styles from '../../styles/Checkout.module.css';

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { courseId, success, canceled } = router.query;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/checkout/${courseId}`);
    }
  }, [status]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (success === 'true') {
      router.push(`/courses/${courseId}?enrolled=true`);
    }
  }, [success]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  const handleCouponApply = (data) => {
    setDiscount(data.discountPercent);
    setCouponCode(data.code);
  };

  const calculatePrice = () => {
    if (!course) return 0;
    if (discount) {
      return course.price * (1 - discount / 100);
    }
    return course.price;
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, couponCode }),
      });

      const data = await res.json();

      if (data.free) {
        router.push(`/courses/${courseId}?enrolled=true`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout failed');
      alert('Checkout failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) return <Loading />;

  if (canceled) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.canceled}>
            <h1>Payment Canceled</h1>
            <p>Your payment was canceled. No charges were made.</p>
            <Button onClick={() => router.push(`/courses/${courseId}`)}>Back to Course</Button>
          </div>
        </main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <p>Course not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - {course.title} | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.courseInfo}>
            <h1>Checkout</h1>
            
            <div className={styles.courseCard}>
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
              )}
              <div className={styles.details}>
                <h2>{course.title}</h2>
                <p className={styles.instructor}>by {course.instructor?.name || 'Instructor'}</p>
                <p className={styles.description}>{course.description?.substring(0, 150)}...</p>
              </div>
            </div>
          </div>

          <div className={styles.paymentInfo}>
            <h2>Order Summary</h2>
            
            <div className={styles.priceBreakdown}>
              <div className={styles.row}>
                <span>Original Price</span>
                <span>${course.price?.toFixed(2)}</span>
              </div>
              
              {discount && (
                <div className={styles.row + ' ' + styles.discount}>
                  <span>Discount ({discount}%)</span>
                  <span>-${(course.price * discount / 100).toFixed(2)}</span>
                </div>
              )}
              
              <div className={styles.divider}></div>
              
              <div className={styles.row + ' ' + styles.total}>
                <span>Total</span>
                <PriceTag price={calculatePrice()} size="large" />
              </div>
            </div>

            <div className={styles.couponSection}>
              <h3>Have a coupon?</h3>
              <CouponInput courseId={courseId} onApply={handleCouponApply} />
            </div>

            <Button 
              onClick={handleCheckout} 
              disabled={processing}
              className={styles.checkoutBtn}
            >
              {processing ? 'Processing...' : calculatePrice() === 0 ? 'Enroll for Free' : `Pay $${calculatePrice().toFixed(2)}`}
            </Button>

            <p className={styles.guarantee}>
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
