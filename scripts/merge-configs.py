import sys
import os
import json
import shutil
import re
from datetime import datetime

def backup_file(path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        bak = f"{path}.bak_{ts}"
        shutil.copy2(path, bak)
        print(f"  [Backup] Created backup: {os.path.basename(bak)}")
        return bak
    return None

def merge_json_mcp(target_path, template_path, force_overwrite=False):
    if not os.path.exists(template_path):
        print(f"  [Skip] Template not found: {template_path}")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        tpl_data = json.load(f)

    tpl_servers = tpl_data.get('mcpServers', {})

    if force_overwrite or not os.path.exists(target_path) or os.path.getsize(target_path) == 0:
        backup_file(target_path)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(tpl_data, f, indent=2)
        print(f"  [OK] Installed fresh config: {target_path}")
        return

    # Smart merge
    backup_file(target_path)
    try:
        with open(target_path, 'r', encoding='utf-8') as f:
            cur_data = json.load(f)
    except Exception as e:
        print(f"  [Warn] Failed to parse existing {target_path} ({e}), overwriting with template")
        cur_data = tpl_data

    cur_servers = cur_data.setdefault('mcpServers', {})
    added = 0
    for s_name, s_cfg in tpl_servers.items():
        if s_name not in cur_servers:
            cur_servers[s_name] = s_cfg
            added += 1

    # Preserve other fields from template if missing (e.g. preferences)
    for k, v in tpl_data.items():
        if k != 'mcpServers' and k not in cur_data:
            cur_data[k] = v

    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(cur_data, f, indent=2)
    print(f"  [OK] Merged {added} new MCP server(s) into: {target_path}")

def merge_codex_toml(target_path, template_path, force_overwrite=False):
    if not os.path.exists(template_path):
        print(f"  [Skip] Template not found: {template_path}")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        tpl_text = f.read()

    if force_overwrite or not os.path.exists(target_path) or os.path.getsize(target_path) == 0:
        backup_file(target_path)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(tpl_text)
        print(f"  [OK] Installed fresh Codex config: {target_path}")
        return

    backup_file(target_path)
    with open(target_path, 'r', encoding='utf-8') as f:
        cur_text = f.read()

    # Critical fix: Ensure [mcp_servers.figma] never has args = []
    # In Codex TOML, HTTP/SSE servers cannot have args
    figma_fix_pattern = re.compile(r'(\[mcp_servers\.figma\][^\[]*?)\r?\nargs\s*=\s*\[\s*\]', re.MULTILINE)
    if figma_fix_pattern.search(cur_text):
        cur_text = figma_fix_pattern.sub(r'\1', cur_text)
        print("  [Auto-Fix] Removed invalid 'args = []' from [mcp_servers.figma]")

    # Extract all section headers [mcp_servers.<name>]
    tpl_sections = re.findall(r'(\[mcp_servers\.([a-zA-Z0-9_\-]+)\][\s\S]*?)(?=\n\[|\Z)', tpl_text)
    cur_sections = set(re.findall(r'\[mcp_servers\.([a-zA-Z0-9_\-]+)\]', cur_text))

    added = 0
    append_blocks = []
    for full_sec, name in tpl_sections:
        if name not in cur_sections:
            append_blocks.append(full_sec.strip())
            added += 1

    if append_blocks:
        if not cur_text.endswith('\n'):
            cur_text += '\n'
        cur_text += '\n' + '\n\n'.join(append_blocks) + '\n'

    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(cur_text)
    print(f"  [OK] Merged {added} new MCP server(s) into Codex: {target_path}")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="Merge MCP configs safely.")
    parser.add_argument('--action', choices=['antigravity', 'claude', 'codex', 'all'], default='all')
    parser.add_argument('--force', action='store_true', default=False)
    parser.add_argument('--bundle-dir', required=True)
    args = parser.parse_args()

    user_home = os.path.expanduser('~')
    appdata = os.environ.get('APPDATA', os.path.join(user_home, 'AppData', 'Roaming'))
    configs_dir = os.path.join(args.bundle_dir, 'configs')

    if args.action in ['antigravity', 'all']:
        t_antigravity = os.path.join(user_home, '.gemini', 'config', 'mcp_config.json')
        s_antigravity = os.path.join(configs_dir, 'antigravity-mcp_config.json')
        merge_json_mcp(t_antigravity, s_antigravity, args.force)

        # Also mirror to antigravity-ide if parent folder exists
        ide_dir = os.path.join(user_home, '.gemini', 'antigravity-ide')
        if os.path.exists(ide_dir):
            t_ide = os.path.join(ide_dir, 'mcp_config.json')
            shutil.copy2(t_antigravity, t_ide)
            print(f"  [OK] Mirrored to Antigravity IDE config: {t_ide}")

    if args.action in ['claude', 'all']:
        t_claude = os.path.join(appdata, 'Claude', 'claude_desktop_config.json')
        s_claude = os.path.join(configs_dir, 'claude_desktop_config.json')
        merge_json_mcp(t_claude, s_claude, args.force)

        t_code = os.path.join(user_home, '.claude.json')
        if os.path.exists(t_code):
            merge_json_mcp(t_code, s_claude, force_overwrite=False)

    if args.action in ['codex', 'all']:
        t_codex = os.path.join(user_home, '.codex', 'config.toml')
        s_codex = os.path.join(configs_dir, 'codex_config.toml')
        merge_codex_toml(t_codex, s_codex, args.force)
