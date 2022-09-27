import axios from 'axios';
import * as fs from 'fs';
import { program as commander } from 'commander';

export class SessionGenerator {
  private defaultXsrfToken = 'defaultToken';
  fetchCookies(userId: string): void {
    const params = {
      headers: {
        'Content-Type': 'application/json'
      },
      discardResponseBodies: false,
      redirect: 0
    };
    axios.get('./user?userId=' + userId, params)
      .then((res) => {
        if (res.request) {
          let authCookies = res.data.DATA.isamSession;
          const xsrfToken = this.extractXsrfToken(authCookies);
          if (xsrfToken === this.defaultXsrfToken) {
            authCookies = this.addCookie(authCookies, 'XSRF-TOKEN=' + xsrfToken);
          }
          const outFile = this.prepareProxyFile(authCookies, xsrfToken);
          this.writeProxyFile(outFile);
        }
      }).catch((err) => {
        console.log(err);
    });
  }
  writeProxyFile(file: string): void {
    fs.writeFile('test-proxy.json', file, function(err) => {
      if (err) return console.log(err);
       console.log('Proxy file generated with cookies');
    });
  }
  prepareProxyFile(cookies: string, xsrfToken: string): string {
    return `
    {
      "/api": {
         "target": "https://vanntechs.com/api/user",
         "pathRewrite": {
           "^/api/user": "/api/"
      },
      "headers": {
         "Accept": "application/json, text/plain, */*",
         "Accept-Encoding": "gzip, deflate, br",
         "Accept-Language": "en-US,en;q=0.9",
         "X-XSRF-TOKEN": "` + xsrfToken + `",
         "Cookies": "` + cookies + `"
      },
      "logLevel": "debug",
      "secure": "false"
    },
     "/legacy/app": {
        "target": "https://vanntechs.com",
        "headers": {
           "Accept": "application/json, text/plain, */*",
           "Accept-Encoding": "gzip, deflate, br",
           "Accept-Language": "en-US,en;q=0.9",
           "X-XSRF-TOKEN": "\` + xsrfToken + \`",
           "Cookies": "\` + cookies + \`"
        },
        'logLevel': 'debug',
        "secure": false
     }
    `
  }
  addCookie(existingCookies: string, newCookie: string): string {
    return existingCookies + ';' + newCookie;
  }
  extractXsrfToken(cookieString: string): string {
    const splitCookies = cookieString.split('XSRF-TOKEN=')[1];
    return splitCookies ? splitCookies.split(';')[0]: this.defaultXsrfToken;
  }
}
commander.option('-c, --userId <number>', 'userId to login');
commander.parse(process.argv)
const options = commander.opts();

const session = new SessionGenerator();
session.fetchCookies(options.userId);
