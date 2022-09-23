export default {
  getUrlParam(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    if (window.location.hash.indexOf('?') > -1) {
      r = window.location.hash.split('?')[1].match(reg);
    }
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
  },
  getBrowser() {
    let browser = 'unknown';
    let ua = window.navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
      browser = 'wechat';
    }
    return browser;
  }
};

export function padStart<T>(
  collection: T[],
  length: number = collection.length,
  item: T = null
): T[] {
  if (collection.length >= length) {
    return collection.slice(-length);
  }

  const padding = new Array(length - collection.length).fill(item);
  return padding.concat(collection);
}
