import re
from pathlib import Path

file_path = Path("D:/projects/omniscope-web/_worker.js")
content = file_path.read_text(encoding="utf-8")

# Let's inspect the 4 places where "\n}\n  } catch" occurs
matches = list(re.finditer(r"\n\s*\}\s*\r?\n\s*\}\s*catch", content))
print(f"Found {len(matches)} occurrences of '\\n}}\\n  }} catch'")

# In each of those, we want to remove the premature closing brace before "} catch",
# and then add a closing brace after the catch block!

def fix_try_catch_braces(text, func_name, catch_var):
    # Find the function
    f_idx = text.find(f"function {func_name}")
    if f_idx == -1:
        print(f"Could not find function {func_name}")
        return text
    
    # Find "} catch" in this function
    catch_str = f"}} catch ({catch_var})"
    c_idx = text.find(catch_str, f_idx)
    if c_idx == -1:
        # maybe with different spacing
        m = re.search(r"\}\s*catch\s*\(" + re.escape(catch_var) + r"\)", text[f_idx:])
        if m:
            c_idx = f_idx + m.start()
        else:
            print(f"Could not find catch in {func_name}")
            return text
            
    # Look backwards from c_idx for the preceding "}"
    before_catch = text[f_idx:c_idx]
    last_brace_rel = before_catch.rfind("}")
    if last_brace_rel != -1:
        last_brace_idx = f_idx + last_brace_rel
        # Remove that brace
        print(f"Removing premature brace before catch in {func_name}")
        text = text[:last_brace_idx] + text[last_brace_idx+1:c_idx] + "} catch" + text[c_idx+len("} catch"):]
    
    # Now find the end of this catch block: look for the closing brace of the catch block
    # It ends with ", 200);\n  }" or similar.
    # We need to add "}\n" after that catch block!
    # Let's find ", 200);\n  }" or ");\n  }" after the catch
    after_catch_pos = text.find("catch", f_idx)
    m_end = re.search(r"\),\s*200\s*\);\s*\r?\n\s*\}", text[after_catch_pos:])
    if m_end:
        insert_pos = after_catch_pos + m_end.end()
        text = text[:insert_pos] + "\n}\n" + text[insert_pos:]
        print(f"Added closing brace for function {func_name}")
    else:
        print(f"Could not find end of catch in {func_name}")

    return text

content = fix_try_catch_braces(content, "handleWeather", "weatherErr")
content = fix_try_catch_braces(content, "handleStorms", "err")
content = fix_try_catch_braces(content, "handleSeismic", "err")
content = fix_try_catch_braces(content, "handleSpaceWeather", "err")

file_path.write_text(content, encoding="utf-8")
print("Saved _worker.js")
