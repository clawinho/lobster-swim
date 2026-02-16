"""Remove baked-in checkered backgrounds from sprite PNGs using rembg."""

from pathlib import Path
from rembg import remove
from PIL import Image
import io

SPRITES_DIR = Path(__file__).resolve().parents[2] / "src" / "assets" / "sprites"


def process_sprite(path: Path) -> None:
    print(f"Processing {path.name}...", end=" ", flush=True)
    input_bytes = path.read_bytes()
    output_bytes = remove(input_bytes)
    # Re-save through Pillow to ensure clean RGBA PNG
    img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
    img.save(path, "PNG")
    print("done")


def main() -> None:
    pngs = sorted(SPRITES_DIR.glob("*.png"))
    if not pngs:
        print(f"No PNGs found in {SPRITES_DIR}")
        return
    print(f"Found {len(pngs)} sprite(s) in {SPRITES_DIR}\n")
    for png in pngs:
        process_sprite(png)
    print(f"\nAll {len(pngs)} sprites processed.")


if __name__ == "__main__":
    main()
