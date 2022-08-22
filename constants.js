export const GITHUB_URL = 'https://api.github.com/search/users';
export const AUTH_HEADERS = {
  method: 'GET',
  headers: new Headers({
    'Accept': 'application/vnd.github+json',
    'Authorization': 'token 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',
  }),
};
export const PRELOADER = `
  <div class="preloaderArea">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
`;
export const TITLE_OF_RANDOM_SEARCH_RESULTS = 'Random search results';
export const TITLE_OF_USER_SEARCH_RESULTS = 'Your search results';