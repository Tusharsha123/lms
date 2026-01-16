import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NotificationBell from './NotificationBell';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>LMS Platform</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <Link href="/courses" className={`${styles.navLink} ${isActive('/courses') ? styles.active : ''}`}>
            Courses
          </Link>
          
          {session && (
            <>
              <Link href="/my-courses" className={`${styles.navLink} ${isActive('/my-courses') ? styles.active : ''}`}>
                My Learning
              </Link>
              
              {(session.user.role === 'instructor' || session.user.role === 'admin') && (
                <Link href="/instructor" className={`${styles.navLink} ${isActive('/instructor') ? styles.active : ''}`}>
                  Instructor
                </Link>
              )}
              
              {session.user.role === 'admin' && (
                <Link href="/admin" className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}>
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className={styles.mobileNav}>
            <Link href="/courses" className={`${styles.mobileNavLink} ${isActive('/courses') ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              Courses
            </Link>
            {session && (
              <>
                <Link href="/my-courses" className={`${styles.mobileNavLink} ${isActive('/my-courses') ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
                  My Learning
                </Link>
                {(session.user.role === 'instructor' || session.user.role === 'admin') && (
                  <Link href="/instructor" className={`${styles.mobileNavLink} ${isActive('/instructor') ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
                    Instructor
                  </Link>
                )}
                {session.user.role === 'admin' && (
                  <Link href="/admin" className={`${styles.mobileNavLink} ${isActive('/admin') ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
              </>
            )}
            {!session && (
              <>
                <Link href="/auth/signin" className={styles.mobileSignInBtn} onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className={styles.mobileSignUpBtn} onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {session ? (
            <>
              <NotificationBell />
              
              <Link href="/wishlist" className={styles.iconBtn} title="Wishlist">
                ❤️
              </Link>

              <div className={styles.userMenu}>
                <button 
                  className={styles.userButton}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>

                {userMenuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.userName}>{session.user.name || 'User'}</p>
                      <p className={styles.userEmail}>{session.user.email}</p>
                    </div>
                    
                    <div className={styles.dropdownDivider} />
                    
                    <Link href="/profile" className={styles.dropdownItem}>
                      👤 Profile
                    </Link>
                    <Link href="/my-courses" className={styles.dropdownItem}>
                      📚 My Courses
                    </Link>
                    <Link href="/wishlist" className={styles.dropdownItem}>
                      ❤️ Wishlist
                    </Link>
                    <Link href="/certificates" className={styles.dropdownItem}>
                      📜 Certificates
                    </Link>
                    <Link href="/achievements" className={styles.dropdownItem}>
                      🏆 Achievements
                    </Link>
                    
                    <div className={styles.dropdownDivider} />
                    
                    <Link href="/settings" className={styles.dropdownItem}>
                      ⚙️ Settings
                    </Link>
                    
                    {(session.user.role === 'instructor' || session.user.role === 'admin') && (
                      <>
                        <div className={styles.dropdownDivider} />
                        <Link href="/instructor" className={styles.dropdownItem}>
                          🎓 Instructor Dashboard
                        </Link>
                        <Link href="/courses/create" className={styles.dropdownItem}>
                          ➕ Create Course
                        </Link>
                      </>
                    )}
                    
                    <div className={styles.dropdownDivider} />
                    
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className={styles.dropdownItem}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.signInBtn}>
                Sign In
              </Link>
              <Link href="/auth/signup" className={styles.signUpBtn}>
                Sign Up
              </Link>
            </>
          )}

          <button 
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
