import Parser from "rss-parser";
import crypto from "crypto";

const parser = new Parser({
    customFields: {
        item: [
            ["media:thumbnail", "mediaThumbnail"],
            ["media:content", "mediaContent"],
            ["content:encoded", "contentEncoded"],
        ],
    },
});

const RSS_FEEDS = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://feeds.npr.org/1001/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.theguardian.com/world/rss",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.france24.com/en/rss"
];

const extractImageFromHtml = (html) => {
    if (!html) return null;

    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
};

const getImage = (item) => {
    return (
        item.enclosure?.url ||
        item.mediaThumbnail?.$?.url ||
        item.mediaContent?.$?.url ||
        extractImageFromHtml(item.contentEncoded) ||
        extractImageFromHtml(item.content) ||
        extractImageFromHtml(item.description) ||
        null
    );
};

const normalizeItem = (item, source) => ({
    id: crypto
        .createHash("md5")
        .update(item.guid || item.link)
        .digest("hex"),
    source,
    title: item.title || "",
    description: item.contentSnippet || item.description || "",
    link: item.link || "",
    pubDate: item.pubDate || item.isoDate || "",
    image: getImage(item),
});

export const Home = async (req, res) => {
    try {
        const results = await Promise.allSettled(
            RSS_FEEDS.map(async (url) => {
                const feed = await parser.parseURL(url);

                return {
                    url,
                    source: feed.title || url,
                    items: feed.items.map((item) =>
                        normalizeItem(item, feed.title || url)
                    ),
                };
            })
        );

        const successFeeds = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);

        const failedFeeds = results
            .filter((result) => result.status === "rejected")
            .map((result, index) => ({
                url: RSS_FEEDS[index],
                error: result.reason.message,
            }));

        const news = successFeeds.flatMap((feed) => feed.items);

        res.json({
            status: "success",
            count: news.length,
            failedCount: failedFeeds.length,
            failedFeeds,
            data: news,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "RSS-ները կարդալ չհաջողվեց",
        });
    }
};