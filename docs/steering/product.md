# Product

## What the site is

A welcoming, accessible, single-page website for the Castleford Community Food Pantry. The pantry runs on a surplus-food (anti-waste) redistribution model: it collects surplus food that would otherwise go to landfill and shares it with the community for £1, no referral needed. It is not a donated-stock food bank.

- Tagline: "Together we can reduce waste, feed people, build community."
- Mission: "We collect surplus food that would otherwise go to waste and make it available to our community."
- Badge: "Saving surplus food from landfill."
- The pantry operates from venues provided by GLOW (a local church). GLOW does not run the pantry. Copy says "supported by GLOW", never "run by" or "hosted by".
- GLOW's multicolour wordmark (G blue, L red, O yellow, W purple) appears prominently in the hero and footer.

## Sections (one pattern each, in page order)

| Section | Slug | Anchor | Purpose |
| --- | --- | --- | --- |
| Hero | `cfp/hero` | `#home` | Video background, headline, two CTAs ("Find a session", "Support us") |
| About | `cfp/about` | `#about` | Mission, tagline, GLOW relationship, photo |
| Get help | `cfp/get-help` | `#get-help` | Session list, £1 / no referral / bring a bag, contact CTA |
| Support us | `cfp/donate` | `#donate` | Surplus-food partnerships, volunteering, spreading the word |
| Volunteer | `cfp/volunteer` | `#volunteer` | Roles and how to apply |
| Partners | `cfp/sponsors` | `#sponsors` | Sponsor logo grid and invite copy |
| Contact | `cfp/contact` | `#contact` | Email, named phone contacts, venue addresses, map, social |

The Support section is labelled "Support us / Get Involved" for visitors but keeps the internal slug `cfp/donate` and anchor `#donate` so links and registration never churn. Keep slug and anchor stable when a visitor-facing label changes.

## Audience and tone

Local residents who need food support, potential volunteers, retailers who could supply surplus food, and sponsors. Tone is warm, plain-English, UK community-charity (in the spirit of Armley Helping Hands and Holbeck Together). Copy is original. UK spelling.

## Future growth

Launches as a one-pager but any section pattern can become a standalone page without rebuilding the theme (shared header/footer, `page.html` template, navigation entries can point at anchors or page URLs).
