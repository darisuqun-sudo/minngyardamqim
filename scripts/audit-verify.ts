import fs from 'fs';
import path from 'path';
import { latinOrPinyinToUyghurArabic } from '../src/utils/UyghurScriptConverter';
import { unicodeToBase64, detectFileExtension } from '../src/utils/githubService';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(category: string, name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${category}] ${name} — ${details}`);
}

async function runAuditSuite() {
  console.log('==========================================================');
  console.log('🔍 UNIVERSAL PRODUCTION AUDIT & AUTOMATED VERIFICATION SUITE');
  console.log('==========================================================\n');

  // 1. Unit Tests: Uyghur Script Converter & GitHub Utility
  try {
    const converted = latinOrPinyinToUyghurArabic('essalamu eleykum');
    const hasUyghurChars = /[\u0600-\u06FF]/.test(converted);
    record('Unit', 'Uyghur Script Converter (Latin -> Uyghur Arabic)', hasUyghurChars, `Output: "${converted}"`);
  } catch (e: any) {
    record('Unit', 'Uyghur Script Converter', false, e.message);
  }

  try {
    const b64 = unicodeToBase64('ئەسسالامۇ ئەلەيكۇم 🌟');
    const ext = detectFileExtension('typescript', 'app');
    record('Unit', 'Unicode Base64 & File Extension Detection', b64.length > 0 && ext === 'app.ts', `Base64 len=${b64.length}, ext=${ext}`);
  } catch (e: any) {
    record('Unit', 'Unicode Base64 & File Extension Detection', false, e.message);
  }

  // 2. Static & Configuration Integrity Checks
  try {
    const indexCss = fs.readFileSync(path.join(process.cwd(), 'src/index.css'), 'utf-8');
    const hasDarkVariant = indexCss.includes('@custom-variant dark');
    record('UI/Tailwind', 'Tailwind v4 @custom-variant dark declaration', hasDarkVariant, hasDarkVariant ? 'Present in src/index.css' : 'Missing');

    const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/manifest.json'), 'utf-8'));
    const hasSeparateIcons = Array.isArray(manifest.icons) && manifest.icons.some((i: any) => i.purpose === 'any') && manifest.icons.some((i: any) => i.purpose === 'maskable');
    record('PWA', 'Manifest separate any & maskable icons', hasSeparateIcons, `Icons count=${manifest.icons?.length}, short_name="${manifest.short_name}" (${manifest.short_name?.length} chars)`);

    const swCode = fs.readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf-8');
    const checksGetOnly = swCode.includes("event.request.method !== 'GET'");
    record('PWA', 'Service Worker GET-only & API exclusion guard', checksGetOnly && swCode.includes("url.pathname.startsWith('/api/')"), 'Verified in public/sw.js');
  } catch (e: any) {
    record('Config', 'Static configuration inspection', false, e.message);
  }

  // 3. Security & Dialog Scan across React components
  try {
    const componentDir = path.join(process.cwd(), 'src/components');
    const files = fs.readdirSync(componentDir).filter((f) => f.endsWith('.tsx'));
    let blockingCallsFound = 0;
    for (const file of files) {
      if (file === 'CodingStudioView.tsx' || file === 'LiveCanvasSandbox.tsx') continue; // sandboxed iframe template strings
      const content = fs.readFileSync(path.join(componentDir, file), 'utf-8');
      if (/\bwindow\.(alert|confirm|open)\s*\(/.test(content) || /\b(alert|confirm)\s*\(/.test(content)) {
        blockingCallsFound++;
      }
    }
    record('Security/UX', 'Zero iframe-blocking alert/confirm/open in UI components', blockingCallsFound === 0, `Scanned ${files.length} components, blocking calls=${blockingCallsFound}`);
  } catch (e: any) {
    record('Security/UX', 'Component dialog scan', false, e.message);
  }

  // 4. Live Backend & Security Headers Audit
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    const nosniff = healthRes.headers.get('x-content-type-options');
    const referrer = healthRes.headers.get('referrer-policy');
    record(
      'Security',
      'HTTP Security Headers (X-Content-Type-Options & Referrer-Policy)',
      nosniff === 'nosniff' && referrer === 'strict-origin-when-cross-origin',
      `X-Content-Type-Options=${nosniff}, Referrer-Policy=${referrer}`
    );
    record('API', 'GET /api/health', healthRes.status === 200 && healthJson.status === 'ok', JSON.stringify(healthJson));
  } catch (e: any) {
    record('API', 'GET /api/health & Security Headers', false, e.message);
  }

  // 5. Gemini Models Endpoint
  try {
    const modelsRes = await fetch(`${BASE_URL}/api/gemini/models`);
    const modelsJson = await modelsRes.json();
    const hasModels = Array.isArray(modelsJson.activeModels) && modelsJson.activeModels.length > 0;
    record('API', 'GET /api/gemini/models', modelsRes.status === 200 && hasModels, `Models count=${modelsJson.activeModels?.length}, default=${modelsJson.defaultModel}`);
  } catch (e: any) {
    record('API', 'GET /api/gemini/models', false, e.message);
  }

  // 6. Universal Chat Endpoint (Uyghur RTL)
  try {
    const chatRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'ئەسسالامۇ ئەلەيكۇم، قىسقىچە سالام قايتۇرۇڭ.' }],
        persona: 'universal',
      }),
    });
    const chatJson = await chatRes.json();
    const validReply = typeof chatJson.reply === 'string' && chatJson.reply.length > 5;
    record('API', 'POST /api/chat (Uyghur Conversational AI)', chatRes.status === 200 && validReply, `Reply length=${chatJson.reply?.length}, model=${chatJson.modelUsed || 'fallback'}`);
  } catch (e: any) {
    record('API', 'POST /api/chat', false, e.message);
  }

  // 7. Project Blueprint Generator & Knowledge RAG Endpoints (Parallel)
  try {
    const [planRes, docRes] = await Promise.all([
      fetch(`${BASE_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea: 'Uyghur E-Learning PWA',
          targetPlatform: 'Web + Mobile',
          language: 'ug',
          model: 'gemini-3.1-flash-lite',
        }),
      }),
      fetch(`${BASE_URL}/api/analyze-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'System Architecture Spec',
          content: 'React 19 frontend with Express backend and local-first storage sovereignty.',
          language: 'ug',
        }),
      }),
    ]);

    const planJson = await planRes.json();
    const hasPlan = typeof planJson.planMarkdown === 'string' && planJson.planMarkdown.length > 20;
    record('API', 'POST /api/generate-plan', planRes.status === 200 && hasPlan, `Plan length=${planJson.planMarkdown?.length} chars`);

    const docJson = await docRes.json();
    const hasSummary = typeof docJson.summary === 'string' && docJson.summary.length > 0;
    record('API', 'POST /api/analyze-doc (Knowledge RAG)', docRes.status === 200 && hasSummary, `Summary length=${docJson.summary?.length}`);
  } catch (e: any) {
    record('API', 'POST /api/generate-plan & /api/analyze-doc', false, e.message);
  }

  // 9. API 404 JSON Guard (ensures unknown /api/* routes return JSON 404, not HTML)
  try {
    const notFoundRes = await fetch(`${BASE_URL}/api/non-existent-endpoint-check`);
    const contentType = notFoundRes.headers.get('content-type') || '';
    const notFoundJson = await notFoundRes.json();
    record(
      'Security/API',
      'Unmatched /api/* returns strict JSON 404',
      notFoundRes.status === 404 && contentType.includes('application/json') && Boolean(notFoundJson.error),
      `Status=${notFoundRes.status}, Content-Type=${contentType}`
    );
  } catch (e: any) {
    record('Security/API', 'Unmatched /api/* JSON 404 guard', false, e.message);
  }

  console.log('\n==========================================================');
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`📊 SUMMARY: ${passedCount}/${results.length} checks passed.`);
  console.log('==========================================================');

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runAuditSuite();
