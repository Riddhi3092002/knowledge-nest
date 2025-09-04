import re
from typing import List
from models.user_model import Milestone

def parse_duration_to_milestones(duration: str) -> List[Milestone]:
    original = duration
    duration = duration.lower()

    fluff_patterns = ['approximately', 'approx.', 'to complete', 'about', 'around', 'estimated', 'timapprox.']
    for fluff in fluff_patterns:
        duration = duration.replace(fluff, '')
    duration = duration.strip()
 
    print(f"Parsing duration: original='{original}' cleaned='{duration}'")

    # Regex to find number + unit (plural or singular)
    match = re.search(r'([\d.]+)\s*(week|weeks|month|months|hour|hours)', duration)
    if not match:
        print("No match found in duration string")
        return []

    num = float(match.group(1))
    unit = match.group(2)
    print(f"Matched num={num}, unit={unit}")

    if 'month' in unit:
        # Round to nearest week count
        num_weeks = int(num * 4 + 0.5)
    elif 'week' in unit:
        num_weeks = int(num + 0.5)
    elif 'hour' in unit:
        print("Detected hours, returning 1 milestone")
        return [Milestone(week=1, completed=False)]
    else:
        return []
    print(f"Calculated number of weeks: {num_weeks}")
    milestones = [Milestone(week=i + 1, completed=False) for i in range(num_weeks)]
    return milestones
