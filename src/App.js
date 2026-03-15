import { useState } from 'react';
import './App.css';
import {
  tournamentInfo,
  blindStructure,
  playerStacks,
  prizePool,
  icmImpact,
  preflopSizings,
  treeConfig,
  engineConfig,
} from './data/solverData';

/* ===== Header ===== */
function Header() {
  return (
    <header className="header">
      <div className="header-badge">TRITON POKER &bull; GTO 求解器分析</div>
      <h1>短碼策略分析儀</h1>
      <p className="header-sub">
        HRC 求解器檔案解析 &middot; <strong>Nodelock 對策調整</strong> &middot; 5人剩餘
      </p>
    </header>
  );
}

/* ===== Nodelock Banner ===== */
function NodelockBanner() {
  return (
    <div className="nodelock-banner">
      <div className="nodelock-dot" />
      <span className="nodelock-text">
        NODELOCK 模式啟用 — 此為針對特定對手調整後的非均衡策略
      </span>
    </div>
  );
}

/* ===== Key Metrics Row ===== */
function KeyMetrics() {
  const totalChips = playerStacks.reduce((s, p) => s + p.chips, 0);
  const avgStack = (totalChips / playerStacks.length / blindStructure.bigBlind).toFixed(1);
  const heroICM = icmImpact.find((d) => d.position === 'CO');
  const shortestStack = playerStacks.reduce((a, b) => (a.chips < b.chips ? a : b));

  const metrics = [
    { label: '總獎金池', value: `$${(prizePool.totalPrizes / 1000).toFixed(0)}K`, color: 'var(--gold-light)' },
    { label: '淘汰賞金', value: `$${prizePool.bounty.toLocaleString()}`, color: 'var(--pink)' },
    { label: '平均籌碼', value: `${avgStack}bb`, color: 'var(--cyan)' },
    { label: '最短籌碼', value: `${shortestStack.position} ${shortestStack.bb}bb`, color: 'var(--red-light)' },
    { label: '主角ICM權益', value: `$${Math.round(heroICM.post).toLocaleString()}`, color: 'var(--green)' },
    { label: 'ICM 變化', value: `${heroICM.change >= 0 ? '+' : ''}${heroICM.changePercent}%`, color: heroICM.change >= 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div className="metrics-row">
      {metrics.map((m, i) => (
        <div className="metric-item" key={i}>
          <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          <div className="metric-label">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== Hero Hand Card ===== */
function HeroHandCard() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F0CF;</span> 主角手牌</div>
      <div className="hero-hand-display">
        <div className="hero-hand-cards">
          <div className="playing-card spade">
            <span className="rank">4</span>
            <span className="suit">&spades;</span>
          </div>
          <div className="playing-card heart">
            <span className="rank">4</span>
            <span className="suit">&hearts;</span>
          </div>
        </div>
        <div className="hero-label">位置</div>
        <div className="hero-position">CO（關煞位）</div>
        <div className="hero-stack">
          有效籌碼 <span>7,300</span> = <span>60.8bb</span>
        </div>
        <div className="hand-type-badge">口袋對子 &middot; 小對</div>
      </div>
    </div>
  );
}

/* ===== Tournament Info Card ===== */
function TournamentInfoCard() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F3C6;</span> 賽事資訊</div>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">賽事</span>
          <span className="info-value gold">{tournamentInfo.event}</span>
        </div>
        <div className="info-item">
          <span className="info-label">類型</span>
          <span className="info-value">{tournamentInfo.scenario}</span>
        </div>
        <div className="info-item">
          <span className="info-label">賽制</span>
          <span className="info-value blue">KO 淘汰賞金</span>
        </div>
        <div className="info-item">
          <span className="info-label">求解器</span>
          <span className="info-value green">{engineConfig.type}</span>
        </div>
        <div className="info-item">
          <span className="info-label">前注類型</span>
          <span className="info-value">{blindStructure.anteType}</span>
        </div>
        <div className="info-item">
          <span className="info-label">盲注結構</span>
          <span className="info-value">
            {blindStructure.ante}/{blindStructure.smallBlind}/{blindStructure.bigBlind}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ===== Poker Table Card ===== */
function PokerTableCard() {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const getChipClass = (bb) => {
    const v = parseFloat(bb);
    if (v < 10) return 'short';
    if (v > 40) return 'deep';
    return '';
  };

  const getStackCategory = (bb) => {
    const v = parseFloat(bb);
    if (v < 10) return '極短碼';
    if (v < 20) return '短碼';
    if (v < 40) return '中等碼量';
    return '深碼';
  };

  return (
    <div className="card grid-full">
      <div className="card-title"><span className="icon">&#x1F3AF;</span> 牌桌佈局與籌碼分佈</div>
      <div className="poker-table-container">
        <div className="poker-table">
          <div className="table-felt" />
          {playerStacks.map((p, i) => (
            <div
              key={i}
              className={`player-seat seat-${i} ${hoveredSeat === i ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredSeat(i)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              <div className={`seat-avatar ${p.isHero ? 'hero' : ''}`}>
                {p.position}
              </div>
              <div className={`seat-chips ${getChipClass(p.bb)}`}>
                {p.chips.toLocaleString()} ({p.bb}bb)
              </div>
              {hoveredSeat === i && (
                <div className="seat-tooltip">
                  <div className="tooltip-row"><strong>{p.position}</strong> &mdash; 座位 {p.seat}</div>
                  <div className="tooltip-row">籌碼: {p.chips.toLocaleString()}</div>
                  <div className="tooltip-row">大盲: {p.bb}bb</div>
                  <div className="tooltip-row">碼量: {getStackCategory(p.bb)}</div>
                  {p.isHero && <div className="tooltip-hero">&#x2605; 主角</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Stack distribution bar */}
      <div className="stack-distribution">
        <div className="stack-dist-label">籌碼分佈</div>
        <div className="stack-dist-bar">
          {playerStacks.map((p, i) => {
            const total = playerStacks.reduce((s, x) => s + x.chips, 0);
            const pct = (p.chips / total) * 100;
            const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];
            return (
              <div
                key={i}
                className="stack-dist-segment"
                style={{ width: `${pct}%`, background: colors[i] }}
                title={`${p.position}: ${pct.toFixed(1)}%`}
              >
                <span className="stack-dist-text">{p.position}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===== Prize Pool Card ===== */
function PrizePoolCard() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F4B0;</span> 獎金結構</div>
      <table className="prize-table">
        <thead>
          <tr>
            <th>名次</th>
            <th>獎金</th>
            <th>佔比</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prizePool.prizes).map(([place, amount]) => (
            <tr key={place}>
              <td>
                <span className={`prize-place place-${place}`}>{place}</span>
              </td>
              <td className="prize-amount">${amount.toLocaleString()}</td>
              <td className="prize-pct">
                {((amount / prizePool.totalPrizes) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bounty-badge">
        淘汰賞金 <strong>${prizePool.bounty.toLocaleString()}</strong>
      </div>
    </div>
  );
}

/* ===== ICM Chart ===== */
function ICMChart() {
  const [showPre, setShowPre] = useState(false);
  const maxEq = Math.max(...icmImpact.map((d) => Math.max(d.pre, d.post)));
  const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <div className="card">
      <div className="card-title">
        <span className="icon">&#x1F4CA;</span> ICM 權益分析
        <button
          className="icm-toggle"
          onClick={() => setShowPre(!showPre)}
        >
          {showPre ? '顯示調整後' : '顯示調整前'}
        </button>
      </div>
      <div className="icm-bars">
        {icmImpact.map((d, i) => {
          const val = showPre ? d.pre : d.post;
          const width = (val / maxEq) * 100;
          const isHero = d.position === 'CO';
          return (
            <div key={i} className={`icm-row ${isHero ? 'icm-hero-row' : ''}`}>
              <span className={`icm-label ${isHero ? 'hero' : ''}`}>{d.position}</span>
              <div className="icm-bar-container">
                <div
                  className="icm-bar"
                  style={{
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}88)`,
                  }}
                >
                  <span className="icm-bar-value">
                    ${Math.round(val).toLocaleString()}
                  </span>
                </div>
              </div>
              <span className={`icm-change ${d.change >= 0 ? 'positive' : 'negative'}`}>
                {d.change >= 0 ? '+' : ''}{d.changePercent}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="icm-legend">
        <span className="icm-legend-note">
          ICM = 獨立籌碼模型 &mdash; 將錦標賽籌碼轉換為真實金錢價值
        </span>
      </div>
    </div>
  );
}

/* ===== Strategic Insights ===== */
function StrategicInsights() {
  const insights = [
    {
      title: '場景概述',
      content: '5人桌，主角持有口袋4在CO位，擁有60.8bb的深碼。HJ僅有4.8bb極短碼，形成高壓局勢。KO賽制下淘汰賞金$8,000增加了對短碼玩家施壓的動力。',
      tag: '局勢',
      tagColor: 'var(--blue)',
    },
    {
      title: 'ICM 壓力分析',
      content: 'HJ位僅4.8bb，ICM權益從$132,542降至$127,306（-3.95%），面臨嚴峻淘汰壓力。CO（主角）權益微增+0.04%，Nodelock調整後策略應更積極利用位置優勢。',
      tag: 'ICM',
      tagColor: 'var(--green)',
    },
    {
      title: '賞金影響',
      content: '$8,000的淘汰賞金約佔第五名獎金的8.1%，顯著影響推打決策。對抗短碼玩家時，賞金權益使得更寬的跟注範圍成為正期望值操作。',
      tag: 'KO',
      tagColor: 'var(--pink)',
    },
    {
      title: 'Nodelock 意義',
      content: '此檔案已套用Nodelock（節點鎖定），意味著策略非純GTO均衡解，而是針對特定對手傾向調整後的剝削策略。這通常用於已有對手讀檔或特定場景優化。',
      tag: '策略',
      tagColor: 'var(--orange)',
    },
  ];

  return (
    <div className="insights-section">
      <div className="section-title">&#x1F9E0; 策略洞察</div>
      <div className="insights-grid">
        {insights.map((ins, i) => (
          <div className="insight-card" key={i}>
            <div className="insight-header">
              <span className="insight-tag" style={{ borderColor: ins.tagColor, color: ins.tagColor }}>
                {ins.tag}
              </span>
              <h3 className="insight-title">{ins.title}</h3>
            </div>
            <p className="insight-content">{ins.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Sizings Card ===== */
function SizingsCard() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F4D0;</span> 翻前加注尺寸</div>

      <div className="sizing-section">
        <div className="sizing-heading">開池加注</div>
        <div className="sizing-tags">
          {Object.entries(preflopSizings.open).map(([k, v]) => (
            <div className="sizing-tag" key={k}>
              <span className="tag-label">{k}</span>
              <span className="tag-value">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sizing-section">
        <div className="sizing-heading">3-Bet</div>
        <div className="sizing-tags">
          {Object.entries(preflopSizings.threeBet).map(([k, v]) => (
            <div className="sizing-tag" key={k}>
              <span className="tag-label">{k}</span>
              <span className="tag-value">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sizing-section">
        <div className="sizing-heading">4-Bet / 5-Bet</div>
        <div className="sizing-tags">
          {Object.entries(preflopSizings.fourBet).map(([k, v]) => (
            <div className="sizing-tag" key={k}>
              <span className="tag-label">4B {k}</span>
              <span className="tag-value">{v}</span>
            </div>
          ))}
          {Object.entries(preflopSizings.fiveBet).map(([k, v]) => (
            <div className="sizing-tag" key={k}>
              <span className="tag-label">5B {k}</span>
              <span className="tag-value">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Engine Card ===== */
function EngineCard() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x2699;&#xFE0F;</span> 求解引擎參數</div>
      <div className="engine-stats">
        <div className="engine-stat">
          <div className="engine-stat-value">{engineConfig.type}</div>
          <div className="engine-stat-label">演算法</div>
        </div>
        <div className="engine-stat">
          <div className="engine-stat-value">{engineConfig.maxActive}</div>
          <div className="engine-stat-label">最大活躍玩家</div>
        </div>
      </div>
      <div className="abstractions-list">
        {engineConfig.abstractions.map((a, i) => (
          <div className="abstraction-item" key={i}>
            <div className="abstraction-street">{a.street}</div>
            <div className="abstraction-buckets">{a.buckets.toLocaleString()}</div>
            <div className="abstraction-label">桶數</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Tree Config Card ===== */
function TreeConfigCard() {
  const items = [
    { label: '允許冷跟', value: treeConfig.allowColdCalls },
    { label: 'SB 完成', value: treeConfig.allowSBComplete },
    { label: '允許過底', value: treeConfig.allowDonk[0] },
    { label: 'All-in SPR', value: treeConfig.preflopAllinSPR, isNum: true },
    { label: 'All-in 門檻', value: `${treeConfig.allinThreshold}%`, isNum: true },
    { label: '幾何下注', value: treeConfig.postflopGeo[0].join('% / ') + '%', isNum: true },
  ];

  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F333;</span> 遊戲樹配置</div>
      <div className="config-items">
        {items.map((item, i) => (
          <div className="config-item" key={i}>
            <span className="config-item-label">{item.label}</span>
            {item.isNum ? (
              <span className="config-item-value" style={{ color: 'var(--cyan)' }}>
                {item.value}
              </span>
            ) : (
              <span className={`config-item-value ${item.value ? 'on' : 'off'}`}>
                {item.value ? '是' : '否'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Equity Donut Chart ===== */
function EquityDonut() {
  const total = icmImpact.reduce((s, d) => s + d.post, 0);
  const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];
  const radius = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = icmImpact.map((d, i) => {
    const pct = d.post / total;
    const dashArray = `${pct * circumference} ${circumference}`;
    const dashOffset = -(accumulated * circumference);
    accumulated += pct;
    return { ...d, dashArray, dashOffset, color: colors[i], pct };
  });

  const [hovered, setHovered] = useState(null);

  return (
    <div className="card">
      <div className="card-title"><span className="icon">&#x1F4C8;</span> 權益分佈圓餅圖</div>
      <div className="donut-container">
        <svg viewBox="0 0 200 200" className="donut-svg">
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={hovered === i ? strokeWidth + 6 : strokeWidth}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              transform="rotate(-90 100 100)"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer', opacity: hovered !== null && hovered !== i ? 0.4 : 1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text x="100" y="92" textAnchor="middle" className="donut-center-value">
            {hovered !== null ? `${(segments[hovered].pct * 100).toFixed(1)}%` : '100%'}
          </text>
          <text x="100" y="112" textAnchor="middle" className="donut-center-label">
            {hovered !== null ? segments[hovered].position : '總權益'}
          </text>
        </svg>
        <div className="donut-legend">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={`donut-legend-item ${hovered === i ? 'active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="legend-dot" style={{ background: seg.color }} />
              <span className="legend-pos">{seg.position}</span>
              <span className="legend-val">${Math.round(seg.post).toLocaleString()}</span>
              <span className="legend-pct">{(seg.pct * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Conclusion Card ===== */
function ConclusionCard() {
  return (
    <div className="conclusion-card">
      <div className="conclusion-icon">&#x1F3B0;</div>
      <h3 className="conclusion-title">分析總結</h3>
      <p className="conclusion-text">
        在Triton Poker Mystery Event五人桌的這個局面中，主角在CO位持有4&#9824;4&#9825;，
        擁有60.8bb的籌碼深度。HJ位僅4.8bb面臨極大ICM壓力，其權益大幅下降3.95%。
        Nodelock策略已針對特定對手傾向進行調整，$8,000的淘汰賞金進一步影響了
        推打範圍的計算。此求解使用Monte Carlo演算法，在翻前169個桶、翻牌1,024個桶
        的抽象精度下完成計算。
      </p>
    </div>
  );
}

/* ===== Footer ===== */
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        由 .hrcz 求解器檔案解析生成 &middot; Triton Poker Mystery Event &middot; Holdem Resources Calculator
      </p>
    </footer>
  );
}

/* ===== App ===== */
function App() {
  return (
    <div className="app">
      <Header />
      <NodelockBanner />
      <KeyMetrics />

      <div className="grid-2">
        <HeroHandCard />
        <TournamentInfoCard />
      </div>

      <PokerTableCard />

      <div className="grid-2">
        <PrizePoolCard />
        <ICMChart />
      </div>

      <StrategicInsights />

      <div className="section-title">&#x2699;&#xFE0F; 策略參數</div>
      <div className="grid-3">
        <SizingsCard />
        <EngineCard />
        <TreeConfigCard />
      </div>

      <div className="grid-2">
        <EquityDonut />
        <ConclusionCard />
      </div>

      <Footer />
    </div>
  );
}

export default App;
