import { siteConfig } from '@/lib/data';
import { getAllPosts } from '@/lib/posts';
import RSS from 'rss';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();
  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    site_url: 'https://polyglot-k.github.io',
    feed_url: 'https://polyglot-k.github.io/rss.xml',
    language: 'ko',
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `https://polyglot-k.github.io/blog/${post.slug}`,
      date: post.date,
      categories: [post.category],
      author: siteConfig.author.name,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
