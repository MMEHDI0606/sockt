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
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    fontFamily: 'sans-serif',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 80px',
                        backgroundColor: '#000000',
                        border: '2px solid #333',
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 90,
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            marginBottom: 16,
                            color: '#ffffff',
                        }}
                    >
                        Sockt
                    </div>
                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 500,
                            color: '#a1a1aa',
                            textAlign: 'center',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Agent Compute Paid in Sats
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
