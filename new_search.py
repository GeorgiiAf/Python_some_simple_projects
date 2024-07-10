import requests
from bs4 import BeautifulSoup
import json
import time
import re

def fetch_duunitori_jobs(max_pages=10):
    base_url = 'https://duunitori.fi/tyopaikat/?haku=python'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    job_listings = []

    for page in range(1, max_pages + 1):
        url = f'{base_url}&sivu={page}'
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        jobs_on_page = soup.find_all('div', class_='grid grid--middle job-box job-box--lg')
        if not jobs_on_page:
            break  # No more jobs found, exit the loop

        for job in jobs_on_page:
            title_element = job.find('h3', class_='job-box__title')
            link_element = job.find('a', class_='job-box__hover')

            if not title_element or not link_element:
                print("Missing title or link in job element.")
                continue

            title = title_element.text.strip()
            job_url = 'https://duunitori.fi' + link_element['href']

            description, company, location, published_date, closing_date = fetch_job_description(job_url, headers)

            if 'python' in title.lower() or 'python' in description.lower():
                job_listings.append({
                    'title': title,
                    'company': company,
                    'location': location,
                    'published_date': published_date,
                    'closing_date': closing_date,
                    'requirements': extract_requirements(description)
                })

            time.sleep(1)  # Задержка для предотвращения перегрузки сервера

        print(f"Page {page} processed.")

    return job_listings

def fetch_job_description(url, headers):
    response = requests.get(url, headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    description_element = soup.find('div', class_='gtm-apply-clicks description description--jobentry')
    description = description_element.text.strip() if description_element else "No description"

    company_element = soup.find('p', class_='header__info').find('span')
    company = company_element.text.strip() if company_element else "No company"

    location_element = soup.find('a', href=lambda href: href and "tyopaikat/alue" in href)
    location = location_element.text.strip() if location_element else "No location"

    info_element = soup.find_all('p', class_='header__info')
    published_date = "No published date"
    closing_date = "No closing date"
    if info_element and len(info_element) > 1:
        date_texts = info_element[1].find_all('span')
        published_date = date_texts[0].text.strip() if len(date_texts) > 0 else "No published date"
        closing_date = date_texts[1].text.strip() if len(date_texts) > 1 else "No closing date"

    return description, company, location, published_date, closing_date

def extract_requirements(description):
    requirement_keywords = [
        'requirements', 'vaatimukset', 'kvalifikaatiot', 'skills', 'responsibilities', 'qualifications',
        'edellytyksenä', 'must', 'should', 'necessary', 'need', 'required', 'vaaditaan', 'tarvitaan',
        'experience', 'background', 'katsotaan eduksi', 'toivomme', 'edellytämme', 'kompetenssit'
    ]

    section_headers_pattern = re.compile(
        r'(?i)(requirements|qualifications|skills|responsibilities|vaatimukset|kvalifikaatiot|edellytyksenä|toivomme)[:\n]')
    bullet_points_pattern = re.compile(r'[\n•-]')

    sections = section_headers_pattern.split(description)

    requirements = []
    for i, section in enumerate(sections):
        if section.strip().lower() in [k.lower() for k in requirement_keywords]:
            next_section = sections[i + 1] if i + 1 < len(sections) else ''
            lines = bullet_points_pattern.split(next_section)
            for line in lines:
                line = line.strip()
                if len(line) > 0 and not section_headers_pattern.match(line):
                    requirements.append(line)
                else:
                    break

    if not requirements:
        requirements = ["No specific requirements found"]

    return requirements

# Тестирование функции
job_listings = fetch_duunitori_jobs(max_pages=3)

# Преобразование данных в JSON для дальнейшего анализа
with open('job_listings.json', 'w', encoding='utf-8') as f:
    json.dump(job_listings, f, ensure_ascii=False, indent=4)

print(json.dumps(job_listings, ensure_ascii=False, indent=4))
