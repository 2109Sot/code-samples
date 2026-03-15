# Investigative Data Methods
### Reproducible workflows used in cross-border investigative reporting

This repository contains selected data pipelines, analysis notebooks and visualizations developed by Sotiris Sideris for investigative journalism projects.

The examples demonstrate how computational methods — including web scraping, OCR, document processing and data visualization — can be used to uncover patterns of wrongdoing in complex datasets.

The code and methodology are shared here to support transparency, reproducibility and knowledge sharing within the investigative journalism community.

---

## Investigations

### 1. Court record analysis — Gender-based violence cases in Eswatini

![GBV case pipeline](images/gbv_pipeline.png)

**Story:**  
https://veza.news/article/2024/10/24/without-justice-how-eswatinis-system-is-failing-victims-of-gender-based-violence/

This project involved collecting and analyzing court records to examine patterns in gender-based violence prosecutions.

**Code**

`notebooks/eswatini_gbv_case_pipeline.ipynb`

**Pipeline overview**

1. Scrape court records
2. Extract case metadata
3. Clean and structure case data
4. Use NLP classification to identify gender-based violence cases
5. Human verification of model outputs

**Key techniques**

- web scraping
- structured text extraction
- machine-assisted classification
- human-in-the-loop verification

---

### 2. Shipping database extraction — Vessel management networks

![Equasis vessel scraper](images/equasis_scraper.png)

**Story:**  
https://www.investigate-europe.eu/posts/european-ships-bolster-russian-fossil-fuel-trade-despite-looming-eu-sanctions

This notebook demonstrates a scraper used to collect vessel ownership and management records from maritime databases.

**Code**

`notebooks/equasis_vessel_management_scraper.ipynb`

**Pipeline overview**

1. Automated login and navigation
2. Scraping vessel management records
3. Structured data extraction
4. Network-ready output

**Key techniques**

- Selenium automation
- structured scraping
- maritime data normalization

---

### 3. Election transparency analysis — Nigeria 2023

![Nigeria election visualization](images/nigeria_viz.png)

**Story:**  
https://veza.news/article/2025/03/31/broken-promises-of-transparency-a-deep-dive-into-nigerias-2023-election-data/

This investigation examines discrepancies between official election results and underlying documents published through Nigeria's election transparency portal.

The project involved:

- scraping election result documents
- OCR extraction of vote tallies
- structured data comparison
- interactive visualization of discrepancies

**Code**

- `observable/nigeria_election_data_story`
- Observable interactive visualizations

**Key techniques**

- OCR document extraction
- structured vote comparison
- anomaly detection
- interactive investigative visualization