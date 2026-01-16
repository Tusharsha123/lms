import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import styles from '../styles/Settings.module.css';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    skills: '',
    education: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile({
        name: data.name || '',
        bio: data.profile?.bio || '',
        phone: data.profile?.phone || '',
        location: data.profile?.location || '',
        skills: data.profile?.skills || '',
        education: data.profile?.education || '',
      });
      if (data.profile?.preferences) {
        setPreferences(JSON.parse(data.profile.preferences));
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          preferences: JSON.stringify(preferences),
        }),
      });
      alert('Settings saved!');
    } catch (error) {
      console.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Settings | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Settings</h1>

        <form onSubmit={handleSave} className={styles.form}>
          <section className={styles.section}>
            <h2>Profile Information</h2>
            <Input
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <div className={styles.field}>
              <label>Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
              />
            </div>
            <Input
              label="Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              label="Location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
            <Input
              label="Skills (comma separated)"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
            <Input
              label="Education"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            />
          </section>

          <section className={styles.section}>
            <h2>Notification Preferences</h2>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
              />
              Email notifications for course updates
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.marketingEmails}
                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
              />
              Marketing emails and promotions
            </label>
          </section>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </main>
    </>
  );
}
