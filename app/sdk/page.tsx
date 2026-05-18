import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

export default function SDKPage() {
  // return (
  //   <>
  //     <Nav />
  //     <main
  //       style={{
  //         minHeight: '100vh',
  //         backgroundColor: 'var(--bg-void)',
  //         color: 'var(--text-primary)',
  //         padding: '120px 24px 64px',
  //       }}
  //     >
  //       <div style={{ maxWidth: '920px', margin: '0 auto' }}>
  //         <h1
  //           style={{
  //             fontFamily: 'var(--font-display)',
  //             fontSize: 'clamp(2rem, 5vw, 3rem)',
  //             marginBottom: '14px',
  //           }}
  //         >
  //           Sockt SDK
  //         </h1>
  //         <p
  //           style={{
  //             fontFamily: 'var(--font-body)',
  //             color: 'var(--text-secondary)',
  //             lineHeight: 1.8,
  //             marginBottom: '24px',
  //           }}
  //         >
  //           Use the Sockt SDK to create sandboxes, execute workloads, read outputs, and terminate infrastructure from your agent workflows.
  //         </p>

  //         <div
  //           style={{
  //             border: '1px solid var(--bg-border)',
  //             backgroundColor: 'var(--bg-surface)',
  //             borderRadius: '8px',
  //             padding: '18px 20px',
  //             marginBottom: '24px',
  //           }}
  //         >
  //           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '10px' }}>
  //             Available languages
  //           </h2>
  //           <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
  //             TypeScript and Python are documented today, with the same sandbox lifecycle primitives across both SDKs.
  //           </p>
  //         </div>

  //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
  //           <Link href="/docs" style={linkStyle}>
  //             Read SDK docs
  //           </Link>
  //           <Link href="/use-cases" style={linkStyleMuted}>
  //             See workflow examples
  //           </Link>
  //           <Link href="/pricing" style={linkStyleMuted}>
  //             Pricing
  //           </Link>
  //         </div>
  //       </div>
  //     </main>
  //     <Footer />
  //   </>
  // );
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  backgroundColor: 'var(--accent-btc)',
  color: 'var(--bg-void)',
  padding: '10px 14px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};

const linkStyleMuted: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '10px 14px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};
