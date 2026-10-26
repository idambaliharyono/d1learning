export function getYoutubeId(url: string | null | undefined): string | null {
	if (!url) return null;
	try {
		const u = new URL(url.trim());
		const host = u.hostname.replace(/^www\./, '');

		if (host === 'youtu.be') return u.pathname.slice(1) || null;
		if (host === 'youtube.com' || host === 'm.youtube.com') {
			if (u.pathname === '/watch') return u.searchParams.get('v');
			const match = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{111})/);
			if (match) return match[2];
		}
		return null;
	} catch {
		return null;
	}
}

export const youtuEmbedUrl = (url: string | null | undefined) => {
	const id = getYoutubeId(url);
	return id ? `https://www.youtube.com/embed/${id}` : null;
};
