module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  if (api.env("production")) {
    plugins.push("transform-remove-console");
  }

  return {
    presets: ["next/babel"],
    plugins: plugins,
  };
};
