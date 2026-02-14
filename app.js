// ============================================================
// WAGMI Platform — app.js
// Contract addresses (swap these for live deployment)
// ============================================================
const CONTRACTS = {
  ROUTER: '0x0000000000000000000000000000000000000000',
  FACTORY: '0x0000000000000000000000000000000000000000',
  WAGMI_TOKEN: '0x0000000000000000000000000000000000000000',
  EXP_TOKEN: '0x0000000000000000000000000000000000000000',
  NFT_MARKETPLACE: '0x0000000000000000000000000000000000000000',
  DAO_FACTORY: '0x0000000000000000000000000000000000000000',
  STAKING: '0x0000000000000000000000000000000000000000',
};

// Expanse chain config
const EXPANSE_CHAIN = { chainId: '0x2', name: 'Expanse', rpc: 'https://node.expanse.tech' };

let provider, signer, userAddress;

async function connectWeb3(type) {
  try {
    if (type === 'walletconnect') {
      // WalletConnect v2 via EthereumProvider
      if (!window.EthereumProvider) {
        showToast('Loading WalletConnect...');
        return;
      }
      const wcProvider = await window.EthereumProvider.init({
        projectId: 'e899c82be21d4acca2c8aec45e893598',
        chains: [2], // Expanse chain ID
        showQrModal: true,
        optionalChains: [1, 2],
        rpcMap: {
          2: 'https://node.expanse.tech',
          1: 'https://eth.llamarpc.com',
        }
      });
      await wcProvider.enable();
      provider = new ethers.BrowserProvider(wcProvider);
      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      onWalletConnected(userAddress);
    } else {
      // MetaMask / injected provider
      if (!window.ethereum) {
        showToast('No wallet detected. Please install MetaMask or use WalletConnect.');
        return;
      }
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      // Try switching to Expanse
      try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: EXPANSE_CHAIN.chainId }] });
      } catch(e) {
        try {
          await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: EXPANSE_CHAIN.chainId, chainName: EXPANSE_CHAIN.name, nativeCurrency: { name: 'Expanse', symbol: 'EXP', decimals: 18 }, rpcUrls: [EXPANSE_CHAIN.rpc] }] });
        } catch(e2) {}
      }
      onWalletConnected(userAddress);
    }
  } catch(err) {
    console.error('Wallet connection error:', err);
    showToast('Connection failed: ' + (err.message || 'User rejected'));
  }
}

function onWalletConnected(address) {
  const short = address.slice(0,6) + '...' + address.slice(-4);
  document.querySelector('.btn-connect').innerHTML = `<span class="connected-dot"></span>${short}`;
  document.querySelector('.btn-connect').onclick = () => showToast('Connected: ' + address);
  showToast('Wallet connected: ' + short);
}

// ============================================================
// MOCK DATA
// ============================================================
const TOKENS = [
  { symbol: 'EXP', name: 'Expanse', color: '#00ff88', price: 0.0432, change: 5.2, balance: 12450 },
  { symbol: 'WAGMI', name: 'WAGMI Token', color: '#00ccff', price: 0.0063, change: 12.8, balance: 85200 },
  { symbol: 'ETH', name: 'Ethereum', color: '#627eea', price: 2847.50, change: -1.3, balance: 2.45 },
  { symbol: 'USDT', name: 'Tether', color: '#26a17b', price: 1.00, change: 0.01, balance: 5430 },
  { symbol: 'USDC', name: 'USD Coin', color: '#2775ca', price: 1.00, change: -0.02, balance: 3200 },
  { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a', price: 97245.00, change: 2.4, balance: 0.082 },
];

const NFTS = [
  { id:1, name:'Expanse Genesis #001', collection:'Expanse Genesis', cat:'art', price:'240 EXP', creator:'0x7a3...f2e1', likes:84, colors:['#00ff88','#0a0a0f'], desc:'The first genesis NFT minted on Expanse blockchain.' },
  { id:2, name:'Cosmic Drift #042', collection:'Cosmic Drift', cat:'art', price:'180 EXP', creator:'0x3b1...a8c2', likes:62, colors:['#00ccff','#1a0033'] },
  { id:3, name:'Neon Samurai', collection:'Digital Warriors', cat:'collectibles', price:'520 EXP', creator:'0x9e4...d7b3', likes:157, colors:['#ff4466','#0a0a0f'] },
  { id:4, name:'Quantum Cat #007', collection:'Quantum Cats', cat:'collectibles', price:'95 EXP', creator:'0x2c8...e4a1', likes:203, colors:['#ffaa00','#1a1a0f'] },
  { id:5, name:'Synthwave Sunset', collection:'Cosmic Drift', cat:'art', price:'310 EXP', creator:'0x3b1...a8c2', likes:91, colors:['#ff6633','#330066'] },
  { id:6, name:'Expanse Genesis #002', collection:'Expanse Genesis', cat:'art', price:'220 EXP', creator:'0x7a3...f2e1', likes:76, colors:['#00ff88','#001a0f'] },
  { id:7, name:'Pixel Knight #12', collection:'Pixel Realms', cat:'gaming', price:'45 EXP', creator:'0x6d2...b3c9', likes:44, colors:['#8b5cf6','#0f0a1a'] },
  { id:8, name:'Beat Drop #3', collection:'Sound Waves', cat:'music', price:'88 EXP', creator:'0x1f5...c2d8', likes:38, colors:['#ff44cc','#0a0a1a'] },
  { id:9, name:'Void Walker', collection:'Digital Warriors', cat:'collectibles', price:'680 EXP', creator:'0x9e4...d7b3', likes:189, colors:['#00ccff','#0f001a'] },
  { id:10, name:'Pixel Mage #5', collection:'Pixel Realms', cat:'gaming', price:'52 EXP', creator:'0x6d2...b3c9', likes:55, colors:['#00ff88','#1a0a1a'] },
  { id:11, name:'Deep Bass #1', collection:'Sound Waves', cat:'music', price:'120 EXP', creator:'0x1f5...c2d8', likes:67, colors:['#00ccff','#1a001a'] },
  { id:12, name:'Neon Dragon', collection:'Digital Warriors', cat:'collectibles', price:'890 EXP', creator:'0x9e4...d7b3', likes:245, colors:['#ffaa00','#1a0000'] },
];

const COLLECTIONS = [
  { name:'Expanse Genesis', floor:'210 EXP', items:100, color:'#00ff88' },
  { name:'Cosmic Drift', floor:'120 EXP', items:250, color:'#00ccff' },
  { name:'Digital Warriors', floor:'380 EXP', items:50, color:'#ff4466' },
  { name:'Quantum Cats', floor:'65 EXP', items:500, color:'#ffaa00' },
  { name:'Pixel Realms', floor:'30 EXP', items:1000, color:'#8b5cf6' },
  { name:'Sound Waves', floor:'55 EXP', items:75, color:'#ff44cc' },
];

const DAOS = [
  { id:1, name:'Expanse DAO', icon:'🌐', color:'#00ff88', desc:'Core governance for the Expanse blockchain. Vote on protocol upgrades, treasury allocation, and network parameters.', members:1247, proposals:23, treasury:'$842,500', tokens:[{symbol:'EXP',amount:'2,450,000'},{symbol:'USDT',amount:'342,500'}] },
  { id:2, name:'WAGMI Treasury', icon:'💰', color:'#00ccff', desc:'Community treasury managing WAGMI ecosystem funds. Supporting grants, development, and partnerships.', members:834, proposals:15, treasury:'$285,000', tokens:[{symbol:'WAGMI',amount:'12,000,000'},{symbol:'EXP',amount:'800,000'}] },
  { id:3, name:'NFT Collective', icon:'🎨', color:'#8b5cf6', desc:'Collective governance for NFT marketplace parameters, curated collections, and creator grants.', members:456, proposals:8, treasury:'$94,200', tokens:[{symbol:'EXP',amount:'450,000'}] },
  { id:4, name:'DeFi Guild', icon:'⚡', color:'#ffaa00', desc:'Governing DeFi protocol parameters including swap fees, liquidity incentives, and new token listings.', members:612, proposals:19, treasury:'$520,000', tokens:[{symbol:'EXP',amount:'1,200,000'},{symbol:'WAGMI',amount:'5,000,000'}] },
];

const PROPOSALS = {
  1: [
    { id:1, title:'EIP-47: Reduce Block Time to 30s', desc:'Proposal to reduce block time from 45s to 30s for faster transaction confirmations.', status:'active', forPct:68, againstPct:22, abstainPct:10, votes:892, ends:'2d 14h' },
    { id:2, title:'Treasury Allocation: Developer Grants Q1', desc:'Allocate 500,000 EXP for developer grants in Q1 2026.', status:'active', forPct:82, againstPct:12, abstainPct:6, votes:654, ends:'5d 8h' },
    { id:3, title:'EIP-45: Bridge to Ethereum Mainnet', desc:'Fund development of a cross-chain bridge connecting Expanse to Ethereum mainnet.', status:'passed', forPct:91, againstPct:6, abstainPct:3, votes:1102 },
    { id:4, title:'Marketing Budget Increase', desc:'Increase marketing budget by 200,000 EXP per quarter.', status:'rejected', forPct:34, againstPct:58, abstainPct:8, votes:987 },
  ],
  2: [
    { id:5, title:'WAGMI Buyback Program', desc:'Use 10% of platform fees for quarterly WAGMI token buybacks.', status:'active', forPct:76, againstPct:18, abstainPct:6, votes:445, ends:'3d 2h' },
    { id:6, title:'Launch Liquidity Mining Program', desc:'Deploy WAGMI rewards for liquidity providers across all pairs.', status:'passed', forPct:88, againstPct:8, abstainPct:4, votes:723 },
  ],
  3: [
    { id:7, title:'Curated Collection: Cosmic Drift', desc:'Add Cosmic Drift as an official curated collection with reduced fees.', status:'active', forPct:72, againstPct:15, abstainPct:13, votes:234, ends:'6d 20h' },
  ],
  4: [
    { id:8, title:'Reduce Swap Fee to 0.2%', desc:'Lower the default swap fee from 0.3% to 0.2% to be more competitive.', status:'active', forPct:54, againstPct:38, abstainPct:8, votes:389, ends:'1d 6h' },
    { id:9, title:'Add MATIC/EXP Pool', desc:'Create a new liquidity pool for MATIC/EXP trading pair.', status:'passed', forPct:85, againstPct:10, abstainPct:5, votes:502 },
  ],
};

const MEMBERS = [
  { addr:'0x7a3...f2e1', emoji:'🟢', name:'expansedev.exp' },
  { addr:'0x3b1...a8c2', emoji:'🔵', name:'wagmiwhale.exp' },
  { addr:'0x9e4...d7b3', emoji:'🟣', name:'cryptoking.exp' },
  { addr:'0x2c8...e4a1', emoji:'🟡', name:'defimaster.exp' },
  { addr:'0x6d2...b3c9', emoji:'🔴', name:'nftlord.exp' },
];

const STAKING_POOLS = [
  { tokens:['EXP'], colors:['#00ff88'], apy:22.4, tvl:'$1,842,000', staked:'42,650,000 EXP', rewards:'EXP', minStake:'100 EXP' },
  { tokens:['WAGMI'], colors:['#00ccff'], apy:35.6, tvl:'$685,000', staked:'108,730,000 WAGMI', rewards:'WAGMI', minStake:'1,000 WAGMI' },
  { tokens:['EXP','WAGMI'], colors:['#00ff88','#00ccff'], apy:48.2, tvl:'$1,245,000', staked:'—', rewards:'WAGMI + EXP', minStake:'50 EXP + 500 WAGMI' },
  { tokens:['EXP','USDT'], colors:['#00ff88','#26a17b'], apy:12.8, tvl:'$513,930', staked:'—', rewards:'EXP', minStake:'100 EXP' },
];

const TRANSACTIONS = [
  { type:'Swap', detail:'EXP → WAGMI', amount:'+12,400 WAGMI', time:'2 min ago', icon:'🔄', color:'var(--cyan)' },
  { type:'Receive', detail:'From 0x3b1...a8c2', amount:'+500 EXP', time:'18 min ago', icon:'📥', color:'var(--green)' },
  { type:'Stake', detail:'EXP Staking Pool', amount:'-2,000 EXP', time:'1 hour ago', icon:'🔒', color:'var(--purple)' },
  { type:'NFT Purchase', detail:'Cosmic Drift #042', amount:'-180 EXP', time:'3 hours ago', icon:'🖼️', color:'var(--orange)' },
  { type:'Swap', detail:'USDT → EXP', amount:'+4,800 EXP', time:'5 hours ago', icon:'🔄', color:'var(--cyan)' },
  { type:'Claim Rewards', detail:'Staking Rewards', amount:'+124 EXP', time:'8 hours ago', icon:'🎁', color:'var(--green)' },
  { type:'Send', detail:'To 0x9e4...d7b3', amount:'-1,000 EXP', time:'1 day ago', icon:'📤', color:'var(--red)' },
  { type:'DAO Vote', detail:'EIP-47: Reduce Block Time', amount:'—', time:'1 day ago', icon:'🗳️', color:'var(--purple)' },
];

// ============================================================
// STATE
// ============================================================
let currentTab = 'exchange';
let swapFrom = 0; // index into TOKENS
let swapTo = 1;
let tokenSelectTarget = 'from';
let currentSlippage = 0.5;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMarkets();
  renderNFTs();
  renderCollections();
  renderDAOs();
  renderStakingPools();
  renderPortfolio();
  renderChart();
  setupNavListeners();
  updateSwapTokenDisplay();
});

// ============================================================
// NAV
// ============================================================
function setupNavListeners() {
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      switchTab(el.dataset.tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  // Hide DAO detail when switching to DAOs
  if (tab === 'daos') {
    document.getElementById('daoDetail').style.display = 'none';
    document.getElementById('daoGrid').style.display = '';
  }
  closeMobileMenu();
}

function toggleMobileMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileNav').classList.remove('open');
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOverlay(e) { if (e.target === e.currentTarget) e.target.classList.remove('open'); }

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type='success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ============================================================
// EXCHANGE
// ============================================================
function switchSwapMode(mode) {
  document.querySelectorAll('.swap-tab').forEach((el,i) => el.classList.toggle('active', (mode==='swap'?0:1)===i));
  document.getElementById('swapPanel').classList.toggle('active', mode==='swap');
  document.getElementById('liquidityPanel').classList.toggle('active', mode==='liquidity');
}

function switchLiqMode(mode) {
  document.querySelectorAll('.liq-tab').forEach((el,i) => el.classList.toggle('active', (mode==='add'?0:1)===i));
  document.getElementById('liqAddPanel').style.display = mode==='add' ? '' : 'none';
  document.getElementById('liqRemovePanel').style.display = mode==='remove' ? '' : 'none';
}

function updateSwapTokenDisplay() {
  const f = TOKENS[swapFrom], t = TOKENS[swapTo];
  document.getElementById('fromTokenName').textContent = f.symbol;
  document.getElementById('toTokenName').textContent = t.symbol;
  document.getElementById('fromBalance').textContent = f.balance.toLocaleString();
  document.getElementById('toBalance').textContent = t.balance.toLocaleString();
  // Icon placeholders (colored circles)
  setTokenIcon('fromTokenIcon', f);
  setTokenIcon('toTokenIcon', t);
}

function setTokenIcon(elId, token) {
  const el = document.getElementById(elId);
  el.style.cssText = `width:22px;height:22px;border-radius:50%;background:${token.color};display:inline-block`;
  el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
}

function calcSwap() {
  const amt = parseFloat(document.getElementById('swapFromAmount').value) || 0;
  const f = TOKENS[swapFrom], t = TOKENS[swapTo];
  if (amt > 0) {
    const rate = f.price / t.price;
    const out = amt * rate * 0.997; // 0.3% fee
    document.getElementById('swapToAmount').value = out.toFixed(out > 100 ? 2 : 6);
    document.getElementById('swapDetails').style.display = '';
    document.getElementById('swapRate').textContent = `1 ${f.symbol} = ${rate.toFixed(rate > 100 ? 2 : 6)} ${t.symbol}`;
    document.getElementById('minReceived').textContent = (out * (1 - currentSlippage/100)).toFixed(out > 100 ? 2 : 6) + ' ' + t.symbol;
    const impact = amt * f.price < 1000 ? '< 0.01%' : (amt * f.price < 10000 ? '0.05%' : '0.32%');
    document.getElementById('priceImpact').textContent = impact;
    document.getElementById('priceImpact').className = amt * f.price < 10000 ? 'green' : 'red';
  } else {
    document.getElementById('swapToAmount').value = '';
    document.getElementById('swapDetails').style.display = 'none';
  }
}

function flipTokens() {
  [swapFrom, swapTo] = [swapTo, swapFrom];
  updateSwapTokenDisplay();
  calcSwap();
}

function setMax(side) {
  if (side === 'from') {
    document.getElementById('swapFromAmount').value = TOKENS[swapFrom].balance;
    calcSwap();
  }
}

function openTokenSelect(target) {
  tokenSelectTarget = target;
  renderTokenList('');
  openModal('tokenSelectModal');
}

function renderTokenList(filter) {
  const c = document.getElementById('tokenListModal');
  c.innerHTML = TOKENS.filter(t => !filter || t.name.toLowerCase().includes(filter.toLowerCase()) || t.symbol.toLowerCase().includes(filter.toLowerCase()))
    .map((t,i) => `<div class="token-list-item" onclick="selectToken(${i})">
      <div class="tl-icon" style="background:${t.color}">${t.symbol[0]}</div>
      <div><div class="tl-name">${t.name}</div><div class="tl-symbol">${t.symbol}</div></div>
      <div class="tl-balance">${t.balance.toLocaleString()}</div>
    </div>`).join('');
}

function filterTokenList(v) { renderTokenList(v); }

function selectToken(idx) {
  if (tokenSelectTarget === 'from') { swapFrom = idx; if (swapTo === idx) swapTo = (idx+1) % TOKENS.length; }
  else { swapTo = idx; if (swapFrom === idx) swapFrom = (idx+1) % TOKENS.length; }
  updateSwapTokenDisplay();
  calcSwap();
  closeModal('tokenSelectModal');
}

function setSlippage(val) {
  currentSlippage = parseFloat(val) || 0.5;
  document.getElementById('slippageVal').textContent = currentSlippage + '%';
  document.querySelectorAll('.slip-btn').forEach(b => b.classList.remove('active'));
  calcSwap();
}

function renderMarkets() {
  document.getElementById('marketList').innerHTML = TOKENS.map(t => `
    <div class="market-item">
      <div class="market-token">
        <div class="market-token-icon" style="background:${t.color}">${t.symbol[0]}</div>
        <div><strong>${t.symbol}</strong><br><span style="font-size:12px;color:var(--text2)">${t.name}</span></div>
      </div>
      <div class="market-price">$${t.price < 1 ? t.price.toFixed(4) : t.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="market-change ${t.change >= 0 ? 'green' : 'red'}">${t.change >= 0 ? '+' : ''}${t.change}%</div>
    </div>
  `).join('');
}

// ============================================================
// CONNECT WALLET (UI Only)
// ============================================================
function connectWallet(type) {
  closeModal('walletModal');
  if (type === 'WalletConnect') {
    connectWeb3('walletconnect');
  } else {
    connectWeb3('injected');
  }
}

// ============================================================
// NFTs
// ============================================================
function renderNFTs(cat='all') {
  const filtered = cat === 'all' ? NFTS : NFTS.filter(n => n.cat === cat);
  document.getElementById('nftGrid').innerHTML = filtered.map(n => `
    <div class="nft-card" onclick="openNFTDetail(${n.id})">
      <div class="nft-image"><div style="background:linear-gradient(135deg,${n.colors[0]},${n.colors[1]});display:flex;align-items:center;justify-content:center;font-size:48px;color:rgba(255,255,255,.15);font-weight:700">${n.name.match(/\d+/) ? '#'+n.name.match(/\d+/)[0] : '◆'}</div></div>
      <div class="nft-info">
        <div class="nft-collection-name">${n.collection}</div>
        <div class="nft-name">${n.name}</div>
        <div class="nft-price-row">
          <span class="nft-price">${n.price}</span>
          <span class="nft-likes">♥ ${n.likes}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCollections() {
  document.getElementById('collectionsBar').innerHTML = COLLECTIONS.map(c => `
    <div class="collection-card">
      <div class="collection-avatar"><div style="background:${c.color};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#000;border-radius:50%">${c.name[0]}</div></div>
      <h4>${c.name}</h4>
      <div class="floor">Floor: ${c.floor} · ${c.items} items</div>
    </div>
  `).join('');
}

function filterNFTCat(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderNFTs(cat);
}

function filterNFTs(q) {
  const filtered = NFTS.filter(n => n.name.toLowerCase().includes(q.toLowerCase()) || n.collection.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('nftGrid').innerHTML = filtered.map(n => `
    <div class="nft-card" onclick="openNFTDetail(${n.id})">
      <div class="nft-image"><div style="background:linear-gradient(135deg,${n.colors[0]},${n.colors[1]});display:flex;align-items:center;justify-content:center;font-size:48px;color:rgba(255,255,255,.15);font-weight:700">${n.name.match(/\d+/) ? '#'+n.name.match(/\d+/)[0] : '◆'}</div></div>
      <div class="nft-info">
        <div class="nft-collection-name">${n.collection}</div>
        <div class="nft-name">${n.name}</div>
        <div class="nft-price-row">
          <span class="nft-price">${n.price}</span>
          <span class="nft-likes">♥ ${n.likes}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openNFTDetail(id) {
  const n = NFTS.find(x => x.id === id);
  if (!n) return;
  document.getElementById('nftDetailTitle').textContent = n.name;
  document.getElementById('nftDetailBody').innerHTML = `
    <div class="nft-detail-image"><div style="background:linear-gradient(135deg,${n.colors[0]},${n.colors[1]});width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;color:rgba(255,255,255,.12);font-weight:700">${n.name.match(/\d+/) ? '#'+n.name.match(/\d+/)[0] : '◆'}</div></div>
    <div class="nft-detail-info">
      <div class="nft-collection-name">${n.collection}</div>
      <div class="nft-detail-price">${n.price}</div>
      <div class="nft-detail-creator">Creator: ${n.creator}</div>
      <div class="nft-detail-desc">${n.desc || 'A unique digital collectible on the Expanse blockchain. One of a kind.'}</div>
      <div style="display:flex;gap:16px;font-size:14px;color:var(--text2)">
        <span>♥ ${n.likes} likes</span>
        <span>👁 ${Math.floor(n.likes * 3.2)} views</span>
      </div>
      <div class="nft-bid-input">
        <input type="number" placeholder="Your bid in EXP">
        <button class="btn-primary" onclick="openModal('walletModal')">Place Bid</button>
      </div>
      <div class="nft-detail-actions">
        <button class="btn-primary" onclick="openModal('walletModal')">Buy Now</button>
        <button class="btn-secondary" onclick="showToast('Added to watchlist')">♥ Favorite</button>
      </div>
    </div>
  `;
  openModal('nftDetailModal');
}

// ============================================================
// DAOs
// ============================================================
function renderDAOs() {
  document.getElementById('daoGrid').innerHTML = DAOS.map(d => `
    <div class="dao-card" onclick="openDAO(${d.id})">
      <div class="dao-card-header">
        <div class="dao-icon" style="background:${d.color}20">${d.icon}</div>
        <div><h3>${d.name}</h3></div>
      </div>
      <div class="dao-desc">${d.desc}</div>
      <div class="dao-stats">
        <div class="dao-stat"><div class="val">${d.members.toLocaleString()}</div><div class="lbl">Members</div></div>
        <div class="dao-stat"><div class="val">${d.proposals}</div><div class="lbl">Proposals</div></div>
        <div class="dao-stat"><div class="val">${d.treasury}</div><div class="lbl">Treasury</div></div>
      </div>
    </div>
  `).join('');
}

function openDAO(id) {
  const d = DAOS.find(x => x.id === id);
  if (!d) return;
  document.getElementById('daoGrid').style.display = 'none';
  const detail = document.getElementById('daoDetail');
  detail.style.display = '';
  document.getElementById('daoDetailHeader').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px">
      <div class="dao-icon" style="background:${d.color}20;font-size:32px">${d.icon}</div>
      <div>
        <h2>${d.name}</h2>
        <p style="color:var(--text2);margin-top:4px">${d.desc}</p>
        <div class="dao-stats" style="margin-top:12px">
          <div class="dao-stat"><div class="val">${d.members.toLocaleString()}</div><div class="lbl">Members</div></div>
          <div class="dao-stat"><div class="val">${d.proposals}</div><div class="lbl">Proposals</div></div>
          <div class="dao-stat"><div class="val">${d.treasury}</div><div class="lbl">Treasury</div></div>
        </div>
      </div>
    </div>
  `;
  // Proposals
  const props = PROPOSALS[id] || [];
  document.getElementById('daoProposals').innerHTML = '<h3 style="margin-bottom:16px">Proposals</h3>' + props.map(p => `
    <div class="proposal">
      <div class="proposal-header">
        <div><h4>${p.title}</h4></div>
        <span class="proposal-status ${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}${p.ends ? ' · '+p.ends+' left' : ''}</span>
      </div>
      <p>${p.desc}</p>
      <div class="vote-bars">
        <div class="vote-bar-row"><div class="vote-bar-label"><span>For</span><span>${p.forPct}%</span></div><div class="vote-bar"><div class="vote-bar-fill for" style="width:${p.forPct}%"></div></div></div>
        <div class="vote-bar-row"><div class="vote-bar-label"><span>Against</span><span>${p.againstPct}%</span></div><div class="vote-bar"><div class="vote-bar-fill against" style="width:${p.againstPct}%"></div></div></div>
        <div class="vote-bar-row"><div class="vote-bar-label"><span>Abstain</span><span>${p.abstainPct}%</span></div><div class="vote-bar"><div class="vote-bar-fill abstain" style="width:${p.abstainPct}%"></div></div></div>
      </div>
      <div style="font-size:13px;color:var(--text2)">${p.votes.toLocaleString()} votes</div>
      ${p.status === 'active' ? '<div class="proposal-actions"><button class="btn-primary" onclick="openModal(\'voteModal\')">Vote</button></div>' : ''}
    </div>
  `).join('');
  // Treasury
  document.getElementById('daoTreasury').textContent = d.treasury;
  document.getElementById('daoTreasuryTokens').innerHTML = d.tokens.map(t => `<div style="padding:4px 0">${t.amount} ${t.symbol}</div>`).join('');
  // Members
  document.getElementById('daoMembers').innerHTML = MEMBERS.map(m => `
    <div class="member">
      <div class="member-avatar" style="background:var(--bg)">${m.emoji}</div>
      <div><strong>${m.name}</strong><div class="member-addr">${m.addr}</div></div>
    </div>
  `).join('');
}

function closeDaoDetail() {
  document.getElementById('daoDetail').style.display = 'none';
  document.getElementById('daoGrid').style.display = '';
}

function castVote(choice) {
  closeModal('voteModal');
  showToast(`Vote cast: ${choice}. Connect wallet to confirm on-chain.`);
}

// DAO Wizard
function wizardNext(step) {
  document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('wizStep' + step).classList.add('active');
  document.querySelectorAll('.wizard-step').forEach((s,i) => {
    s.classList.toggle('active', i < step);
  });
}

// ============================================================
// STAKING
// ============================================================
function renderStakingPools() {
  document.getElementById('stakingPools').innerHTML = STAKING_POOLS.map((p,i) => `
    <div class="pool-card">
      <div class="pool-header">
        <div class="pool-tokens">
          <div class="pool-token-icons">${p.tokens.map((t,j) => `<span style="background:${p.colors[j]}">${t[0]}</span>`).join('')}</div>
          <div><strong>${p.tokens.join(' / ')}</strong><br><span style="font-size:13px;color:var(--text2)">Earn ${p.rewards}</span></div>
        </div>
        <div class="pool-apy"><div class="apy-val">${p.apy}%</div><div class="apy-label">APY</div></div>
      </div>
      <div class="pool-details">
        <div class="pool-detail"><div class="pdl">TVL</div><div class="pdv">${p.tvl}</div></div>
        <div class="pool-detail"><div class="pdl">Total Staked</div><div class="pdv">${p.staked}</div></div>
      </div>
      <div class="calculator">
        <div class="calc-row"><span>If you stake 10,000 ${p.tokens[0]}</span></div>
        <div class="calc-row"><span>Daily</span><span class="green">${(10000 * p.apy / 100 / 365).toFixed(2)} ${p.tokens[0]}</span></div>
        <div class="calc-row"><span>Monthly</span><span class="green">${(10000 * p.apy / 100 / 12).toFixed(2)} ${p.tokens[0]}</span></div>
        <div class="calc-row"><span>Yearly</span><span class="green">${(10000 * p.apy / 100).toFixed(2)} ${p.tokens[0]}</span></div>
      </div>
      <div class="pool-input">
        <input type="number" placeholder="Amount to stake">
        <button class="btn-primary" onclick="openModal('walletModal')">Stake</button>
      </div>
      <div class="pool-actions">
        <button class="btn-secondary" onclick="openModal('walletModal')">Unstake</button>
        <button class="btn-primary" onclick="openModal('walletModal')">Claim Rewards</button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// PORTFOLIO
// ============================================================
function renderPortfolio() {
  // Token balances
  document.getElementById('tokenBalances').innerHTML = TOKENS.map(t => {
    const val = t.balance * t.price;
    return `<div class="token-row">
      <div class="token-info">
        <div class="token-info-icon" style="background:${t.color}">${t.symbol[0]}</div>
        <div><div class="token-info-name">${t.name}</div><div class="token-info-symbol">${t.symbol}</div></div>
      </div>
      <span>${t.balance.toLocaleString()}</span>
      <span>$${t.price < 1 ? t.price.toFixed(4) : t.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      <span>$${val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      <span class="${t.change >= 0 ? 'green' : 'red'}">${t.change >= 0 ? '+' : ''}${t.change}%</span>
    </div>`;
  }).join('');

  // Transactions
  document.getElementById('txList').innerHTML = TRANSACTIONS.map(tx => `
    <div class="tx-item">
      <div class="tx-icon" style="background:${tx.color}15">${tx.icon}</div>
      <div class="tx-info"><div class="tx-type">${tx.type}</div><div class="tx-detail">${tx.detail}</div></div>
      <div class="tx-amount">${tx.amount}</div>
      <div class="tx-time">${tx.time}</div>
    </div>
  `).join('');
}

// ============================================================
// CHART (Simple Canvas)
// ============================================================
function renderChart() {
  const canvas = document.getElementById('portfolioChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth - 40;
  const h = canvas.height = 200;
  
  // Generate smooth fake data
  const points = 60;
  const data = [];
  let val = 20000;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.42) * 400;
    val = Math.max(18000, Math.min(26000, val));
    data.push(val);
  }
  
  const min = Math.min(...data) * 0.98;
  const max = Math.max(...data) * 1.02;
  const stepX = w / (points - 1);
  
  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0,255,136,0.15)');
  grad.addColorStop(1, 'rgba(0,255,136,0)');
  
  ctx.beginPath();
  ctx.moveTo(0, h);
  data.forEach((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * h;
    if (i === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  
  // Line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Dot at end
  const lastX = (points-1) * stepX;
  const lastY = h - ((data[points-1] - min) / (max - min)) * h;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI*2);
  ctx.fillStyle = '#00ff88';
  ctx.fill();
}

// Resize chart
window.addEventListener('resize', renderChart);

// Chart tab switching
document.querySelectorAll('.chart-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderChart();
  });
});
