import { TokenResponse } from '../types';
import Logger from './logger';

export class BrowserUrlManager {
  private readonly logger: Logger;
  private hashParams: URLSearchParams;
  private searchParams: URLSearchParams;

  constructor(logger: Logger) {
    this.logger = logger;

    const hashFragment = window?.location?.hash;
    const searchFragment = window?.location?.search;

    if (hashFragment) {
      this.hashParams = new URLSearchParams(hashFragment.charAt(0) === '#' ? hashFragment.substring(1) : hashFragment);
    } else {
      this.hashParams = new URLSearchParams();
    }

    if (searchFragment) {
      this.searchParams = new URLSearchParams(searchFragment);
    } else {
      this.searchParams = new URLSearchParams();
    }
  }

  get tokenReady(): boolean {
    return this.hashParams?.has('access_token') || this.searchParams?.has('code');
  }

  checkUrlForCode(): string {
    if (this.searchParams.has('code')) {
      const code = this.searchParams.get('code');

      this.logger.info('BrowserUrlManager', 'found an auth code in the url', code);

      this.searchParams.delete('code');

      const query = this.searchParams.toString();
      const queryStr = query ? `?${query}` : '';

      // Remove code from URL
      window.history.replaceState(null, null, window.location.pathname + queryStr + window.location.hash);

      return code;
    }

    return '';
  }

  checkUrlForToken(): TokenResponse {
    if (this.hashParams.has('access_token')) {
      const token: TokenResponse = {
        access_token: this.hashParams.get('access_token'),
        expires_in: +this.hashParams.get('expires_in'),
        scope: this.hashParams.get('scope'),
        token_type: this.hashParams.get('token_type'),
        id_token: this.hashParams.get('id_token'),
      };

      this.logger.info('BrowserUrlManager', 'found an access token in the url', token);

      // Get rid of hash, so token isn't displayed in browser URL
      window.history.replaceState(null, null, window.location.pathname + window.location.search);

      this.hashParams = new URLSearchParams();

      return token;
    }

    return null;
  }

  navigate(url: string) {
    window.location.assign(url);
  }
}

export default BrowserUrlManager;
