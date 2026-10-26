// Admin review page: reviewers approve or reject pilot profiles.
// Access is enforced by RLS (see supabase/admin.sql); this page only reflects it.
(() => {
  const loginSection = document.getElementById('admin-login');
  const panel = document.getElementById('admin-panel');
  if (!loginSection || !panel) return;

  const loginForm = loginSection.querySelector('form');
  const loginStatus = loginSection.querySelector('.profile-status');
  const userLabel = document.getElementById('admin-user');
  const filters = document.getElementById('admin-filters');
  const message = document.getElementById('admin-message');
  const list = document.getElementById('admin-list');

  const client = window.alwaysHappyClient;
  if (!client) {
    loginStatus.textContent = '系統暫時無法連線，請稍後再試。';
    return;
  }
  const { render: renderProfile, el } = window.AlwaysHappyProfileView;

  const STATUS_LABEL = { pending: '待審核', approved: '已通過', rejected: '未通過' };
  let profiles = [];
  let filter = 'pending';

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short', hour12: false }) : '—';

  const displayName = (profile) =>
    [profile.name_chinese, profile.name_english].filter(Boolean).join(' / ') || profile.email;

  const renderItem = (profile) => {
    const item = el('details', 'admin-item');
    item.dataset.id = profile.id;

    const summary = el('summary');
    const who = el('div', 'admin-item__who');
    who.append(el('strong', '', displayName(profile)), el('span', '', profile.email));
    const meta = el('div', 'admin-item__meta');
    meta.append(
      el('span', '', `送出：${formatDate(profile.created_at)}`),
      el('span', `admin-badge admin-badge--${profile.status}`, STATUS_LABEL[profile.status] || profile.status),
    );
    summary.append(who, meta);
    item.append(summary);

    const body = el('div', 'admin-item__body');
    body.append(...renderProfile(profile));

    const review = el('section', 'member-group admin-review');
    review.append(el('h3', '', '審核'));
    if (profile.reviewed_at) review.append(el('p', 'admin-review__last', `上次審核：${formatDate(profile.reviewed_at)}（${STATUS_LABEL[profile.status]}）`));
    const noteLabel = el('label', 'admin-review__note', '審核備註（會顯示給機師）');
    const note = el('textarea');
    note.rows = 3;
    note.value = profile.review_note || '';
    note.placeholder = '例如：資料齊全，歡迎加入。／PIC 時數未達要求。';
    noteLabel.append(note);
    const actions = el('div', 'admin-review__actions');
    [['approved', '通過，成為會員'], ['rejected', '退回'], ['pending', '改回待審核']]
      .filter(([status]) => status !== profile.status)
      .forEach(([status, label]) => {
        const button = el('button', `admin-action admin-action--${status}`, label);
        button.type = 'button';
        button.addEventListener('click', () => reviewProfile(profile, status, note.value, button));
        actions.append(button);
      });
    review.append(noteLabel, actions);
    body.append(review);
    item.append(body);
    return item;
  };

  const renderList = () => {
    filters.querySelectorAll('[data-filter]').forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter)),
    );
    ['pending', 'approved', 'rejected'].forEach((status) => {
      filters.querySelector(`[data-count="${status}"]`).textContent = profiles.filter((p) => p.status === status).length;
    });
    filters.querySelector('[data-count="all"]').textContent = profiles.length;

    const shown = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter);
    list.replaceChildren(...shown.map(renderItem));
    if (!shown.length) list.append(el('p', 'admin-empty', '目前沒有符合的申請。'));
  };

  async function reviewProfile(profile, status, noteText, button) {
    const name = displayName(profile);
    if (!window.confirm(`確定要將「${name}」設為「${STATUS_LABEL[status]}」嗎？`)) return;
    button.disabled = true;
    const { data, error } = await client
      .from('pilot_profiles')
      .update({ status, review_note: noteText.trim() || null })
      .eq('id', profile.id)
      .select()
      .single();
    button.disabled = false;
    if (error) {
      message.textContent = `更新失敗：${error.message}`;
      return;
    }
    profiles = profiles.map((p) => (p.id === data.id ? data : p));
    message.textContent = `已將「${name}」設為「${STATUS_LABEL[status]}」。`;
    renderList();
  }

  const loadProfiles = async () => {
    message.textContent = '讀取中…';
    const { data, error } = await client.from('pilot_profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      message.textContent = '讀取申請資料失敗，請稍後再試。';
      return;
    }
    profiles = data;
    message.textContent = '';
    renderList();
  };

  const showPanel = async (user) => {
    loginSection.hidden = true;
    panel.hidden = false;
    list.replaceChildren();
    filters.hidden = true;
    message.textContent = '確認權限中…';

    const { data: reviewer } = await client.from('reviewers').select('name').eq('user_id', user.id).maybeSingle();
    if (!reviewer) {
      userLabel.textContent = user.email;
      message.textContent = `目前登入的是 ${user.email}，這個帳號沒有審核權限。請按右上角「登出」，再改用審核員帳號登入；如需開通，請聯絡網站管理員。`;
      return;
    }
    userLabel.textContent = `${reviewer.name}・${user.email}`;
    filters.hidden = false;
    await loadProfiles();
  };

  const showLogin = () => {
    panel.hidden = true;
    loginSection.hidden = false;
  };

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter;
    message.textContent = '';
    renderList();
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    loginStatus.textContent = '登入中…';
    const { error } = await client.auth.signInWithPassword({
      email: loginForm.elements.email.value.trim(),
      password: loginForm.elements.password.value,
    });
    button.disabled = false;
    loginStatus.textContent = error ? 'Email 或密碼不正確。' : '';
    if (!error) loginForm.reset();
  });

  document.getElementById('admin-logout').addEventListener('click', () => client.auth.signOut());

  // Defer the queries so they don't run inside the auth callback.
  client.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => (session ? showPanel(session.user) : showLogin()), 0);
  });
})();
