module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-noclip`
  extends: ["noclip"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
