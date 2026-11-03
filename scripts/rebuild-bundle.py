import os
import zipfile
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent
zip_path = repo_root / "agent-setup-bundle.zip"

exclude_dirs = {".git", ".system", "__pycache__", "node_modules", ".gemini"}
exclude_files = {"agent-setup-bundle.zip"}

print(f"Rebuilding {zip_path.name} from {repo_root}...")

with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    for root, dirs, files in os.walk(repo_root):
        # Modify dirs in-place to avoid descending into excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".git")]
        for file in sorted(files):
            if file in exclude_files or file.endswith(".pyc") or file.endswith(".bak*"):
                continue
            file_path = Path(root) / file
            rel_path = file_path.relative_to(repo_root).as_posix()
            zf.write(file_path, rel_path)

print(f"Successfully rebuilt {zip_path.name}: {zip_path.stat().st_size / (1024*1024):.2f} MB")
