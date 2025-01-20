import { Hono } from 'hono'
import { getPost } from './xhs';
import { createEmbed } from './embed';

const app = new Hono()

app.get('/', (c) => {
  return c.redirect('https://github.com/TheFalloutOf76/xiaohongshu-rednote-embed');
})

app.get('/a/:id', async (c) => {
  const origin = new URL(c.req.url).origin;
  if (c.req.header('User-Agent') != 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)') {
    return c.redirect(c.req.url.replace(origin, 'http://xhslink.com'));
  }
  const { id } = c.req.param();
  const post = await getPost(id);
  return c.html(createEmbed(post, { origin: origin }));
})

app.get('/embedAlternate/:data', (c) => {
  const { data } = c.req.param();
  return c.text(data);
});

export default app