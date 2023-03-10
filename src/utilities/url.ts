export class Url {
  /**
   * Verfies a url ends in a slash and adds one if not
   *
   * @param {string} url url to check
   * @returns {string} url with trailing slash
   */
  static trimTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  }

  static isValidUrl(urlString: string, acceptHttp = false): boolean {
    try {
      const url = new URL(urlString);
      return acceptHttp ? url.protocol === 'https:' || url.protocol === 'http:' : url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

export default Url;
