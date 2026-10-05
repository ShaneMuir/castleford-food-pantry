# Requirements Document

## Introduction

This document defines the requirements for the Castleford Community Food Pantry website: a welcoming, accessible, and attention-grabbing web presence for a local surplus-food community pantry. The pantry collects surplus food that would otherwise go to waste and makes it available to the community, operating under the tagline "Together we can reduce waste, feed people, build community." Its mission statement is: "We collect surplus food that would otherwise go to waste and make it available to our community." The pantry carries the badge message "Saving surplus food from landfill." This is a surplus-food / anti-waste redistribution model, not a traditional donated-stock food bank. The pantry operates from centers provided by GLOW, a local church, hosted in church halls (Airedale Gospel Hall and Cutsyke Christian Church). GLOW does not run the pantry, but its branding and multicolor "GLOW" wordmark must be featured prominently as an eye-catching element throughout the site.

The site is built as a WordPress block theme using Full Site Editing (FSE), following modern 2026 architecture: a `theme.json` v3 design-token system, block templates and reusable block patterns, fluid typography, and self-hosted fonts (no external font CDNs). Because current content and imagery are minimal, the site launches as a single page (one-pager) composed of distinct, anchor-linked sections, but it must be architected so sections can be promoted into standalone pages and a multi-page information architecture later without rebuilding the theme.

The site draws tonal and structural inspiration from UK community-charity sites such as Armley Helping Hands and Holbeck Together: a warm welcome message, clearly described services, impact statements, donation guidance, and a sponsor/partner showcase.

### Scope Summary

- **In scope (launch):** One-page block-theme site with hero (video + logo), about, how to get help, how to support / get involved, how to volunteer, sponsors/brands, GLOW branding, contact/location, and site footer; accessibility, responsiveness, performance, SEO, and the extensibility foundation for future pages.
- **In scope (foundation only, not full build):** Template, pattern, and navigation structure that allows later expansion to multiple pages.
- **Out of scope (launch):** User accounts, online payment processing, a content management workflow beyond standard WordPress editing, and multilingual content.

## Glossary

- **Site**: The complete Castleford Community Food Pantry WordPress website delivered by this spec.
- **Block_Theme**: The custom WordPress Full Site Editing theme that renders the Site, configured primarily through `theme.json` and HTML block templates.
- **Theme_Config**: The `theme.json` (schema version 3) file that defines the Site's design tokens (color palette, typography scale, spacing scale, layout widths).
- **Home_Template**: The block template (`templates/front-page.html` or `index.html`) that assembles the one-page layout from block patterns.
- **Block_Pattern**: A reusable, registered collection of blocks representing one section of the one-page layout (for example, the Hero_Section or Donate_Section).
- **Hero_Section**: The top section of the Home_Template containing the hero video, the Castleford Community Food Pantry logo, a headline, and a primary call-to-action.
- **About_Section**: The section describing what the Castleford Community Food Pantry is, its surplus-food redistribution mission, and who it serves.
- **Get_Help_Section**: The section explaining how a visitor can receive food support, including access terms, opening times, and multiple session locations.
- **Donate_Section**: The section explaining how a visitor, business, or supporter can support the pantry through surplus-food partnerships, volunteering, and spreading the word.
- **Volunteer_Section**: The section explaining how a visitor can volunteer.
- **Sponsors_Section**: The section showcasing partner brands and sponsors that support the pantry.
- **GLOW_Branding**: The visual treatment that presents the multicolor "GLOW" wordmark and "run by GLOW" attribution as a prominent, eye-catching element.
- **Contact_Section**: The section containing contact details, physical location, and an embedded map.
- **Site_Footer**: The template part rendered at the bottom of every template containing attribution, contact summary, and secondary navigation.
- **Site_Header**: The template part rendered at the top of every template containing the logo and primary navigation.
- **Primary_Navigation**: The in-page navigation menu that links to each section via anchor links at launch and is capable of linking to separate pages later.
- **Visitor**: Any person accessing the Site through a web browser, including people seeking help, donors, volunteers, and sponsors.
- **Editor**: A person who edits Site content through the WordPress Site Editor and block editor.
- **Design_Token**: A named value in Theme_Config (color, font size, spacing step) referenced by blocks and patterns.
- **Fluid_Typography**: Type sizes defined in Theme_Config that scale continuously between a minimum and maximum based on viewport width without media queries.
- **Brand_Palette**: The defined color set: green `#2F7D4F`, gold `#F5B82E`, navy `#1F3A5F`, cream `#FFF8EC`, red/orange accent `#E4572E`, plus the GLOW letter colors blue `#3B8FE0`, red `#EE3B24`, yellow `#FFD60A`, purple `#B026D0`.
- **WCAG_AA**: The Web Content Accessibility Guidelines 2.1 Level AA conformance target.
- **Reduced_Motion**: The user preference expressed via the `prefers-reduced-motion` media query.
- **Core_Web_Vitals**: Google's performance metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).

## Requirements

### Requirement 1: Block Theme Foundation

**User Story:** As an Editor, I want the Site built as a modern WordPress block theme, so that I can edit content and layout visually through Full Site Editing without writing code.

#### Acceptance Criteria

1. THE Block_Theme SHALL include a `style.css` theme header, a `theme.json` file, and a `templates/` directory containing at least one block template, so that WordPress recognizes the theme as a block theme.
2. THE Theme_Config SHALL declare schema version 3 in the `theme.json` `version` field.
3. IF the `theme.json` file is missing, malformed, or declares a schema version other than 3, THEN THE Block_Theme SHALL cause WordPress to fall back to default block-theme behavior and surface an error indication to the Editor identifying the invalid configuration.
4. THE Block_Theme SHALL define exactly one Site_Header and exactly one Site_Footer as reusable template parts, and every template in the `templates/` directory SHALL reference both parts.
5. THE Block_Theme SHALL register each of the following seven one-page sections as a separate Block_Pattern: Hero_Section, About_Section, Get_Help_Section, Donate_Section, Volunteer_Section, Sponsors_Section, and Contact_Section.
6. THE Home_Template SHALL assemble the one-page layout by composing the registered Block_Patterns in the following top-to-bottom order: Hero_Section, About_Section, Get_Help_Section, Donate_Section, Volunteer_Section, Sponsors_Section, Contact_Section.
7. WHEN a Visitor accesses the Site root URL, THE Block_Theme SHALL render the Home_Template as the front page.
8. THE Block_Theme SHALL self-host all brand fonts within the theme directory and register them in Theme_Config, such that rendering any text on any template issues zero external font CDN requests.

### Requirement 2: Design Token System and Branding

**User Story:** As an Editor, I want the Site's colors, typography, and spacing defined as centralized design tokens, so that the brand stays consistent and global changes are made in one place.

#### Acceptance Criteria

1. THE Theme_Config SHALL define the Brand_Palette as named color Design_Tokens, where each Design_Token has a unique name and a valid color value.
2. THE Theme_Config SHALL define a Fluid_Typography scale in which each type size scales continuously between a defined minimum size and maximum size as the viewport width varies between a defined minimum viewport width and maximum viewport width, such that the size equals the minimum size at or below the minimum viewport width and the maximum size at or above the maximum viewport width.
3. THE Theme_Config SHALL define a named spacing scale of at least 3 named spacing Design_Tokens used for section padding and block spacing, where each Design_Token has a unique name and a non-negative length value.
4. THE Theme_Config SHALL define the Site content width and wide-alignment width as layout Design_Tokens, where the wide-alignment width is greater than or equal to the content width.
5. WHEN an Editor changes the value of a color, type, or spacing Design_Token in Theme_Config, THE Site SHALL render every block that references that Design_Token using the changed value, with no block retaining the previous value.
6. THE GLOW_Branding SHALL render the "GLOW" wordmark using the four GLOW letter colors (G `#3B8FE0`, L `#EE3B24`, O `#FFD60A`, W `#B026D0`), applying exactly one of these four colors to each corresponding letter.
7. IF a referenced color, type, or spacing Design_Token is undefined or has an invalid value, THEN THE Site SHALL render the affected block using a defined fallback Design_Token.

### Requirement 3: Site Header and Primary Navigation

**User Story:** As a Visitor, I want a persistent header with the pantry logo and clear navigation, so that I can identify the organization and jump to the section I need.

#### Acceptance Criteria

1. THE Site_Header SHALL display the selected Castleford Community Food Pantry logo linked to the Site root URL.
2. THE Site_Header SHALL display the Primary_Navigation with a link to each one-page section.
3. WHEN a Visitor selects a Primary_Navigation link at launch, THE Site SHALL scroll the viewport to the corresponding section.
4. WHILE a Visitor views the Site on a viewport width of 782 pixels or less, THE Site_Header SHALL present the Primary_Navigation as a collapsible menu control.
5. THE Site_Header SHALL display a persistent primary call-to-action link labeled for donation.
6. THE Primary_Navigation SHALL be defined so that a navigation entry can point to a separate page URL without changing the Site_Header markup structure.

### Requirement 4: Hero Section

**User Story:** As a Visitor, I want an engaging hero area with video and the pantry identity, so that I immediately understand the organization and feel welcomed.

#### Acceptance Criteria

1. WHEN the Hero_Section loads, THE Hero_Section SHALL display the hero video `website-videos/castleford-food-pantry-video.mp4` as a background element covering 100% of the Hero_Section width.
2. THE Hero_Section SHALL display the Castleford Community Food Pantry logo and a headline of between 1 and 120 characters describing the pantry's purpose.
3. THE Hero_Section SHALL display GLOW_Branding positioned within the Hero_Section as a visible element.
4. THE Hero_Section SHALL display exactly one primary call-to-action link for getting help and exactly one secondary call-to-action link for donating, each with visible link text of between 1 and 40 characters.
5. WHILE the hero video plays, THE Hero_Section SHALL render the video muted with no audible audio output and SHALL NOT display native audio playback controls.
6. WHEN the Hero_Section loads AND the Visitor has enabled Reduced_Motion, THE Hero_Section SHALL display a static poster image instead of playing the hero video.
7. IF the hero video fails to load within 5 seconds, THEN THE Hero_Section SHALL display a static poster image and SHALL maintain all other Hero_Section elements (logo, headline, GLOW_Branding, call-to-action links) in their defined positions.
8. WHILE text overlays the hero video, THE Hero_Section SHALL maintain a text-to-background contrast ratio of at least 4.5:1 for text smaller than 24px and at least 3:1 for text 24px or larger.

### Requirement 5: About Section

**User Story:** As a Visitor, I want to read what the Castleford Community Food Pantry is and who it helps, so that I understand its surplus-food mission and relationship with GLOW.

#### Acceptance Criteria

1. THE About_Section SHALL display descriptive content explaining that the pantry collects surplus food that would otherwise go to waste and makes it available to the community, and the community it serves.
2. THE About_Section SHALL display the tagline "Together we can reduce waste, feed people, build community" and the badge message "Saving surplus food from landfill".
3. THE About_Section SHALL state that the pantry operates from centers provided by GLOW and that GLOW does not run the pantry.
4. THE About_Section SHALL display at least one supporting image using the available photo assets.
5. THE About_Section SHALL display the content within the Theme_Config content width on viewports wider than 782 pixels.

### Requirement 6: Get Help Section

**User Story:** As a Visitor in need, I want clear guidance on how to receive food support, so that I know when, where, and how to access the pantry.

#### Acceptance Criteria

1. THE Get_Help_Section SHALL display the steps a Visitor follows to receive food support.
2. THE Get_Help_Section SHALL display each of the pantry's sessions with its day, time, and venue address, including the following sessions:
   - Sundays 2:00–3:00 PM at Airedale Gospel Hall, Royds Ave, Castleford, WF10 3LQ
   - Sundays 4:30–5:30 PM at Cutsyke Christian Church, Cutsyke Rd, Castleford, WF10 5HA
   - Fridays 9:30–10:30 AM Breakfast (£1) at Cutsyke Christian Church, Cutsyke Rd, Castleford, WF10 5HA
   - Fridays 11:00 AM–12:00 PM Food Pantry (£1) at Cutsyke Christian Church, Cutsyke Rd, Castleford, WF10 5HA
3. THE Get_Help_Section SHALL display the access terms as explicit text: a £1 cost, that no referral is needed, and that Visitors should bring a bag.
4. THE Get_Help_Section SHALL display a call-to-action link to the Contact_Section for help enquiries.

### Requirement 7: Support / Get Involved Section

**User Story:** As a potential supporter or business, I want to understand how I can support the pantry, so that I can contribute surplus food, volunteer, or spread the word in the way that suits me.

#### Acceptance Criteria

1. THE Donate_Section SHALL display the ways a Visitor can support the pantry, including surplus-food partnerships from brands and retailers, volunteering, and spreading the word.
2. WHERE a business or retailer can supply surplus food, THE Donate_Section SHALL display guidance on becoming a surplus-food partner.
3. THE Donate_Section SHALL display a primary call-to-action link to get in touch to support the pantry.

### Requirement 8: Volunteer Section

**User Story:** As a potential volunteer, I want to learn how to get involved, so that I can offer my time to the pantry.

#### Acceptance Criteria

1. THE Volunteer_Section SHALL display descriptive content explaining volunteer roles and how to apply.
2. THE Volunteer_Section SHALL display a call-to-action link that routes a Visitor to the Contact_Section or an external volunteer enquiry destination.

### Requirement 9: Sponsors and Brands Section

**User Story:** As a Visitor, I want to see the brands and sponsors that support the pantry, so that I recognize its community partnerships and credibility.

#### Acceptance Criteria

1. THE Sponsors_Section SHALL display the partner and sponsor imagery from the available brand assets.
2. THE Sponsors_Section SHALL display descriptive content inviting new sponsors to support the pantry.
3. THE Sponsors_Section SHALL provide a text alternative for each sponsor image that identifies the sponsor.

### Requirement 10: GLOW Branding Prominence

**User Story:** As GLOW, I want our name and brand featured prominently, so that visitors recognize GLOW's role in providing the pantry's center.

#### Acceptance Criteria

1. THE Site SHALL display GLOW_Branding in the Hero_Section and the Site_Footer.
2. THE GLOW_Branding SHALL present the "run by GLOW" attribution text alongside the GLOW wordmark.
3. THE Site SHALL provide a text alternative of "Castleford Community Food Pantry, run by GLOW" for the primary logo image.

### Requirement 11: Contact and Location Section

**User Story:** As a Visitor, I want contact details and the pantry's location, so that I can reach the pantry or visit in person.

#### Acceptance Criteria

1. THE Contact_Section SHALL display the pantry's contact email address `castlefordcommunityfoodpantry@gmail.com` and the named phone contacts Laura 07912 861156, Kim 07401 001200, and Tracy 07707 572989.
2. THE Contact_Section SHALL display the pantry's venue addresses, including Airedale Gospel Hall, Royds Ave, Castleford, WF10 3LQ and Cutsyke Christian Church, Cutsyke Rd, Castleford, WF10 5HA.
3. THE Contact_Section SHALL display an embedded map showing the pantry's venue locations.
4. WHEN a Visitor selects the contact email address, THE Site SHALL open the Visitor's email client addressed to `castlefordcommunityfoodpantry@gmail.com`.
5. WHEN a Visitor selects a named phone contact on a device that supports calling, THE Site SHALL initiate a call to that contact's number via a `tel:` link.
6. THE Contact_Section SHALL display links to the pantry's social media profiles where provided.

### Requirement 12: Accessibility

**User Story:** As a Visitor using assistive technology, I want the Site to be accessible, so that I can navigate and understand all content.

#### Acceptance Criteria

1. THE Site SHALL render all text and text images at a contrast ratio of at least 4.5:1 against their background, except large-scale text (18pt or 14pt bold and larger) which SHALL meet at least 3:1.
2. THE Site SHALL render all user interface components and meaningful graphical objects at a contrast ratio of at least 3:1 against adjacent colors.
3. THE Site SHALL provide a non-empty descriptive text alternative for every informative image, and SHALL provide an empty text alternative for every decorative image so that assistive technology does not announce it.
4. THE Site SHALL expose a single document heading structure in which heading levels descend without skipping a level, beginning with exactly one top-level heading per page.
5. WHEN a Visitor navigates the Site using only a keyboard, THE Site SHALL make every interactive element reachable and operable in a logical sequential order without becoming trapped on any element.
6. WHILE an interactive element has keyboard focus, THE Site SHALL display a visible focus indicator that meets a contrast ratio of at least 3:1 against adjacent colors.
7. THE Site SHALL provide a "skip to main content" link that is the first focusable element and that, when activated, moves keyboard focus to the main content region.
8. IF a Visitor has enabled Reduced_Motion, THEN THE Site SHALL suppress all autoplaying motion and all animation not required to convey information or complete a task.
9. THE Site SHALL define a `lang` attribute on the root HTML element identifying the primary content language.
10. THE Site SHALL associate every form input with a programmatically determinable label describing its purpose.

### Requirement 13: Responsive Layout

**User Story:** As a Visitor on any device, I want the Site to adapt to my screen, so that content is readable and usable on mobile, tablet, and desktop.

#### Acceptance Criteria

1. WHILE a Visitor views the Site on a viewport width of 360 pixels or greater, THE Site SHALL render all content without horizontal scrolling.
2. THE Site SHALL use Fluid_Typography so that text sizes scale between defined minimum and maximum values across viewport widths.
3. WHILE a Visitor views the Site on a viewport width of 782 pixels or less, THE Site SHALL stack multi-column sections into a single column.
4. THE Site SHALL render all images responsively so that each image fits within its container at every supported viewport width.

### Requirement 14: Performance

**User Story:** As a Visitor, I want the Site to load quickly, so that I can access information without delay.

#### Acceptance Criteria

1. WHEN the Home_Template loads on a network connection of at least 10 Mbps downstream throughput and no more than 50 ms round-trip latency, THE Site SHALL reach Largest Contentful Paint within 2.5 seconds.
2. WHEN the Home_Template loads, THE Site SHALL maintain a Cumulative Layout Shift score of 0.1 or less, measured from navigation start until 5 seconds after Largest Contentful Paint.
3. THE Site SHALL serve content images in a next-generation image format.
4. THE Site SHALL defer loading of images positioned below the initial viewport until they are within 500 pixels of entering the viewport.
5. WHEN the Hero_Section renders, THE Site SHALL display a poster image for the hero video before the video begins playback.
6. WHEN a page requests the brand font, THE Site SHALL render fallback text with no period of invisible text (0 ms block period) and SHALL replace it with the brand font once the brand font finishes loading.

### Requirement 15: SEO and Metadata

**User Story:** As the pantry, I want the Site to be discoverable, so that people searching for food support in Castleford can find it.

#### Acceptance Criteria

1. THE Site SHALL render a descriptive page title and meta description for the Home_Template.
2. THE Site SHALL render Open Graph and Twitter Card metadata for social sharing, including a sharing image.
3. THE Site SHALL render structured data describing the organization as a local community service, including name, location, and contact details.
4. THE Site SHALL expose an XML sitemap and a `robots.txt` that permits search engine indexing.
5. THE Site SHALL render exactly one top-level heading on the Home_Template.

### Requirement 16: Future Multi-Page Extensibility

**User Story:** As the pantry, I want the one-page site architected for growth, so that sections can become full pages as content expands without rebuilding the theme.

#### Acceptance Criteria

1. THE Block_Theme SHALL provide a reusable page template separate from the Home_Template so that standalone pages can be created in the WordPress editor.
2. WHEN an Editor promotes a section's Block_Pattern into a new standalone page, THE Block_Theme SHALL render that page using the shared Site_Header and Site_Footer.
3. THE Primary_Navigation SHALL support linking a navigation entry to either an in-page anchor or a separate page URL.
4. THE Block_Theme SHALL define a 404 (not found) template and a search results template.

### Requirement 17: Deployment and Environment Configuration

**User Story:** As the developer, I want the Site to run against the defined local environment and version control, so that development and future deployment are reproducible.

#### Acceptance Criteria

1. THE Site SHALL be served at the local URL `https://castleford-food-pantry.test/`.
2. THE Site SHALL connect to the MySQL database named `castleford-food-pantry` on `localhost` at port `3306`.
3. THE Block_Theme source SHALL be tracked in the Git repository with remote `git@github.com:ShaneMuir/castleford-food-pantry.git` on branch `main`.
4. THE repository SHALL include a `.gitignore` that excludes WordPress core files, uploads, and local environment secrets from version control.
