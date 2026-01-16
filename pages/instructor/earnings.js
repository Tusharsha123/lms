import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import styles from "../../styles/Earnings.module.css";

export default function Earnings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
      checkStripeConnect();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/payments/payouts");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch earnings");
    } finally {
      setLoading(false);
    }
  };

  const checkStripeConnect = async () => {
    try {
      const res = await fetch("/api/instructor/connect");
      const result = await res.json();
      setConnected(result.connected);
    } catch (error) {
      console.error("Failed to check Stripe Connect");
    }
  };

  const handleConnectStripe = async () => {
    try {
      const res = await fetch("/api/instructor/connect", { method: "POST" });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to connect Stripe");
    }
  };

  const handleRequestPayout = async () => {
    if (!data?.pendingBalance || data.pendingBalance < 50) {
      alert("Minimum payout amount is $50");
      return;
    }

    try {
      const res = await fetch("/api/payments/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: data.pendingBalance }),
      });

      if (res.ok) {
        alert("Payout requested successfully!");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to request payout");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Earnings | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <h1>Earnings & Payouts</h1>

        {!connected && (
          <div className={styles.connectBanner}>
            <h3>Connect Your Stripe Account</h3>
            <p>To receive payouts, you need to connect your Stripe account.</p>
            <Button onClick={handleConnectStripe}>Connect Stripe</Button>
          </div>
        )}

        <div className={styles.stats}>
          <StatCard
            title="Total Earnings"
            value={`$${(data?.totalEarnings || 0).toFixed(2)}`}
            icon="💵"
          />
          <StatCard
            title="Total Paid Out"
            value={`$${(data?.totalPaidOut || 0).toFixed(2)}`}
            icon="✅"
          />
          <StatCard
            title="Pending Balance"
            value={`$${(data?.pendingBalance || 0).toFixed(2)}`}
            icon="⏳"
          />
        </div>

        {connected && data?.pendingBalance >= 50 && (
          <div className={styles.payoutSection}>
            <Button onClick={handleRequestPayout}>
              Request Payout (${data.pendingBalance.toFixed(2)})
            </Button>
            <p className={styles.note}>
              Payouts are processed within 2-3 business days.
            </p>
          </div>
        )}

        <section className={styles.section}>
          <h2>Payout History</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.payouts?.map((payout) => (
                <tr key={payout.id}>
                  <td>{new Date(payout.createdAt).toLocaleDateString()}</td>
                  <td>${payout.amount.toFixed(2)}</td>
                  <td className={styles[payout.status]}>{payout.status}</td>
                </tr>
              ))}
              {(!data?.payouts || data.payouts.length === 0) && (
                <tr>
                  <td colSpan={3}>No payouts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <div className={styles.info}>
          <h3>How Payouts Work</h3>
          <ul>
            <li>You receive 70% of each course sale</li>
            <li>Minimum payout amount is $50</li>
            <li>Payouts are processed via Stripe</li>
            <li>Funds typically arrive within 2-3 business days</li>
          </ul>
        </div>
      </main>
    </>
  );
}
