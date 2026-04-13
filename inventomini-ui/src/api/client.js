const BASE = '/api'

const getAuthHeader = () => {
  const creds = sessionStorage.getItem('inventomini_auth')
  return creds ? { Authorization: 'Basic ' + creds } : {}
}

const api = {
  get: (url) =>
    fetch(BASE + url, { headers: { ...getAuthHeader() } }).then((r) => r.json()),

  post: (url, body) =>
    fetch(BASE + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  put: (url, body) =>
    fetch(BASE + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  del: (url) =>
    fetch(BASE + url, { method: 'DELETE', headers: { ...getAuthHeader() } }),

  download: (url, filename) =>
    fetch(BASE + url, { headers: { ...getAuthHeader() } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
      }),

  verify: (username, password) => {
    const encoded = btoa(username + ':' + password)
    return fetch(BASE + '/products', {
      headers: { Authorization: 'Basic ' + encoded },
    }).then((r) => ({ ok: r.ok, encoded }))
  },
}

export default api
