import requests
from bs4 import BeautifulSoup
import json
import time
from collections import Counter
import pandas as pd


def is_junior_position(title, description):
    junior_keywords = [
        'junior', 'entry', 'trainee', 'graduate', 'harjoittelija',
        'kesätyö', 'summer', 'aloittelija', 'junior developer',
        'entry-level', 'työharjoittelu', 'harjoittelupaikka'
    ]

    text = (title + ' ' + description).lower()
    return any(keyword in text for keyword in junior_keywords)


def analyze_junior_requirements(job_listings):
    # Основные технологии и навыки для junior Python разработчика
    tech_categories = {
        'core_python': [
            'python', 'pip', 'virtualenv', 'pyenv',
            'object-oriented', 'oop', 'algorithms', 'data structures'
        ],
        'web_frameworks': [
            'django', 'flask', 'fastapi', 'pyramid', 'aiohttp'
        ],
        'databases': [
            'sql', 'postgresql', 'mysql', 'sqlite', 'mongodb'
        ],
        'version_control': [
            'git', 'github', 'gitlab', 'bitbucket'
        ],
        'testing': [
            'unit testing', 'pytest', 'unittest', 'tdd'
        ],
        'basic_web': [
            'html', 'css', 'javascript', 'rest', 'api'
        ],
        'tools': [
            'docker', 'linux', 'bash', 'command line', 'vs code', 'pycharm'
        ],
        'soft_skills': [
            'team player', 'communication', 'learning', 'problem solving',
            'tiimityö', 'kommunikaatio', 'oppiminen', 'ongelmanratkaisu'
        ]
    }

    requirements_count = {category: Counter() for category in tech_categories}
    total_junior_positions = 0

    for job in job_listings:
        if is_junior_position(job['title'], ' '.join(job['requirements'])):
            total_junior_positions += 1
            requirements_text = ' '.join(job['requirements']).lower()

            for category, skills in tech_categories.items():
                for skill in skills:
                    if skill in requirements_text:
                        requirements_count[category][skill] += 1

    # Создаем отчет
    report = []
    report.append(f"Всего проанализировано junior позиций: {total_junior_positions}\n")

    for category, counter in requirements_count.items():
        if counter:
            report.append(f"\n{category.replace('_', ' ').title()}:")
            for skill, count in counter.most_common():
                percentage = (count / total_junior_positions) * 100
                report.append(f"- {skill}: {percentage:.1f}% вакансий")

    return '\n'.join(report)


def save_example_positions(job_listings):
    junior_positions = [
        {
            'title': job['title'],
            'company': job['company'],
            'requirements': job['requirements']
        }
        for job in job_listings
        if is_junior_position(job['title'], ' '.join(job['requirements']))
    ]

    with open('junior_positions.json', 'w', encoding='utf-8') as f:
        json.dump(junior_positions, f, ensure_ascii=False, indent=2)


# Использование
if __name__ == "__main__":
    with open('job_listings.json', 'r', encoding='utf-8') as f:
        job_listings = json.load(f)

    report = analyze_junior_requirements(job_listings)
    print(report)
    save_example_positions(job_listings)