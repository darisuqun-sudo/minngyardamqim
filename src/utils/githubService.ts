import { GitHubUser, GitHubRepo, GitHubPushPayload } from '../types';

const TOKEN_STORAGE_KEY = 'ming_github_token';
const USER_STORAGE_KEY = 'ming_github_user';
const LAST_REPO_KEY = 'ming_github_last_repo';

/**
 * Safely encode Unicode strings (including Uyghur, emoji, special chars) to base64
 */
export function unicodeToBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Get stored GitHub Personal Access Token from browser localStorage
 */
export function getStoredGitHubToken(): string {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Save GitHub Personal Access Token
 */
export function setStoredGitHubToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  } catch (e) {
    console.error('Failed to store GitHub token:', e);
  }
}

/**
 * Remove stored GitHub Token and cached user
 */
export function clearStoredGitHubData(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(LAST_REPO_KEY);
  } catch (e) {
    console.error('Failed to clear GitHub data:', e);
  }
}

/**
 * Get stored cached GitHub User
 */
export function getStoredGitHubUser(): GitHubUser | null {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Save cached GitHub User
 */
export function setStoredGitHubUser(user: GitHubUser | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to store GitHub user:', e);
  }
}

/**
 * Get stored last selected repository name
 */
export function getStoredLastRepo(): string {
  try {
    return localStorage.getItem(LAST_REPO_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Set stored last selected repository name
 */
export function setStoredLastRepo(repo: string): void {
  try {
    localStorage.setItem(LAST_REPO_KEY, repo);
  } catch (e) {
    console.error('Failed to store last repo:', e);
  }
}

/**
 * Verify Personal Access Token and return authenticated user
 */
export async function verifyGitHubToken(token: string): Promise<{ success: boolean; user?: GitHubUser; error?: string }> {
  if (!token || !token.trim()) {
    return { success: false, error: 'Token is empty' };
  }

  const cleanToken = token.trim();
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${cleanToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || `GitHub error: HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const user: GitHubUser = {
      login: data.login,
      id: data.id,
      avatar_url: data.avatar_url,
      name: data.name,
      html_url: data.html_url,
      public_repos: data.public_repos,
      bio: data.bio,
    };

    setStoredGitHubToken(cleanToken);
    setStoredGitHubUser(user);

    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to GitHub' };
  }
}

/**
 * Fetch repositories for the authenticated user
 */
export async function fetchUserRepos(token: string): Promise<{ success: boolean; repos: GitHubRepo[]; error?: string }> {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, repos: [], error: err.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    const repos: GitHubRepo[] = data.map((r: any) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      html_url: r.html_url,
      description: r.description,
      default_branch: r.default_branch || 'main',
      updated_at: r.updated_at,
    }));

    return { success: true, repos };
  } catch (err: any) {
    return { success: false, repos: [], error: err.message };
  }
}

/**
 * Create a new repository for the authenticated user
 */
export async function createGitHubRepo(
  token: string,
  name: string,
  isPrivate: boolean = false,
  description: string = 'Created via Ming Yardamqim AI Studio'
): Promise<{ success: boolean; repo?: GitHubRepo; error?: string }> {
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        private: isPrivate,
        description: description.trim(),
        auto_init: true, // Creates initial commit with README so main branch exists immediately
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.message || `HTTP ${response.status}` };
    }

    const r = await response.json();
    const repo: GitHubRepo = {
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      html_url: r.html_url,
      description: r.description,
      default_branch: r.default_branch || 'main',
    };

    return { success: true, repo };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Check if a file already exists in repository to obtain its sha
 */
async function getExistingFileSha(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string | null> {
  try {
    const cleanPath = path.replace(/^\/+/, '');
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Push or update a file on GitHub
 */
export async function pushCodeToGitHub(
  payload: GitHubPushPayload
): Promise<{ success: boolean; url?: string; commitSha?: string; error?: string }> {
  const token = payload.token || getStoredGitHubToken();
  if (!token) {
    return { success: false, error: 'GitHub Token is required' };
  }

  const owner = payload.owner.trim();
  const repo = payload.repo.trim();
  const branch = payload.branch?.trim() || 'main';
  const cleanPath = payload.path.replace(/^\/+/, '').trim();
  const commitMessage = payload.message.trim() || 'feat: add code generated by Ming Yardamqim';

  try {
    // 1. Check if file already exists so we can pass sha for update
    let existingSha = payload.sha;
    if (!existingSha) {
      existingSha = (await getExistingFileSha(token, owner, repo, cleanPath, branch)) || undefined;
    }

    // 2. Encode content to Base64
    const base64Content = unicodeToBase64(payload.content);

    // 3. Send PUT request
    const body: any = {
      message: commitMessage,
      content: base64Content,
      branch: branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || `Failed to commit file: HTTP ${response.status}`,
      };
    }

    const result = await response.json();
    const fileHtmlUrl = result.content?.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${cleanPath}`;
    const commitSha = result.commit?.sha;

    // Save last used repo
    setStoredLastRepo(repo);

    return {
      success: true,
      url: fileHtmlUrl,
      commitSha: commitSha,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error pushing to GitHub',
    };
  }
}

/**
 * Detect file extension from language tag
 */
export function detectFileExtension(language: string, defaultName: string = 'index'): string {
  const l = (language || '').toLowerCase().trim();
  const base = defaultName.replace(/\.[a-zA-Z0-9]+$/, '');

  switch (l) {
    case 'python':
    case 'py':
      return `${base}.py`;
    case 'typescript':
    case 'ts':
      return `${base}.ts`;
    case 'react':
    case 'tsx':
      return `${base}.tsx`;
    case 'jsx':
      return `${base}.jsx`;
    case 'javascript':
    case 'js':
      return `${base}.js`;
    case 'html':
    case 'htm':
      return `${base}.html`;
    case 'css':
      return `${base}.css`;
    case 'sql':
      return `${base}.sql`;
    case 'json':
      return `${base}.json`;
    case 'markdown':
    case 'md':
      return `${base}.md`;
    case 'c':
      return `${base}.c`;
    case 'cpp':
    case 'c++':
      return `${base}.cpp`;
    case 'java':
      return `${base}.java`;
    case 'go':
    case 'golang':
      return `${base}.go`;
    case 'rust':
    case 'rs':
      return `${base}.rs`;
    case 'php':
      return `${base}.php`;
    case 'shell':
    case 'bash':
    case 'sh':
      return `${base}.sh`;
    case 'yaml':
    case 'yml':
      return `${base}.yaml`;
    default:
      return `${base}.${l || 'txt'}`;
  }
}
