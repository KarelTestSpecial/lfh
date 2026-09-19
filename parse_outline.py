import json
import sys

def parse_line(line):
    """Parses a single line to get its indentation level and title."""
    stripped_line = line.lstrip(' ')
    indentation = len(line) - len(stripped_line)
    title = stripped_line.strip()
    # Assuming 8 spaces per indentation level
    level = indentation // 8
    return level, title

def build_hierarchy(lines):
    """Builds a hierarchical structure from a list of lines."""
    if not lines:
        return []

    root = []
    parent_stack = { -1: root }

    for line in lines:
        if not line.strip():
            continue

        level, title = parse_line(line)

        node = {
            "title": title,
            "children": []
        }

        parent = parent_stack[level - 1]
        parent.append(node)

        parent_stack[level] = node["children"]

    return root

def process_outline(input_file, output_file):
    """Process a single outline file and write to JSON."""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if content.startswith('\ufeff'):
                content = content[1:]
            lines = content.splitlines()

        hierarchy = build_hierarchy(lines)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(hierarchy, f, indent=4, ensure_ascii=False)

        print(f"Successfully converted {input_file} to {output_file}")
        return True

    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

def main():
    """Main function to process all outline files."""
    files = [
        ('LFHoutline.txt', 'data.en.json'),
        ('LFHoutline_nl.txt', 'data.nl.json')
    ]

    success_count = 0
    for input_file, output_file in files:
        if process_outline(input_file, output_file):
            success_count += 1

    if success_count == len(files):
        print("\nAll files processed successfully!")
    else:
        print(f"\nProcessed {success_count}/{len(files)} files.")

if __name__ == "__main__":
    main()
