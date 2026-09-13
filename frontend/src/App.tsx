import { useState } from 'react';

import { Header } from './components/Header';
import { Panel } from './components/Panel';
import { StatCards } from './components/StatCards';
import { LiveTrafficChart } from './components/LiveTrafficChart';
import { PageBreakdown } from './components/PageBreakdown';
import { TrafficShare } from './components/TrafficShare';
import { PopularityChart } from './components/PopularityChart';
import { EventFeed } from './components/EventFeed';
import { useEventFeed } from './hooks/useEventFeed';
import { formatTime } from './lib/format';
import type { BucketDuration } from './types';

export default function App() {
  const [duration, setDuration] = useState<BucketDuration>('30 seconds');
  const feed = useEventFeed(duration);
  const trend = feed.rows.map((r) => r.total);

  const lastSync = feed.lastUpdated ? formatTime(feed.lastUpdated.toISOString()) : '—';

  return (
    <main className="app">
      <Header
        isHealthy={feed.isHealthy}
        isSimulating={feed.isSimulating}
        duration={duration}
        onDurationChange={setDuration}
        onSimulate={() => feed.simulate(24)}
      />

      <div className="app__body">
        <StatCards
          eventsInWindow={feed.eventsInWindow}
          eventsPerMin={feed.eventsPerMin}
          activePages={feed.activePages}
          totalPages={feed.pages.length}
          topPage={feed.topPage}
          topPageCount={feed.topPageCount}
          trend={trend}
          pages={feed.pages}
        />

        <div className="app__row app__row--wide">
          <Panel
            title="live traffic"
            subtitle={duration}
            meta={`last sync ${lastSync}`}
          >
            <LiveTrafficChart rows={feed.rows} bucketSizeSeconds={feed.bucketSizeSeconds} />
          </Panel>

          <Panel title="live stream" meta={feed.isHealthy ? 'streaming' : 'reconnecting'}>
            <EventFeed rows={feed.rows} pages={feed.pages} />
          </Panel>
        </div>

        <div className="app__row app__row--tri">
          <Panel title="traffic by route" subtitle="stacked area">
            <PageBreakdown rows={feed.rows} pages={feed.pages} />
          </Panel>

          <Panel title="traffic share" subtitle="% of window">
            <TrafficShare rows={feed.rows} pages={feed.pages} />
          </Panel>

          <Panel title="popularity" subtitle="route totals">
            <PopularityChart rows={feed.rows} pages={feed.pages} />
          </Panel>
        </div>
      </div>
    </main>
  );
}