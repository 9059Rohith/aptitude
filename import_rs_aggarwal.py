"""Extract the objective questions from the supplied R.S. Aggarwal PDF.

The PDF has a text layer, so this uses text extraction first and records the
original page for verification. It is intentionally conservative: only blocks
with multiple-choice options are added to the interactive bank.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz

PDF = Path(r"C:\Users\BhaviChasvi\Downloads\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf")
OUT = Path(__file__).with_name("rs_aggarwal_questions.js")

KNOWN_TOPICS = [
    "NUMBER SYSTEM", "SIMPLIFICATION", "DECIMAL FRACTIONS", "SQUARE ROOTS AND CUBE ROOTS",
    "AVERAGE", "PROBLEMS ON NUMBERS", "H.C.F. AND L.C.M. OF NUMBERS", "HCF AND LCM",
    "RATIO AND PROPORTION", "PERCENTAGE", "PROFIT AND LOSS", "SIMPLE INTEREST",
    "COMPOUND INTEREST", "PARTNERSHIP", "CHAIN RULE", "TIME AND WORK", "PIPES AND CISTERNS",
    "TIME AND DISTANCE", "PROBLEMS ON TRAINS", "BOATS AND STREAMS", "ALLIGATION OR MIXTURE",
    "PERMUTATIONS AND COMBINATIONS", "PROBABILITY", "CALENDAR", "CLOCKS", "LOGARITHMS",
    "SURDS AND INDICES", "SEQUENCE AND SERIES", "ODD MAN OUT & SERIES", "DATA INTERPRETATION",
    "HEIGHTS AND DISTANCES", "TRIGONOMETRICAL RATIOS", "MENSURATION", "ALGEBRA",
]
ALIASES = {
    "PERCENTAGE": "Percentages", "AVERAGE": "Averages", "H.C.F. AND L.C.M. OF NUMBERS": "HCF & LCM",
    "HCF AND LCM": "HCF & LCM", "RATIO AND PROPORTION": "Ratio & Proportion",
    "ALLIGATION OR MIXTURE": "Mixture & Alligation", "PERMUTATIONS AND COMBINATIONS": "Permutation",
    "PROBLEMS ON TRAINS": "Trains", "TIME AND DISTANCE": "Time, Speed & Distance",
    "PROBLEMS ON NUMBERS": "Number System", "SQUARE ROOTS AND CUBE ROOTS": "Surds & Indices",
    "SEQUENCE AND SERIES": "Series", "ODD MAN OUT & SERIES": "Series", "CLOCKS": "Clocks",
    "SURDS AND INDICES": "Surds & Indices", "PROFIT AND LOSS": "Profit & Loss", "CHAIN RULE": "Arithmetic",
    "DECIMAL FRACTIONS": "Simplification", "HEIGHTS AND DISTANCES": "Geometry",
}


def clean(value: str) -> str:
    value = value.replace("\x0c", " ").replace("\u00a0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def page_topic(text: str, fallback: str = "RS Aggarwal Source") -> str:
    upper = text.upper()
    marker = upper.find("OBJECTIVE TYPE")
    before = upper if marker < 0 else upper[:marker]
    hits = [(before.rfind(topic), topic) for topic in KNOWN_TOPICS if topic in before]
    if not hits:
        return fallback
    return ALIASES.get(max(hits)[1], max(hits)[1].title())


def parse_options(text: str) -> tuple[str, list[str]]:
    parts = re.split(r"\s*\(([a-e])\)\s*", text, flags=re.I)
    if len(parts) < 5:
        return clean(text), []
    stem = clean(parts[0])
    # Exam-name/year citations are metadata, not mathematical givens.
    stem = re.sub(r"\s*\([^)]*(?:19|20)\d{2}[^)]*\)", "", stem).strip()
    options = []
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            option = clean(parts[i + 1])
            if option:
                options.append(option)
    return stem, options[:5]


def extract() -> list[dict]:
    doc = fitz.open(PDF)
    exercises: list[dict] = []
    answer_key: dict[tuple[int, int], str] = {}
    active = False
    key_active = False
    exercise_id = 0
    current: dict | None = None
    question: dict | None = None
    last_topic = "RS Aggarwal Source"

    for page_no, page in enumerate(doc, 1):
        raw = page.get_text("text").replace("\r", "")
        lines = [clean(line) for line in raw.splitlines()]
        detected_topic = page_topic(raw, "")
        if detected_topic:
            last_topic = detected_topic
        if "OBJECTIVE TYPE" in raw.upper():
            exercise_id += 1
            active = True
            key_active = False
            current = {"id": exercise_id, "page": page_no, "topic": page_topic(raw, last_topic), "questions": []}
            exercises.append(current)
            question = None

        if key_active:
            before_solutions = raw.upper().split("SOLUTIONS", 1)[0]
            for number, letter in re.findall(r"(\d{1,3})\.\s*\(([a-e])\)", before_solutions, flags=re.I):
                answer_key[(exercise_id, int(number))] = letter.lower()
            if "SOLUTIONS" in raw.upper():
                key_active = False

        for line in lines:
            if not line:
                continue
            if active and re.fullmatch(r"ANSWERS?", line, flags=re.I):
                active = False
                key_active = True
                before_solutions = raw.upper().split("SOLUTIONS", 1)[0]
                for number, letter in re.findall(r"(\d{1,3})\.\s*\(([a-e])\)", before_solutions, flags=re.I):
                    answer_key[(exercise_id, int(number))] = letter.lower()
                question = None
                break
            match = re.match(r"^(\d{1,3})[.)]\s*(.*)$", line)
            if active and match and current is not None:
                if question is not None:
                    current["questions"].append(question)
                question = {"number": int(match.group(1)), "page": page_no, "text": match.group(2)}
            elif active and question is not None:
                if re.match(r"^\d+[.)]\s", line) is None and line.upper() not in {"QUANTITATIVE APTITUDE", current["topic"].upper()}:
                    question["text"] += " " + line
        if not active and question is not None and current is not None:
            current["questions"].append(question)
            question = None

    if question is not None and current is not None:
        current["questions"].append(question)

    output: list[dict] = []
    next_id = 2001
    for exercise in exercises:
        for item in exercise["questions"]:
            stem, options = parse_options(clean(item["text"]))
            if len(options) < 2:
                continue
            letter = answer_key.get((exercise["id"], item["number"]), "")
            answer = options[ord(letter) - ord("a")] if letter and ord(letter) - ord("a") < len(options) else ""
            output.append({
                "id": next_id,
                "topic": exercise["topic"],
                "difficulty": "Placement",
                "company": "R.S. Aggarwal (2017)",
                "question": stem,
                "answer": answer,
                "options": options,
                "solution": f"Source answer: option ({letter}) on PDF page {item['page']}. Open the source PDF for the full worked derivation.",
                "hint": "Identify the chapter formula, translate the data, and eliminate impossible options.",
                "shortcut": "Use the chapter formula and verify the selected option against the source answer key.",
                "time": 90,
                "kind": "RS Aggarwal Source",
                "model": f"Book exercise {exercise['id']}",
                "sourceBook": True,
                "sourcePage": item["page"],
                "sourceQuestion": item["number"],
                "sourceFile": "dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf",
            })
            next_id += 1
    return output


if __name__ == "__main__":
    questions = extract()
    OUT.write_text("window.rsAggarwalQuestions=" + json.dumps(questions, ensure_ascii=False, separators=(",", ":")) + ";", encoding="utf-8")
    keyed = sum(1 for q in questions if q["answer"])
    print(f"extracted={len(questions)} keyed={keyed} output={OUT}")
