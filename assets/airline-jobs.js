// Member job listings on the "For Airlines" page.
// The jobs table is protected by RLS: only approved members get rows back (see supabase/jobs.sql).
(() => {
  const section = document.querySelector('[data-airline-jobs]');
  const client = window.alwaysHappyClient;
  if (!section || !client) return;

  const stateText = section.querySelector('[data-jobs-state]');
  const loginLink = section.querySelector('[data-jobs-login]');
  const list = section.querySelector('[data-jobs-list]');

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const showMessage = (text, { login = false } = {}) => {
    stateText.textContent = text;
    stateText.hidden = false;
    loginLink.hidden = !login;
    list.hidden = true;
    list.replaceChildren();
  };

  const renderJob = (job) => {
    const card = el('article', 'job-card');
    card.append(el('h4', '', job.title));
    if (job.airline) card.append(el('p', 'job-card__airline', job.airline));

    const tags = el('div', 'job-card__tags');
    [job.aircraft, job.base, job.employment_type].filter(Boolean).forEach((tag) => tags.append(el('span', '', tag)));
    card.append(tags);

    const facts = el('dl', 'job-card__facts');
    [['資格條件', job.requirements], ['待遇與福利', job.benefits], ['聯絡人', job.contact_name], ['聯絡方式', job.contact_info]]
      .filter(([, value]) => value)
      .forEach(([label, value]) => {
        const item = el('div');
        item.append(el('dt', '', label), el('dd', '', value));
        facts.append(item);
      });
    card.append(facts);
    return card;
  };

  const loadJobs = async (user) => {
    showMessage('職缺讀取中…');
    const { data: profile } = await client.from('pilot_profiles').select('status').eq('id', user.id).maybeSingle();
    if (!profile || profile.status !== 'approved') {
      showMessage(
        profile && profile.status === 'pending'
          ? '你的會員資料審核中，審核通過後即可在這裡查看職缺。'
          : '會員資料審核通過後，即可查看職缺。',
      );
      return;
    }

    const { data: jobs, error } = await client
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      showMessage('職缺讀取失敗，請稍後再試。');
      return;
    }
    if (!jobs.length) {
      showMessage('目前沒有開放中的職缺，有新職缺時會在這裡更新。');
      return;
    }

    stateText.hidden = true;
    loginLink.hidden = true;
    list.replaceChildren(...jobs.map(renderJob));
    list.hidden = false;
  };

  // Defer the query so it doesn't run inside the auth callback.
  client.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      if (session) loadJobs(session.user);
      else showMessage('登入會員並通過審核後，即可查看職缺詳情。', { login: true });
    }, 0);
  });
})();
