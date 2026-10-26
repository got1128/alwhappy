// Header login button on every page: "登入" when signed out, "會員專區" + "登出" when signed in.
// Without Supabase (e.g. CDN blocked) the button stays a plain link to the member page.
(() => {
  const client = window.alwaysHappyClient;
  const groups = document.querySelectorAll('[data-member-actions]');
  if (!client || !groups.length) return;

  const render = (signedIn) => {
    groups.forEach((group) => {
      group.classList.toggle('is-signed-in', signedIn);
      group.querySelector('[data-member-link]').textContent = signedIn ? '會員專區' : '登入';
      group.querySelector('[data-member-logout]').hidden = !signedIn;
    });
  };

  groups.forEach((group) =>
    group.querySelector('[data-member-logout]').addEventListener('click', () => client.auth.signOut()),
  );

  client.auth.onAuthStateChange((_event, session) => render(Boolean(session)));
})();
