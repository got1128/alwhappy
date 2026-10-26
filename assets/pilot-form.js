// Pilot profile form on the "For Pilots" page.
// Submitting creates a Supabase account; the profile travels as signup metadata and a
// database trigger stores it in pilot_profiles with status "pending" (see supabase/schema.sql).
(() => {
  const form = document.querySelector('.pilot-profile .profile-form');
  if (!form) return;

  // Airline experience: add a blank row copied from the first one.
  const experienceRows = form.querySelector('.airline-experience-table tbody');
  const addRowButton = form.querySelector('.add-airline-row');
  if (experienceRows && addRowButton) {
    const template = experienceRows.querySelector('tr').cloneNode(true);
    template.querySelectorAll('input').forEach((input) => (input.value = ''));
    template.querySelectorAll('select').forEach((select) => (select.selectedIndex = 0));
    addRowButton.addEventListener('click', () => experienceRows.append(template.cloneNode(true)));
  }

  const status = form.querySelector('.profile-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const client = window.alwaysHappyClient;

  const value = (name) => (form.elements[name]?.value || '').trim();

  const collectProfile = () => {
    const rows = [...experienceRows.querySelectorAll('tr')];
    return {
      name_chinese: value('name-chinese'),
      name_english: value('name-english'),
      phone: value('phone'),
      location: value('location'),
      nationality: value('nationality'),
      contact_time: value('contact-time'),
      experiences: rows.map((row) => ({
        company: row.querySelector('[name="airline-company"]').value.trim(),
        role: row.querySelector('[name="airline-role"]').value.trim(),
        period: row.querySelector('[name="airline-period"]').value.trim(),
        status: row.querySelector('[name="airline-status"]').value,
      })),
      licence: value('licence'),
      licence_country: value('licence-country'),
      aircraft_types: value('aircraft-types'),
      type_rating: value('type-rating'),
      total_hours: value('total-hours'),
      pic_hours: value('pic-hours'),
      english: value('english'),
      target_location: value('target-location'),
      work_type: value('work-type'),
      availability: value('availability'),
      notes: value('notes'),
    };
  };

  const errorMessage = (error) => {
    if (error.status === 429) return '目前送出次數過多，請稍後再試。';
    if (/password/i.test(error.message)) return '密碼強度不足，請使用至少 8 個字元，並混合英文與數字。';
    if (/email/i.test(error.message)) return 'Email 格式不正確，請再確認。';
    return '送出失敗，請稍後再試，或聯絡 Always Happy。';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (value('password') !== value('password-confirm')) {
      status.textContent = '兩次輸入的密碼不一致。';
      form.elements['password-confirm'].focus();
      return;
    }
    if (!client) {
      status.textContent = '系統暫時無法連線，請稍後再試。';
      return;
    }

    submitButton.disabled = true;
    status.textContent = '資料送出中…';
    const { data, error } = await client.auth.signUp({
      email: value('email'),
      password: value('password'),
      options: {
        emailRedirectTo: new URL('../member/index.html', location.href).href,
        data: { pilot_profile: collectProfile() },
      },
    });
    submitButton.disabled = false;

    if (error) {
      status.textContent = errorMessage(error);
      return;
    }
    // With email confirmation on, an existing address comes back as a user with no identities.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      status.textContent = '這個 Email 已經註冊過，請直接登入會員專區。';
      return;
    }
    form.reset();
    status.textContent = '已送出！請到信箱點擊驗證連結；Always Happy 審核通過後，即可登入會員專區查看你的資料。';
  });
})();
