// Member area: sign in, then show the pilot's own profile once a reviewer has approved it.
(() => {
  const loginSection = document.getElementById('member-login');
  const panel = document.getElementById('member-panel');
  if (!loginSection || !panel) return;

  const loginForm = loginSection.querySelector('form');
  const loginStatus = loginSection.querySelector('.profile-status');
  const emailLabel = document.getElementById('member-email');
  const stateText = document.getElementById('member-state');
  const details = document.getElementById('member-details');

  const client = window.alwaysHappyClient;
  if (!client) {
    loginStatus.textContent = '系統暫時無法連線，請稍後再試。';
    return;
  }

  const STATE_TEXT = {
    pending: '你的資料已送出，Always Happy 正在審核中。審核通過後，這裡會顯示你的完整會員資料。',
    rejected: '你的資料目前未通過審核。如有疑問，請聯絡 Always Happy。',
    approved: '審核已通過，以下是你的會員資料。',
  };

  const { render: renderProfile, el } = window.AlwaysHappyProfileView;

  const showProfile = async (user) => {
    loginSection.hidden = true;
    panel.hidden = false;
    emailLabel.textContent = user.email;
    details.hidden = true;
    details.replaceChildren();
    stateText.textContent = '讀取中…';

    const { data: profile, error } = await client.from('pilot_profiles').select('*').eq('id', user.id).maybeSingle();
    if (error) {
      stateText.textContent = '讀取資料失敗，請稍後再試。';
      return;
    }
    if (!profile) {
      stateText.textContent = '找不到你的機師資料。如果你是透過其他方式註冊，請聯絡 Always Happy。';
      return;
    }
    stateText.dataset.state = profile.status;
    stateText.textContent = STATE_TEXT[profile.status] || '';
    if (profile.review_note) stateText.append(el('span', 'member-note', `審核備註：${profile.review_note}`));
    if (profile.status !== 'approved') return;

    details.append(...renderProfile(profile));
    details.hidden = false;
  };

  const showLogin = () => {
    panel.hidden = true;
    loginSection.hidden = false;
  };

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
    if (!error) {
      loginStatus.textContent = '';
      loginForm.reset();
      return; // onAuthStateChange shows the profile
    }
    loginStatus.textContent = /confirm/i.test(error.message)
      ? '請先到信箱點擊驗證連結，完成 Email 驗證後再登入。'
      : 'Email 或密碼不正確。';
  });

  document.getElementById('member-logout').addEventListener('click', () => client.auth.signOut());

  // Fires on page load (INITIAL_SESSION), after login, after the email verification link, and on logout.
  // Defer the query so it doesn't run inside the auth callback.
  client.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => (session ? showProfile(session.user) : showLogin()), 0);
  });
})();
