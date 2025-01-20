import type { XhsPost } from './xhs.ts';
import { encode } from 'html-entities';

function createEmbed(post: XhsPost, options: { origin: string }): string {
  let match;
  while (match = /#(\S.+?)\[话题\]#/.exec(post.content)) {
    post.content = post.content.replace(match[0], '#' + match[1]);
  }

  let ogTags = [];
  ogTags.push(`<meta property="og:title" content="${encode(post.title)}">`);
  ogTags.push(`<meta property="og:description" content="${encode(post.content)}">`);
  ogTags.push(`<meta property="og:url" content="${post.url}">`);
  ogTags.push('<meta property="theme-color" content="#ff2442" />');
  if (post?.images?.length) {
    ogTags.push(`<meta property="og:image" content="${post.images[0]}">`);
  }

  let alternateEmbed;
  if (post.type == 'normal') {
    ogTags.push('<meta property="twitter:card" content="summary_large_image" />');
    alternateEmbed = {
      "author_name": `💬 ${post.userInteraction.comment}   🔁 ${post.userInteraction.share}   ❤️ ${post.userInteraction.like}   ⭐ ${post.userInteraction.save}`,
      "author_url": post.url,
      "provider_name": 'XHS embedder',
      "provider_url": 'https://github.com/TheFalloutOf76/xiaohongshu-rednote-embed',
      "title": "Embed",
      "type": "photo",
      "version": "1.0"
    }
  }
  else if (post.type == 'video') {
    ogTags.push('<meta property="og:type" content="video.other">');
    ogTags.push(`<meta property="og:video" content="${post.video}">`);
    alternateEmbed = {
      "author_name": post.content,
      "author_url": post.url,
      "provider_name": `💬 ${post.userInteraction.comment}   🔁 ${post.userInteraction.share}   ❤️ ${post.userInteraction.like}   ⭐ ${post.userInteraction.save}`,
      "provider_url": post.url,
      "title": "Embed",
      "type": "link",
      "version": "1.0"
    }

  }

  ogTags.push(`<link rel="alternate" href="${options.origin}/embedAlternate/${encodeURIComponent(JSON.stringify(alternateEmbed))}" type="application/json+oembed" title="${post.title}">`);
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    ${ogTags.join('\n')}
  </head>
  <body>
  </body>
  </html>
  `;
  return html;
}

export { createEmbed };