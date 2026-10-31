const ID_RE = /^[\w-]{11}$/;

const YOUTUBE_HOSTS = new Set([
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'music.youtube.com',
	'youtube-nocookie.com',
	'www.youtube-nocookie.com'
]);
const SHORT_HOSTS = new Set(['youtu.be', 'www.youtu.be']);
const PATH_KINDS = new Set(['embed', 'shorts', 'live', 'v']);

export function getYoutubeId(input: unknown): string | null {
	if (typeof input !== 'string') return null;

	let raw = input.trim();
	if (!raw || raw.length > 2048) return null;

	// allow "youtube.com/watch?v=..." pasted without a scheme
	if (!/^[a-z][a-z\d+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;

	let u: URL;
	try {
		u = new URL(raw);
	} catch {
		return null;
	}

	// blocks javascript:, data:, file:, etc.
	if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;

	const host = u.hostname.toLowerCase();
	const segments = u.pathname.split('/').filter(Boolean);
	const first = segments[0] ?? '';
	let id: string | null = null;

	if (SHORT_HOSTS.has(host)) {
		id = segments[0] ?? null;
	} else if (YOUTUBE_HOSTS.has(host)) {
		if (first === 'watch') id = u.searchParams.get('v');
		else if (PATH_KINDS.has(first)) id = segments[1] ?? null;
	}

	return id && ID_RE.test(id) ? id : null;
}

export const youtuEmbedUrl = (url: unknown) => {
	const id = getYoutubeId(url);
	return id ? `https://www.youtube.com/embed/${id}` : null;
};
