module.exports = function(api) {
    const isProduction = api.env("production");
  
    const plugins = [];
  
    if (isProduction) {

      plugins.push("transform-remove-console");
    }
  
    return {
      presets: ["next/babel"], 
      plugins: plugins,
    };
  };
  