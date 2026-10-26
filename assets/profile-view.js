// Read-only rendering of a pilot profile, shared by the member area and the admin review page.
// Everything is written with textContent, so form input is never interpreted as HTML.
window.AlwaysHappyProfileView = (() => {
  const GROUPS = [
    ['基本資料', [
      ['中文姓名', 'name_chinese'], ['英文姓名', 'name_english'], ['Email', 'email'], ['電話', 'phone'],
      ['目前所在國家／城市', 'location'], ['國籍', 'nationality'], ['方便聯絡時段', 'contact_time'],
    ]],
    ['執照、機型與飛行時數', [
      ['持有執照', 'licence'], ['執照簽發國家', 'licence_country'], ['曾飛行機型', 'aircraft_types'],
      ['是否持有 Type Rating', 'type_rating'], ['總飛行時數', 'total_hours'], ['PIC 時數', 'pic_hours'],
      ['英文能力', 'english'],
    ]],
    ['媒合偏好', [
      ['目標國家／基地', 'target_location'], ['可接受的工作型態', 'work_type'],
      ['可到職時間', 'availability'], ['補充說明', 'notes'],
    ]],
  ];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const renderGroup = (title, fields, profile) => {
    const group = el('section', 'member-group');
    group.append(el('h3', '', title));
    const list = el('dl');
    fields.forEach(([label, key]) => {
      const raw = profile[key];
      const item = el('div');
      item.append(el('dt', '', label), el('dd', '', raw === null || raw === undefined || raw === '' ? '—' : String(raw)));
      list.append(item);
    });
    group.append(list);
    return group;
  };

  const renderExperiences = (experiences) => {
    const group = el('section', 'member-group');
    group.append(el('h3', '', '航空公司經歷'));
    const rows = (Array.isArray(experiences) ? experiences : []).filter((row) => row.company || row.role || row.period);
    if (!rows.length) {
      group.append(el('p', '', '—'));
      return group;
    }
    const wrap = el('div', 'airline-experience-wrap');
    const table = el('table', 'airline-experience-table');
    const head = el('tr');
    ['航空公司', '職稱', '任職期間', '目前／曾任'].forEach((label) => head.append(el('th', '', label)));
    const thead = el('thead');
    thead.append(head);
    table.append(thead);
    const body = el('tbody');
    rows.forEach((row) => {
      const tr = el('tr');
      [row.company, row.role, row.period, row.status].forEach((cell) => tr.append(el('td', '', cell || '—')));
      body.append(tr);
    });
    table.append(body);
    wrap.append(table);
    group.append(wrap);
    return group;
  };

  // Returns the profile's sections as DOM nodes, in form order.
  const render = (profile) => [
    renderGroup(...GROUPS[0], profile),
    renderExperiences(profile.experiences),
    renderGroup(...GROUPS[1], profile),
    renderGroup(...GROUPS[2], profile),
  ];

  return { render, el };
})();
