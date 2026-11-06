from pathlib import Path

file_path = Path("D:/projects/omniscope-web/_worker.js")
content = file_path.read_text(encoding="utf-8")

# 1. In handleWeather:
# Look for:
#   timestamp: new Date().toISOString()
#
# );
# } catch (weatherErr) {
# ...
#   timestamp: new Date().toISOString()
#   }, 200);
# }
#
# // ===== STORM CHASERS

target1_old = """    timestamp: new Date().toISOString()

  );
  } catch (weatherErr) {"""

target1_new = """    timestamp: new Date().toISOString()

  });
  } catch (weatherErr) {"""

if target1_old in content:
    content = content.replace(target1_old, target1_new)
    print("Fixed target 1a (}); in handleWeather)")
else:
    print("target1_old not found!")

target1_end_old = """      timestamp: new Date().toISOString()
    }, 200);
  }



// ===== STORM CHASERS"""

target1_end_new = """      timestamp: new Date().toISOString()
    }, 200);
  }
}



// ===== STORM CHASERS"""

if target1_end_old in content:
    content = content.replace(target1_end_old, target1_end_new)
    print("Fixed target 1b (closing brace in handleWeather)")
else:
    print("target1_end_old not found!")

# 2. In handleStorms:
target2_end_old = """      tornado_ground_alerts: []
    }, 200);
  }



async function handleSeismic"""

target2_end_new = """      tornado_ground_alerts: []
    }, 200);
  }
}



async function handleSeismic"""

if target2_end_old in content:
    content = content.replace(target2_end_old, target2_end_new)
    print("Fixed target 2 (closing brace in handleStorms)")
else:
    print("target2_end_old not found!")

# 3. In handleSeismic:
target3_end_old = """      timestamp: new Date().toISOString()
    }, 200);
  }



async function handleSpaceWeather"""

target3_end_new = """      timestamp: new Date().toISOString()
    }, 200);
  }
}



async function handleSpaceWeather"""

if target3_end_old in content:
    content = content.replace(target3_end_old, target3_end_new)
    print("Fixed target 3 (closing brace in handleSeismic)")
else:
    print("target3_end_old not found!")

# 4. In handleSpaceWeather:
target4_end_old = """      timestamp: new Date().toISOString()
    }, 200);
  }



async function getWebcamsDataset"""

target4_end_new = """      timestamp: new Date().toISOString()
    }, 200);
  }
}



async function getWebcamsDataset"""

if target4_end_old in content:
    content = content.replace(target4_end_old, target4_end_new)
    print("Fixed target 4 (closing brace in handleSpaceWeather)")
else:
    print("target4_end_old not found!")

file_path.write_text(content, encoding="utf-8")
print("Saved _worker.js")
