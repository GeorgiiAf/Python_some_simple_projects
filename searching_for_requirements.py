import requests
from bs4 import BeautifulSoup
import pandas as pd
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns
import time

def fetch_duunitori_jobs():
    url = 'https://duunitori.fi/tyopaikat/?haku=python'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    job_listings = []

    for job in soup.find_all('div', class_='grid grid--middle job-box job-box--lg'):
        title_element = job.find('h3', class_='job-box__title')
        link_element = job.find('a', class_='job-box__hover')

        if not title_element or not link_element:
            print("Missing title or link in job element.")
            continue

        title = title_element.text.strip()
        job_url = 'https://duunitori.fi' + link_element['href']

        description = fetch_job_description(job_url, headers)

        if 'python' in title.lower() or 'python' in description.lower():
            job_listings.append({
                'title': title,
                'description': description,
                'requirements': extract_requirements(description)
            })

        time.sleep(1)

    return job_listings

def fetch_job_description(url, headers):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    description_element = soup.find('div', class_='gtm-apply-clicks description description--jobentry')

    if description_element:
        return description_element.text.strip()
    return "No description"

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


job_listings = fetch_duunitori_jobs()
print(job_listings)


df = pd.DataFrame(job_listings)



df['requirements'] = df['requirements'].apply(lambda x: '; '.join(x))



df.to_csv('job_listings.csv', index=False)

conn = sqlite3.connect('job_listings.db')
df.to_sql('job_listings', conn, if_exists='replace', index=False)
conn.close()





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