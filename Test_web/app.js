/* ── CONFIG ───────────────────────────────── */
var config = {
  app_title:       'Messenger',
  welcome_message: 'Welcome to Messenger',
  bg_color:        '#f1f5f9',
  surface_color:   '#ffffff',
  text_color:      '#1e293b',
  primary_color:   '#10b981',
  secondary_color: '#14b8a6'
};

/* ── CHAT DATA ────────────────────────────── */
var chats = [
  { id:1,  name:'Sarah Wilson',     avatar:'SW', color:'#ec4899', online:true,  last:"That sounds great! Let me know when you're free 😊", time:'2m ago',    unread:2, archived:false },
  { id:2,  name:'Tech Team',        avatar:'TT', color:'#8b5cf6', online:true,  last:'Mike: The deployment is complete ✅',                 time:'15m ago',   unread:0, archived:false },
  { id:3,  name:'James Cooper',     avatar:'JC', color:'#f59e0b', online:false, last:'See you tomorrow at the meeting',                    time:'1h ago',    unread:0, archived:false },
  { id:4,  name:'Design Squad',     avatar:'DS', color:'#06b6d4', online:true,  last:'Emily: Love the new mockups! 🎨',                    time:'3h ago',    unread:5, archived:false },
  { id:5,  name:'Mom ❤️',          avatar:'M',  color:'#ef4444', online:false, last:"Don't forget to call your grandmother",              time:'Yesterday', unread:1, archived:false },
  { id:6,  name:'Alex Martinez',    avatar:'AM', color:'#22c55e', online:true,  last:'Thanks for the help!',                              time:'Yesterday', unread:0, archived:false },
  { id:7,  name:'Book Club',        avatar:'BC', color:'#6366f1', online:false, last:'Next meeting is on Friday',                         time:'2d ago',    unread:0, archived:false },
  { id:8,  name:'David Chen',       avatar:'DC', color:'#f97316', online:true,  last:"Let's catch up soon!",                              time:'3d ago',    unread:0, archived:false },
  { id:9,  name:'Project Managers', avatar:'PM', color:'#8884d8', online:true,  last:'Meeting scheduled for Monday',                      time:'4d ago',    unread:3, archived:false },
  { id:10, name:'Lisa Anderson',    avatar:'LA', color:'#82ca9d', online:false, last:'Thanks for the recommendation!',                    time:'1w ago',    unread:0, archived:false },
  { id:11, name:'Startup Founders', avatar:'SF', color:'#ffc658', online:true,  last:'Exciting times ahead! 🚀',                          time:'1w ago',    unread:2, archived:false },
  { id:12, name:'Michael Brown',    avatar:'MB', color:'#ff7c7c', online:false, last:'Will update you by Friday',                         time:'1w ago',    unread:0, archived:false },
  { id:13, name:'Fitness Group',    avatar:'FG', color:'#95de64', online:true,  last:'New workout routine posted!',                       time:'2w ago',    unread:1, archived:false },
  { id:14, name:'Emma Johnson',     avatar:'EJ', color:'#b37feb', online:true,  last:'See you at the event!',                             time:'2w ago',    unread:0, archived:false },
  { id:15, name:'Travel Buddies',   avatar:'TB', color:'#36cfc9', online:false, last:'Planning next trip...',                             time:'2w ago',    unread:0, archived:false }
];

/* ── MESSAGES ─────────────────────────────── */
var messages = {
  1: [
    { text:'Hey! How are you doing?',                                              sent:false, time:'10:30 AM' },
    { text:"I'm doing great, thanks! Just finished that project we talked about.", sent:true,  time:'10:32 AM' },
    { text:"That's amazing! 🎉 I'd love to see it",                               sent:false, time:'10:33 AM' },
    { text:"Sure! I'll send you the link later today. Are you free for a quick call?", sent:true, time:'10:35 AM' },
    { text:"That sounds great! Let me know when you're free 😊",                   sent:false, time:'10:36 AM' }
  ],
  2: [
    { text:'Team, the new update is ready for testing',       sent:false, time:'9:00 AM' },
    { text:"Great work everyone! I'll start the QA process now.", sent:true, time:'9:15 AM' },
    { text:'Mike: The deployment is complete ✅',             sent:false, time:'9:45 AM' }
  ],
  3: [
    { text:'Hey James, are we still on for tomorrow?', sent:true,  time:'4:00 PM' },
    { text:'Yes! Conference room B at 2 PM',           sent:false, time:'4:30 PM' },
    { text:'See you tomorrow at the meeting',           sent:false, time:'4:31 PM' }
  ],
  4: [
    { text:'Just uploaded the new design files to Figma', sent:true,  time:'11:00 AM' },
    { text:'Emily: Love the new mockups! 🎨',             sent:false, time:'2:00 PM'  }
  ],
  5: [
    { text:'Hi sweetie! How was your day?',          sent:false, time:'Yesterday' },
    { text:'It was good, Mom! Very busy with work.', sent:true,  time:'Yesterday' },
    { text:"Don't forget to call your grandmother",  sent:false, time:'Yesterday' }
  ],
  6: [
    { text:'Hey Alex! Did you figure out that bug?',     sent:true,  time:'Yesterday' },
    { text:'Yes! It was a caching issue. Fixed it now.', sent:false, time:'Yesterday' },
    { text:'Thanks for the help!',                       sent:false, time:'Yesterday' }
  ],
  7: [
    { text:'What book are we reading next?',    sent:true,  time:'2d ago' },
    { text:'We voted for "Project Hail Mary"!', sent:false, time:'2d ago' },
    { text:'Next meeting is on Friday',          sent:false, time:'2d ago' }
  ]
};

/* ── STATE ────────────────────────────────── */
var activeChat  = null;
var darkMode    = false;
var showArchive = false;
var activeUser  = null;

/* ── HELPERS ──────────────────────────────── */

// shortcut for getElementById
function get(id) { return document.getElementById(id); }

// show / hide elements
function show(id) { get(id).classList.remove('hidden'); }
function hide(id) { get(id).classList.add('hidden'); }

// get current time as string e.g. "10:30 AM"
function getTime() {
  return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

// format phone number as (555) 000-0000
function formatPhone(val) {
  var d = val.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return '(' + d.slice(0,3) + ') ' + d.slice(3);
  return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6,10);
}

// find a chat object by id
function findChat(id) {
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].id === id) return chats[i];
  }
  return null;
}

/* ── RENDER CHAT LIST ─────────────────────── */
function renderChats(filter) {
  if (!filter) filter = '';
  var term = filter.toLowerCase();
  var html = '';
  var count = 0;

  for (var i = 0; i < chats.length; i++) {
    var c = chats[i];

    // skip if wrong tab or doesn't match search
    if (c.archived !== showArchive) continue;
    if (c.name.toLowerCase().indexOf(term) === -1 &&
        c.last.toLowerCase().indexOf(term) === -1) continue;

    count++;
    var activeCls    = activeChat === c.id ? 'bg-emerald-50 dark:bg-emerald-900/30' : '';
    var onlineDot    = c.online ? '<span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>' : '';
    var badge        = c.unread ? '<span class="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-emerald-500 rounded-full flex-shrink-0">' + c.unread + '</span>' : '';
    var archiveTip   = c.archived ? 'Unarchive' : 'Archive';

    html += '<div class="chat-item-container relative group">';

    // main chat button
    html += '<button onclick="openChat(' + c.id + ')" class="chat-item w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 ' + activeCls + '" aria-label="Chat with ' + c.name + '">';
    html +=   '<div class="relative flex-shrink-0">';
    html +=     '<div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style="background:' + c.color + '">' + c.avatar + '</div>';
    html +=     onlineDot;
    html +=   '</div>';
    html +=   '<div class="flex-1 min-w-0 text-left">';
    html +=     '<div class="flex items-center justify-between mb-1">';
    html +=       '<span class="font-semibold text-slate-800 dark:text-white truncate">' + c.name + '</span>';
    html +=       '<span class="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">' + c.time + '</span>';
    html +=     '</div>';
    html +=     '<div class="flex items-center justify-between">';
    html +=       '<p class="text-sm text-slate-500 dark:text-slate-400 truncate">' + c.last + '</p>';
    html +=       badge;
    html +=     '</div>';
    html +=   '</div>';
    html += '</button>';

    // archive button
    html += '<button onclick="toggleArchive(' + c.id + ')" class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all" title="' + archiveTip + '">';
    html +=   '<svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>';
    html += '</button>';

    html += '</div>';
  }

  // empty message
  if (count === 0) {
    html = '<div class="flex flex-col items-center justify-center p-8 text-center mt-8">'
         + '<svg class="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>'
         + '<p class="text-slate-500 dark:text-slate-400 text-sm">' + (showArchive ? 'No archived chats' : 'No conversations yet') + '</p>'
         + '</div>';
  }

  get('chat-list').innerHTML = html;
}

/* ── RENDER MESSAGES ──────────────────────── */
function renderMessages(chatId) {
  var list = messages[chatId] || [];
  var html = '';

  for (var i = 0; i < list.length; i++) {
    var m      = list[i];
    var align  = m.sent ? 'justify-end' : 'justify-start';
    var bubble = m.sent
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-md shadow-sm';
    var timeClr = m.sent ? 'text-emerald-100' : 'text-slate-400';

    html += '<div class="message-bubble flex ' + align + '">';
    html +=   '<div class="max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl ' + bubble + '">';
    html +=     '<p class="text-sm leading-relaxed">' + m.text + '</p>';
    html +=     '<p class="text-xs mt-1 ' + timeClr + ' text-right">' + m.time + '</p>';
    html +=   '</div>';
    html += '</div>';
  }

  get('msg-area').innerHTML = html;
  get('msg-area').scrollTop = get('msg-area').scrollHeight;
}

/* ── OPEN CHAT ────────────────────────────── */
function openChat(id) {
  activeChat = id;
  var c = findChat(id);
  if (!c) return;

  hide('empty-state');
  get('chat-view').classList.remove('hidden');
  get('chat-view').classList.add('flex');

  get('chat-avatar').style.background = c.color;
  get('chat-avatar').textContent       = c.avatar;
  get('chat-name').textContent         = c.name;
  get('chat-status').textContent       = c.online ? 'Online' : 'Offline';
  get('chat-status').className         = 'text-sm ' + (c.online ? 'text-emerald-500' : 'text-slate-400');

  c.unread = 0;
  renderMessages(id);
  renderChats(get('search-input').value);
  closeSidebar();
}

/* ── TOGGLE ARCHIVE ───────────────────────── */
function toggleArchive(id) {
  var c = findChat(id);
  if (!c) return;
  c.archived = !c.archived;

  if (activeChat === id && c.archived) {
    activeChat = null;
    get('chat-view').classList.add('hidden');
    get('chat-view').classList.remove('flex');
    show('empty-state');
  }
  renderChats(get('search-input').value);
}

/* ── SEND MESSAGE ─────────────────────────── */
function sendMessage(text) {
  if (!activeChat || !text.trim()) return;

  var msg = { text:text.trim(), sent:true, time:getTime() };
  if (!messages[activeChat]) messages[activeChat] = [];
  messages[activeChat].push(msg);

  var c = findChat(activeChat);
  if (c) { c.last = msg.text; c.time = 'Just now'; }

  renderMessages(activeChat);
  renderChats(get('search-input').value);
  fakeReply();
}

/* ── FAKE REPLY ───────────────────────────── */
function fakeReply() {
  var pool = [
    "That's interesting! Tell me more 🤔",
    'Sounds good to me! 👍',
    "I'll get back to you on that",
    "Great idea! Let's do it 🎉",
    'Thanks for letting me know!',
    'Perfect! See you then 😊'
  ];

  setTimeout(function() {
    show('typing');
    get('msg-area').scrollTop = get('msg-area').scrollHeight;
  }, 1000);

  setTimeout(function() {
    hide('typing');
    var reply = {
      text: pool[Math.floor(Math.random() * pool.length)],
      sent: false,
      time: getTime()
    };
    if (messages[activeChat]) {
      messages[activeChat].push(reply);
      var c = findChat(activeChat);
      if (c) { c.last = reply.text; c.time = 'Just now'; }
      renderMessages(activeChat);
      renderChats(get('search-input').value);
    }
  }, 2500);
}

/* ── SIDEBAR ──────────────────────────────── */
function openSidebar() {
  get('sidebar').classList.remove('-translate-x-full');
  show('sidebar-overlay');
}
function closeSidebar() {
  get('sidebar').classList.add('-translate-x-full');
  hide('sidebar-overlay');
}

/* ── OTP COUNTDOWN ────────────────────────── */
function startCountdown() {
  var t = 60;
  get('resend-btn').disabled = true;
  get('resend-btn').classList.add('opacity-50', 'cursor-not-allowed');
  get('resend-count').textContent = t;
  show('resend-panel');

  var interval = setInterval(function() {
    t--;
    get('resend-count').textContent = t;
    if (t === 0) {
      clearInterval(interval);
      get('resend-btn').disabled = false;
      get('resend-btn').classList.remove('opacity-50', 'cursor-not-allowed');
      hide('resend-panel');
    }
  }, 1000);
}

/* ── EVENT LISTENERS ──────────────────────── */

// Send message
get('msg-form').addEventListener('submit', function(e) {
  e.preventDefault();
  sendMessage(get('msg-input').value);
  get('msg-input').value = '';
  get('msg-input').style.height = '48px';
});

// Auto-grow textarea
get('msg-input').addEventListener('input', function() {
  this.style.height = '48px';
  this.style.height = Math.min(this.scrollHeight, 128) + 'px';
});

// Send on Enter key
get('msg-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(this.value);
    this.value = '';
    this.style.height = '48px';
  }
});

// Search
get('search-input').addEventListener('input', function() {
  renderChats(this.value);
});

// Dark mode
get('theme-btn').addEventListener('click', function() {
  darkMode = !darkMode;
  document.documentElement.classList.toggle('dark', darkMode);
});

// Mobile sidebar
get('menu-btn').addEventListener('click', openSidebar);
get('sidebar-overlay').addEventListener('click', closeSidebar);

// Back button
get('back-btn').addEventListener('click', function() {
  activeChat = null;
  get('chat-view').classList.add('hidden');
  get('chat-view').classList.remove('flex');
  show('empty-state');
  renderChats(get('search-input').value);
});

// Inbox tab
get('inbox-tab').addEventListener('click', function() {
  showArchive = false;
  get('inbox-tab').classList.add('bg-emerald-50', 'dark:bg-emerald-900/30', 'text-emerald-700', 'dark:text-emerald-400');
  get('inbox-tab').classList.remove('hover:bg-slate-100', 'dark:hover:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
  get('archive-tab').classList.add('hover:bg-slate-100', 'dark:hover:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
  get('archive-tab').classList.remove('bg-emerald-50', 'dark:bg-emerald-900/30', 'text-emerald-700', 'dark:text-emerald-400');
  renderChats(get('search-input').value);
});

// Archive tab
get('archive-tab').addEventListener('click', function() {
  showArchive = true;
  get('archive-tab').classList.add('bg-emerald-50', 'dark:bg-emerald-900/30', 'text-emerald-700', 'dark:text-emerald-400');
  get('archive-tab').classList.remove('hover:bg-slate-100', 'dark:hover:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
  get('inbox-tab').classList.add('hover:bg-slate-100', 'dark:hover:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
  get('inbox-tab').classList.remove('bg-emerald-50', 'dark:bg-emerald-900/30', 'text-emerald-700', 'dark:text-emerald-400');
  renderChats(get('search-input').value);
});

// Settings open / close
get('settings-btn').addEventListener('click', function() { show('settings-modal'); });
get('close-settings').addEventListener('click', function() { hide('settings-modal'); });
get('settings-modal').addEventListener('click', function(e) {
  if (e.target === get('settings-modal')) hide('settings-modal');
});

// Logout
get('logout-btn').addEventListener('click', function() {
  show('login-screen');
  hide('app-screen');
  activeUser = null;
  activeChat = null;
  show('empty-state');
  get('chat-view').classList.add('hidden');
  get('chat-view').classList.remove('flex');
  hide('settings-modal');
});

// Format phone as user types
get('phone-input').addEventListener('input', function() {
  this.value = formatPhone(this.value);
});

// Send OTP
get('send-otp-btn').addEventListener('click', function() {
  var digits = get('phone-input').value.replace(/\D/g, '');
  if (digits.length < 10) { alert('Please enter a valid phone number'); return; }
  hide('phone-form');
  show('otp-form');
  get('phone-display').textContent = '+1 ' + formatPhone(digits);
  get('otp-input').value = '';
  get('otp-input').focus();
  startCountdown();
});

// Back to phone form
get('back-phone-btn').addEventListener('click', function() {
  show('phone-form');
  hide('otp-form');
  get('phone-input').focus();
});

// Resend OTP
get('resend-btn').addEventListener('click', function() {
  get('otp-input').value = '';
  get('otp-input').focus();
  startCountdown();
});

// Verify OTP
get('verify-btn').addEventListener('click', function() {
  var otp = get('otp-input').value.trim();
  if (otp.length !== 6 || isNaN(otp)) { alert('Please enter a valid 6-digit code'); return; }
  var digits = get('phone-input').value.replace(/\D/g, '');
  activeUser = {
    id:    Math.random().toString(36).substr(2, 9),
    phone: '+1 ' + formatPhone(digits),
    name:  'User ' + digits.slice(-4)
  };
  hide('login-screen');
  show('app-screen');
  get('phone-input').value = '';
  get('otp-input').value   = '';
  show('phone-form');
  hide('otp-form');
  renderChats();
});

// OTP enter key
get('otp-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') get('verify-btn').click();
});

/* ── ELEMENT SDK ──────────────────────────── */
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig: config,
    onConfigChange: function(cfg) {
      get('app-title').textContent   = cfg.app_title       || config.app_title;
      get('welcome-msg').textContent = cfg.welcome_message  || config.welcome_message;
    },
    mapToCapabilities: function(cfg) {
      return {
        recolorables: [
          { get: function() { return cfg.bg_color        || config.bg_color; },        set: function(v) { cfg.bg_color = v;        window.elementSdk.setConfig({ bg_color: v }); } },
          { get: function() { return cfg.surface_color   || config.surface_color; },   set: function(v) { cfg.surface_color = v;   window.elementSdk.setConfig({ surface_color: v }); } },
          { get: function() { return cfg.text_color      || config.text_color; },      set: function(v) { cfg.text_color = v;      window.elementSdk.setConfig({ text_color: v }); } },
          { get: function() { return cfg.primary_color   || config.primary_color; },   set: function(v) { cfg.primary_color = v;   window.elementSdk.setConfig({ primary_color: v }); } },
          { get: function() { return cfg.secondary_color || config.secondary_color; }, set: function(v) { cfg.secondary_color = v; window.elementSdk.setConfig({ secondary_color: v }); } }
        ],
        borderables:  [],
        fontEditable: undefined,
        fontSizeable: undefined
      };
    },
    mapToEditPanelValues: function(cfg) {
      return new Map([
        ['app_title',       cfg.app_title       || config.app_title],
        ['welcome_message', cfg.welcome_message  || config.welcome_message]
      ]);
    }
  });
}

/* ── INIT ─────────────────────────────────── */
renderChats();
