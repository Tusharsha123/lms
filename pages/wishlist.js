import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Loading from '../components/Loading';
import styles from '../styles/Wishlist.module.css';

export default function Wishlist() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>My Wishlist | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <h1>My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className={styles.empty}>
            <p>Your wishlist is empty</p>
            <Link href="/courses" className={styles.browseBtn}>Browse Courses</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((item) => (
              <Card key={item.id} className={styles.courseCard}>
                <div className={styles.thumbnail}>
                  {item.course.thumbnail ? (
                    <img src={item.course.thumbnail} alt={item.course.title} />
                  ) : (
                    <div className={styles.placeholderThumb}>📚</div>
                  )}
                  <WishlistButton courseId={item.course.id} />
                </div>
                <div className={styles.content}>
                  <Link href={`/courses/${item.course.id}`}>
                    <h3>{item.course.title}</h3>
                  </Link>
                  <p className={styles.instructor}>
                    {item.course.instructor?.name || 'Unknown Instructor'}
                  </p>
                  <div className={styles.meta}>
                    <RatingStars 
                      rating={item.course.avgRating || 0} 
                      showCount 
                      count={item.course.reviewCount} 
                      size="small"
                    />
                    <span className={styles.students}>
                      {item.course.enrollmentCount} students
                    </span>
                  </div>
                  <div className={styles.footer}>
                    <PriceTag price={item.course.price} />
                    <Link href={`/courses/${item.course.id}`} className={styles.viewBtn}>
                      View Course
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
