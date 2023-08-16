# Find Me a Flat (with ChatGpt) 🏢🔍

**Find Me a Flat** is your ultimate companion in the quest for the perfect apartment, powered by a web scraping technology. This project serves as a web scraper for the renowned platform [WG-Gesucht](https://www.wg-gesucht.de/en/), automating the search process to make apartment hunting a breeze. Here's how it works:

## Features

- **Adjustable search**: The program looks for listings based on your filters. By applying filters you will get the listings you want.
- **Automated messaging**: No need to message every single listing. The program does it for you. It adds the owners name too ;)
- **Personalized messages with ChatGpt (optional)**: Don't worry about being ignored, because you didn't write a personalized message.

## Usage

### 1. Automated Apartment Hunt

Specify the filters you want to use. For example: Berlin, flatshare, max. 500€. Enable the filters and copy the url into the `.env` file:

```env
FILTER_URL=https://www.wg-gesucht.de/en/wg-zimmer-in-Berlin.8.0.1.0.html?offer_filter=1&city_id=8&sort_order=0&noDeact=1&categories%5B%5D=0&rMax=500
```

### 2. Automated Contacting:

You will need to write a message template in German and English for this to work. You can add one here: [Message Templates](https://www.wg-gesucht.de/en/mein-wg-gesucht-message-templates.html).

> :warning: Add "@owner_name" to the locations you want to address the owner (e.g. Hi @owner_name! ➡️ Hi Sarah!)

Click on a template to copy the id from the url (...template_id=**12345678**) and add it to your `.env`:

```env
MESSAGE_ENG=YOUR-TEMPLATE-ID
MESSAGE_GER=YOUR-TEMPLATE_ID
```

The program will log you in to get necessary tokens and cookies, therefore needs your login details:

```env
WGG_USERNAME=YOUR-EMAIL # or username
WGG_PASSWORD=YOUR-PASSWORD
```

### 3. Personalized Messaging with ChatGPT (optional):

**Now to the fun part!**

I have added the ChatGPT API to this project to personalize your message to the listing. You will need to get a an API key from Open Ai for this. Create one here: [OpenAI Api Key](https://platform.openai.com/account/api-keys) and add it to the `.env`:

```
  OPENAI_API_KEY=REALLY-LONG-KEY
```

To make your message even more personalized, you can add some adjectives that describe your character. ChatGPT will take this into consideration and adjust the tonality:

```env
CHARACTER='open-minded,friendly'
```

## Install

Wanna find a place now? Let's go:

1. Clone this repo to your machine:
   ```bash
   git clone https://github.com/lbehrndt/find-me-a-flat.git
   ```
2. Slide into the folder:
   ```bash
   cd find-me-a-flat
   ```
3. Rename the `.env.example` to `.env` (make sure to add all your details):
   ```
   mv .env.example .env
   ```
4. Install everything:
   ```
   npm i
   ```
5. Start hunting:
   ```
   npm run start
   ```

## Contribute and Collaborate

Wanna add some features? I'm all ears! Here's how you can join the hype:

1. Fork this to your GitHub.

2. Build your awesome feature.

3. Open up a pull request and watch the magic happen.

## License

This project operates under the MIT License, granting you the freedom to use, modify, and share it in accordance with the license terms.

Start your apartment journey with Find Me a Flat and say goodbye to the hassle of apartment hunting! 🏠🌟
