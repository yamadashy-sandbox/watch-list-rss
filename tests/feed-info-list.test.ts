import { FEED_INFO_LIST, FeedInfo } from '../src/resources/feed-info-list';
import { FeedCrawler } from '../src/feed/utils/feed-crawler';
import { describe, it, expect } from 'vitest';
const RssParser = require('rss-parser');
const retry = require('async-retry');

const rssParser = new RssParser();

// 設定のテスト
describe('FEED_INFO_LIST', () => {
  it('FEED_INFO_LIST の設定が正しい', () => {
    expect(() => {
      FeedCrawler.validateFeedInfoList(FEED_INFO_LIST);
    }).not.toThrow();
  });
});

// フィード取得テスト
describe('フィードが取得可能', () => {
  FEED_INFO_LIST.map((feedInfo: FeedInfo) => {
    it.concurrent(
      `${feedInfo.label} / ${feedInfo.url}`,
      async () => {
        const feed = await retry(
          async () => {
            return rssParser.parseURL(feedInfo.url);
          },
          {
            retries: 3,
          },
        );
        expect(feed.items.length).toBeGreaterThanOrEqual(0);
      },
      60 * 1000,
    );
  });
});
