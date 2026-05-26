import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Sockt | Agent Compute Paid in Sats';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    const fontData = await fetch(
        new URL('./public/fonts/Geist-Variable.woff2', import.meta.url)
    ).then((res) => res.arrayBuffer());

    const fontMonoData = await fetch(
        new URL('./public/fonts/GeistMono-Variable.woff2', import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#0a0a0a',
                    fontFamily: 'Geist',
                    backgroundImage:
                        'radial-gradient(circle at 25px 25px, #333 1px, transparent 0%)',
                    backgroundSize: '50px 50px',
                    padding: '48px 64px',
                }}
            >
                {/* Top Header - Centered Logo */}
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '32px',
                            fontWeight: '600',
                            color: '#ffffff',
                        }}
                    >
                        <span style={{ color: '#d97706', marginRight: '16px', fontFamily: 'Geist Mono' }}>&#123;*&#125;</span>
                        Sockt
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        flex: 1, // Change height: 100% to flex: 1 to ensure it centers correctly
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Left Side text */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '55%',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontSize: '85px',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                color: '#f4f4f5',
                                marginBottom: '24px',
                            }}
                        >
                            <span>AI AGENT</span>
                            <span>COMPUTE</span>
                            <span>PAID IN</span>
                            <span style={{ color: '#d97706' }}>SATS.</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                fontSize: '24px',
                                fontWeight: 400,
                                color: '#71717a',
                                lineHeight: 1.5,
                            }}
                        >
                            Provision GPU and CPU sandboxes, settle over Lightning, run
                            workloads, and terminate automatically.
                        </div>
                    </div>

                    {/* Right Side Terminal */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%',
                            backgroundColor: '#18181b',
                            borderRadius: '16px',
                            border: '1px solid #3f3f46',
                            padding: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Terminal Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: '1px solid #3f3f46',
                                paddingBottom: '16px',
                                marginBottom: '24px',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#ef4444' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#eab308' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#22c55e' }}></div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    marginLeft: '24px',
                                    color: '#71717a',
                                    fontFamily: 'Geist Mono',
                                    fontSize: '16px',
                                }}
                            >
                                sockt-runtime
                            </div>
                        </div>

                        {/* Terminal Body */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: 'Geist Mono',
                                fontSize: '20px',
                                color: '#d4d4d8',
                                gap: '16px',
                            }}
                        >
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> initializing runtime</div>
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> gpu_type: H100 SXM5</div>
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> allocation: 2x</div>
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> channel_open: lnbc1pvjluezpp...</div>
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> balance: 128,400 sats</div>
                            <div style={{ display: 'flex' }}><span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> status: READY ✓</div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Geist',
                    data: fontData,
                    style: 'normal',
                },
                {
                    name: 'Geist Mono',
                    data: fontMonoData,
                    style: 'normal',
                },
            ],
        }
    );
}
