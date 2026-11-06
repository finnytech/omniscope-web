const fs = require('fs');
let c = fs.readFileSync('D:/projects/omniscope-web/_worker.js', 'utf8');

// Fix handleWeather
c = c.replace(
  /\n\}\s*\n\s*\}\s*catch\s*\(weatherErr\)\s*\{([\s\S]*?timestamp:\s*new\s*Date\(\)\.toISOString\(\)\s*\}\s*,\s*200\s*\);\s*\}/,
  (match, p1) => `\n  } catch (weatherErr) {${p1}timestamp: new Date().toISOString()\n    }, 200);\n  }\n}`
);

// Fix handleStorms
c = c.replace(
  /\n\}\s*\n\s*\}\s*catch\s*\(err\)\s*\{([\s\S]*?tornado_ground_alerts:\s*\[\]\s*\}\s*,\s*200\s*\);\s*\}/,
  (match, p1) => `\n  } catch (err) {${p1}tornado_ground_alerts: []\n    }, 200);\n  }\n}`
);

// Fix handleSeismic
c = c.replace(
  /\n\}\s*\n\s*\}\s*catch\s*\(err\)\s*\{([\s\S]*?USGS Earthquake Hazards Program \(Fallback\)[\s\S]*?timestamp:\s*new\s*Date\(\)\.toISOString\(\)\s*\}\s*,\s*200\s*\);\s*\}/,
  (match, p1) => `\n  } catch (err) {${p1}timestamp: new Date().toISOString()\n    }, 200);\n  }\n}`
);

// Fix handleSpaceWeather
c = c.replace(
  /\n\}\s*\n\s*\}\s*catch\s*\(err\)\s*\{([\s\S]*?NOAA SWPC \(Fallback\)[\s\S]*?timestamp:\s*new\s*Date\(\)\.toISOString\(\)\s*\}\s*,\s*200\s*\);\s*\}/,
  (match, p1) => `\n  } catch (err) {${p1}timestamp: new Date().toISOString()\n    }, 200);\n  }\n}`
);

fs.writeFileSync('D:/projects/omniscope-web/_worker.js', c, 'utf8');
console.log('Fixed brace structure in all 4 handlers.');
