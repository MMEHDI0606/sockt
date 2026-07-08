import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const INSTALL_SCRIPT_URL =
  'https://raw.githubusercontent.com/sockt-dev/sockt/main/install.sh';

let cachedInstallScript: string | null = null;

const CLI_USER_AGENT_RE =
  /^(curl|wget|httpie|Go-http-client|PowerShell|python-requests|axios|node-fetch|got|Java)\b/i;

function isCliRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent');
  if (userAgent && CLI_USER_AGENT_RE.test(userAgent)) {
    return true;
  }
  const accept = request.headers.get('accept');
  if (!accept) return true;
  const wantsHtml = accept
    .split(',')
    .some((part) => part.trim().toLowerCase().startsWith('text/html'));
  return !wantsHtml;
}

async function serveInstallScript() {
  try {
    const response = await fetch(INSTALL_SCRIPT_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`GitHub returned status ${response.status}`);
    }
    const body = await response.text();
    cachedInstallScript = body;
    return new NextResponse(body, {
      status: 200,
      headers: {
        'content-type': 'application/x-sh; charset=utf-8',
        'content-disposition': 'inline; filename="install.sh"',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch {
    if (cachedInstallScript) {
      return new NextResponse(cachedInstallScript, {
        status: 200,
        headers: {
          'content-type': 'application/x-sh; charset=utf-8',
          'content-disposition': 'inline; filename="install.sh"',
          'cache-control': 'no-store',
        },
      });
    }
    return new NextResponse('# Failed to fetch install script. Please try again later.\n', {
      status: 502,
      headers: { 'content-type': 'application/x-sh; charset=utf-8' },
    });
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/install' && isCliRequest(request)) {
    return serveInstallScript();
  }
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
