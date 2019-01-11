export let config = {
  // Dev local env
  serverURL: "http://localhost:1117/parse",
  appId: 'TripleLId',

  // Dev remote env
  // serverURL: "https://chisel-parse-server.herokuapp.com/parse",
  // appId: 'SampleAppId',

  // Dev remote old env
  // serverURL: "https://pg-app-mjx6kfptatphej7zd7ccy9ctlkdtix.scalabl.cloud/1/",
  // appId: "7d52447901ab6b8b91e3f2e846256184",

  // Prod env
  // serverURL: "http://dockerhost.forge-parse-server.c66.me:99/parse",
  // appId: "7d52447901ab6b8b91e3f2e846256184"
};

export const FILE_SIZE_MAX = 10 * 1024 * 1024;
