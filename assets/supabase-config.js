// Supabase connection for the public site.
// The publishable key is safe in the browser; access is limited by Row Level Security.
// Never put the secret / service_role key in this file.
window.ALWAYS_HAPPY_SUPABASE = {
  url: 'https://kfhnwmskyayztkqjsvlx.supabase.co',
  key: 'sb_publishable_1CEwjTXuuqmgdXjFTtmW6Q_BtTlHJ_O',
};

// One shared client per page (header, forms and member area all use it).
window.alwaysHappyClient = window.supabase
  ? window.supabase.createClient(window.ALWAYS_HAPPY_SUPABASE.url, window.ALWAYS_HAPPY_SUPABASE.key)
  : null;
