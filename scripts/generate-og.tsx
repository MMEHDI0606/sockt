import React from 'react';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

async function main() {
    console.log('Generating OG Image...');
    const geistRegular = fs.readFileSync(path.join(rootDir, 'public/fonts/Geist-Regular.ttf'));
    const geistSemiBold = fs.readFileSync(path.join(rootDir, 'public/fonts/Geist-SemiBold.ttf'));
    const geistBlack = fs.readFileSync(path.join(rootDir, 'public/fonts/Geist-Black.ttf'));
    const geistMonoRegular = fs.readFileSync(path.join(rootDir, 'public/fonts/GeistMono-Regular.ttf'));

    const svg = await satori(
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
                        fontWeight: 600,
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
                        }}
                    >
                        <span>AI AGENT</span>
                        <span>COMPUTE</span>
                        <span>PAID IN</span>
                        <span style={{ color: '#d97706' }}>SATS.</span>
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', marginRight: '16px' }}>&gt;</span> status: READY
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Geist',
                    data: geistRegular,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Geist',
                    data: geistSemiBold,
                    weight: 600,
                    style: 'normal',
                },
                {
                    name: 'Geist',
                    data: geistBlack,
                    weight: 900,
                    style: 'normal',
                },
                {
                    name: 'Geist Mono',
                    data: geistMonoRegular,
                    weight: 400,
                    style: 'normal',
                },
            ],
        }
    );

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    fs.writeFileSync(path.join(rootDir, 'public/opengraph-image.png'), pngBuffer);
    console.log('OG Image generated successfully!');
}

main().catch(console.error);
