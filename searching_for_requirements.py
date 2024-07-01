import requests
from bs4 import BeautifulSoup
import json
import time

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
    response = requests.get(url, headers=headers)
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
    if info_element:
        date_texts = info_element[1].find_all('span')
        published_date = date_texts[0].text.strip() if len(date_texts) > 0 else "No published date"
        closing_date = date_texts[1].text.strip() if len(date_texts) > 1 else "No closing date"

    return description, company, location, published_date, closing_date

def extract_requirements(description):
    requirement_keywords = ['requirement', 'vaatimus',
                            'must', 'should', 'necessary', 'need',
                            'require', 'vaaditaan', 'tarvitaan', 'edellytetään',
                            'experience','background']

    lines = description.split('\n')
    requirements = []

    for line in lines:
        if any(keyword in line.lower() for keyword in requirement_keywords):
            requirements.append(line.strip())

    if not requirements:
        requirements = ["No specific requirements found"]

    return requirements

# Тестирование функции
job_listings = fetch_duunitori_jobs(max_pages=30)  # Увеличьте количество страниц, если нужно

# Преобразование данных в JSON для дальнейшего анализа
with open('job_listings.json', 'w', encoding='utf-8') as f:
    json.dump(job_listings, f, ensure_ascii=False, indent=4)

print(json.dumps(job_listings, ensure_ascii=False, indent=4))

"""


requirements_series = df['requirements'].str.split('; ').explode().value_counts()
top_requirements = requirements_series.head(10)

plt.figure(figsize=(12, 8))
sns.barplot(x=top_requirements.values, y=top_requirements.index, palette='viridis')
plt.title('Top 10 Job Requirements')
plt.xlabel('Frequency')
plt.ylabel('Requirement')
plt.show()
"""