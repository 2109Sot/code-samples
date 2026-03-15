# Investigative data methods

This repository contains selected code samples and visualization work developed by **Sotiris Sideris** for investigative reporting projects.

The materials are intended to demonstrate different parts of an investigative data workflow:

- **data collection and browser automation**
- **document processing and structured dataset construction**
- **interactive data visualization for published reporting**

The repository includes three representative samples:

## 1. Equasis vessel management scraper

**Notebook:** `notebooks/equasis_vessel_management_scraper.ipynb`

This notebook documents a Selenium-based workflow for retrieving vessel and company-management information from **Equasis** using a list of IMO numbers.

It demonstrates:

- browser automation with Selenium
- extraction of vessel particulars
- retrieval of management/company information
- creation of an exportable dataset for downstream analysis

**Reporting context:**  
This workflow was developed by **Sotiris Sideris** for investigative reporting projects led by **Reporters United**, in collaboration with **Investigate Europe** for the *Fuelling War* investigation and with the **International Consortium of Investigative Journalists (ICIJ)** for the *Caspian Cabals* investigation.

**Note:** Parts of the workflow rely on **Equasis**, an access-restricted maritime information platform, as well as datasets obtained through newsroom collaborations.

---

## 2. Eswatini GBV case pipeline

**Notebook:** `notebooks/eswatini_gbv_case_pipeline.ipynb`

This notebook documents a reproducible workflow for collecting and structuring High Court judgments from the **Eswatini Legal Information Institute (EswatiniLII)**.

It demonstrates:

- scraping case listing pages and detailed metadata
- generating PDF download links
- extracting text from judgment PDFs
- OCR fallback for image-based documents
- merging text with metadata into an analysis-ready dataset

**Reporting context:**  
This workflow was developed for the *Without Justice* investigation led by the **Center for Collaborative Investigative Journalism (CCIJ)**.

---

## 3. Nigeria election data visualization

**Project:** `observable/nigeria_election_data_story/`

This Observable project contains interactive charts developed for the *Democracy Deferred* investigation led by the **Center for Collaborative Investigative Journalism (CCIJ)**.

It demonstrates:

- editorial chart design
- interactive filtering
- annotation logic
- visual explanation of election data irregularities

The project examines election data from Nigeria’s 2023 presidential election to explore inconsistencies between publicly promised transparency mechanisms and the data ultimately released by the electoral commission.

Using computational analysis and interactive visualizations, the notebook explores patterns in the results, highlights anomalies in the dataset, and provides tools for examining how votes were recorded across different regions.

The code and methodology are shared here for transparency and reproducibility. If you reuse or adapt this work in reporting or research, please provide appropriate attribution.

---

## Why these samples

These notebooks and visualizations are intended as **representative samples**, not a complete archive of project code.

Together, they show three core parts of my investigative data practice:

- building datasets from difficult or access-restricted sources
- structuring and processing large collections of documents
- translating analysis into audience-facing visual reporting
